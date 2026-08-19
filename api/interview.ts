// Vercel serverless function: AI interview feedback loop.
// Provider-agnostic. Picks whichever provider key is configured, in order:
//   OPENAI_API_KEY -> ANTHROPIC_API_KEY
// If none is set, returns a deterministic heuristic fallback so the feature
// degrades gracefully instead of hard-failing.
//
// Two actions:
//   action: "grade"   -> score a single answer to one question (Quick Practice)
//   action: "mock"    -> drive a multi-turn mock interview (ask / follow-up / summary)

import type { VercelRequest, VercelResponse } from '@vercel/node';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface GradeBody {
  action: 'grade';
  question: string;
  category: string;
  difficulty: Difficulty;
  modelAnswer?: string;
  userAnswer: string;
}

interface MockTurn {
  role: 'interviewer' | 'candidate';
  content: string;
}

interface MockBody {
  action: 'mock';
  stage: 'next' | 'summary';
  role: string; // target role label, e.g. "DevOps Engineer"
  focus?: string; // optional topic focus, e.g. "Kubernetes"
  difficulty: Difficulty;
  transcript: MockTurn[]; // full conversation so far
  questionCount: number; // how many questions asked so far
  maxQuestions: number;
}

type Body = GradeBody | MockBody;

// ----------------------------- provider plumbing -----------------------------

type Provider = 'openai' | 'anthropic' | 'fallback';

function pickProvider(): { provider: Provider; key: string; model: string } {
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', key: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', key: process.env.ANTHROPIC_API_KEY, model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest' };
  }
  return { provider: 'fallback', key: '', model: '' };
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Calls the selected provider with a chat-style prompt and returns raw text.
async function callLLM(messages: ChatMessage[], opts: { json?: boolean; maxTokens?: number } = {}): Promise<string> {
  const { provider, key, model } = pickProvider();
  const maxTokens = opts.maxTokens ?? 900;

  if (provider === 'anthropic') {
    const system = messages.find((m) => m.role === 'system')?.content;
    const rest = messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content }));
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: rest }),
    });
    if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data?.content?.[0]?.text ?? '';
  }

  // OpenAI chat-completions.
  const base = 'https://api.openai.com/v1/chat/completions';
  const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens, temperature: 0.4 };
  if (opts.json && provider === 'openai') body.response_format = { type: 'json_object' };
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${provider} ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// Pull the first JSON object out of a possibly-noisy LLM reply.
function extractJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ----------------------------- grade action -----------------------------

interface GradeResult {
  score: number; // 0-100
  verdict: string; // one-line summary
  strengths: string[];
  gaps: string[];
  improved: string; // a tightened model answer the candidate could say
  provider: Provider;
}

async function handleGrade(b: GradeBody): Promise<GradeResult> {
  const { provider } = pickProvider();

  if (provider === 'fallback') {
    return fallbackGrade(b);
  }

  const system = [
    'You are a senior DevOps hiring manager running a technical interview.',
    'Grade the candidate answer to the question. Be fair but rigorous, the way a real interviewer would.',
    'Reward correct, specific, well-structured answers. Penalize vague hand-waving, wrong facts, and missing key points.',
    'Return ONLY a JSON object with this exact shape:',
    '{"score": number 0-100, "verdict": "one sentence", "strengths": ["..."], "gaps": ["..."], "improved": "a crisp 3-5 sentence answer the candidate could say out loud"}',
    'Keep each strength and gap to a short phrase. Write in plain professional English. Do not use the dash character that joins clauses.',
  ].join(' ');

  const user = [
    `Question (${b.category}, ${b.difficulty}): ${b.question}`,
    b.modelAnswer ? `Reference answer for your eyes only: ${b.modelAnswer}` : '',
    `Candidate answer: ${b.userAnswer || '(left blank)'}`,
  ].filter(Boolean).join('\n\n');

  const raw = await callLLM(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    { json: true, maxTokens: 800 }
  );
  const parsed = extractJSON<Omit<GradeResult, 'provider'>>(raw);
  if (!parsed || typeof parsed.score !== 'number') {
    return fallbackGrade(b);
  }
  return {
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
    verdict: parsed.verdict || 'Reviewed.',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps.slice(0, 5) : [],
    improved: parsed.improved || (b.modelAnswer ?? ''),
    provider,
  };
}

// ----------------------------- offline scoring core -----------------------------
// Shared, content-aware heuristic used by BOTH the Quick Practice grader and the
// mock-interview summary. It measures how much of the model answer's meaning the
// candidate actually covered, not just how many words they typed. Wrong, empty,
// or off-topic answers score low. Honest by design.

const STOP = new Set(
  ('the a an and or but is are was were be been being to of in on for with as that this it its by from at into your you ' +
    'do does did have has had will would can could should i we they he she them us my our their what how why when where ' +
    'which who about so if then than also just very more most some any all not no yes ok okay like get got make use using used')
    .split(' ')
);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

// A broad DevOps vocabulary. Used only as a safety net so that a substantive,
// on-topic answer to a question we could not map to a bank entry (for example an
// LLM-generated follow-up) is not unfairly scored as zero. Real concept coverage
// from the question's own keywords always takes precedence over this.
const DEVOPS_TERMS = new Set(
  ('container containers docker image images kubernetes pod pods cluster node nodes deployment deploy rollout rollback ' +
    'pipeline ci cd build cache parallel artifact artifacts dependencies test tests staging production environment ' +
    'terraform state module modules infrastructure provision ansible config configmap secret secrets vault variables ' +
    'network networking tcp udp dns proxy load balancer balancing subnet cidr firewall ingress egress service services ' +
    'monitoring observability metrics logs logging tracing alert alerts prometheus grafana dashboard sli slo error budget ' +
    'reliability availability latency throughput incident postmortem toil sre uptime downtime ' +
    'linux kernel process memory cpu disk permissions signal sigterm sigkill script bash idempotent ' +
    'canary blue green rolling probe liveness readiness oomkilled crashloopbackoff namespace cgroups isolation ' +
    'volume mount persistent storage stateful stateless replica scale autoscale scaling traffic health failover ' +
    'gitops argo flux iam role roles policy least privilege oidc token rotate rotation retry backoff circuit breaker ' +
    'timeout fallback bulkhead resilience version versioned immutable feature flag gradual blast radius drift lock backend ' +
    'aws gcp azure cloud vpc region zone instance instances kubectl helm yaml manifest declarative apply plan')
    .split(' ')
);

interface ContentScore {
  score: number; // 0-100, content-aware
  coverage: number; // 0-1 fraction of model concepts covered
  overlap: string[]; // model concepts the candidate hit
  missing: string[]; // model concepts the candidate missed
  words: number; // candidate word count (content words)
  empty: boolean;
}

// Score a single answer against a reference answer (or a list of expected
// keywords). Returns a content-aware 0-100 with no artificial floor, so a wrong
// or empty answer genuinely lands near zero.
function scoreContent(userAnswer: string, reference: string, expectedKeywords: string[] = []): ContentScore {
  const ans = (userAnswer || '').trim();
  const userTokens = tokenize(ans);
  const userSet = new Set(userTokens);
  if (!ans || userTokens.length === 0) {
    return { score: 0, coverage: 0, overlap: [], missing: [], words: 0, empty: true };
  }

  // Build the set of concepts we expect. Prefer explicit keywords; fall back to
  // the salient words of the reference answer.
  const refTokens = tokenize(reference);
  // Keep the most informative reference words (dedup, longer words first as a
  // rough proxy for specificity).
  const refRanked = [...new Set(refTokens)].sort((a, b) => b.length - a.length);
  const concepts = new Set<string>(expectedKeywords.map((k) => k.toLowerCase()));
  for (const w of refRanked) {
    if (concepts.size >= 12) break;
    concepts.add(w);
  }

  const conceptList = [...concepts];
  const lengthFactor = Math.min(1, userTokens.length / 30); // ~30 content words = full credit

  // Safety net: if we have no specific concepts to grade against (an unmatched
  // follow-up question with no reference answer), fall back to scoring how
  // on-topic and substantive the answer is using the DevOps vocabulary. This
  // prevents a genuinely good answer from being unfairly scored as zero, while
  // still keeping off-topic filler low because it contains few or no DevOps terms.
  if (conceptList.length === 0) {
    const techHits = userTokens.filter((w) => DEVOPS_TERMS.has(w));
    const uniqueTech = new Set(techHits);
    // Density of on-topic vocabulary, capped so a handful of solid terms is enough.
    const topicality = Math.min(1, uniqueTech.size / 6);
    const raw = topicality * 0.8 + Math.min(topicality * 2, 1) * lengthFactor * 0.2;
    const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);
    return { score, coverage: topicality, overlap: [...uniqueTech].slice(0, 6), missing: [], words: userTokens.length, empty: false };
  }

  const overlap = conceptList.filter((w) => userSet.has(w));
  const missing = conceptList.filter((w) => !userSet.has(w));
  const coverage = conceptList.length ? overlap.length / conceptList.length : 0;

  // Length is a small modifier only, and only matters once coverage exists. A
  // long answer that covers nothing still scores near zero.
  // 85% of the score is genuine concept coverage, 15% is having enough substance
  // to follow, but that 15% is gated by coverage so empty filler cannot inflate.
  const raw = coverage * 0.85 + Math.min(coverage * 2, 1) * lengthFactor * 0.15;
  const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);

  return { score, coverage, overlap, missing, words: userTokens.length, empty: false };
}

// Deterministic, offline grader for a single Quick Practice answer. Content
// aware, honest about being a heuristic, never pretends to be the AI.
function fallbackGrade(b: GradeBody): GradeResult {
  // Quick Practice always sends its own modelAnswer. Mock interview questions
  // are asked live and do not, so look the question up in the same bank the
  // mock summary uses. That gives the same content-aware scoring and a real
  // model answer to study, instead of a generic on-topic guess.
  const bankEntry = !b.modelAnswer ? bankEntryForQuestion(b.question) : null;
  const reference = b.modelAnswer ?? bankEntry?.model ?? '';
  const keywords = bankEntry?.keywords ?? [];

  const ans = (b.userAnswer || '').trim();
  if (!ans) {
    return {
      score: 0,
      verdict: 'No answer was given, so there is nothing to assess yet.',
      strengths: [],
      gaps: ['Write out your answer, even a rough one, to get feedback.'],
      improved: reference,
      provider: 'fallback',
    };
  }

  const cs = scoreContent(ans, reference, keywords);
  const score = cs.score;

  let verdict: string;
  if (score >= 80) verdict = 'Strong answer that covers the key ideas. Tighten the phrasing and you are interview ready.';
  else if (score >= 60) verdict = 'A solid attempt, but a few important points are thin or missing.';
  else if (score >= 35) verdict = 'Partly there. You are missing several of the core concepts for this question.';
  else if (score >= 15) verdict = 'This misses most of what the question is really asking for.';
  else verdict = 'This does not answer the question. Study the model answer, then try again.';

  const strengths: string[] = [];
  if (cs.overlap.length > 0) strengths.push(`Touches on ${cs.overlap.slice(0, 4).join(', ')}`);
  if (cs.words >= 40 && cs.coverage >= 0.4) strengths.push('Gives enough detail to follow');
  if (strengths.length === 0) strengths.push('You put an answer down, which is the first step');

  const gaps: string[] = [];
  if (cs.coverage < 0.5 && cs.missing.length) gaps.push(`Missing key ideas: ${cs.missing.slice(0, 5).join(', ')}`);
  else if (cs.missing.length) gaps.push(`Consider also covering: ${cs.missing.slice(0, 4).join(', ')}`);
  if (cs.words < 15) gaps.push('Too short to show real understanding. Explain the why, not just the what');
  if (gaps.length === 0) gaps.push('Add a concrete example to make it memorable');

  return {
    score,
    verdict,
    strengths: strengths.slice(0, 3),
    gaps: gaps.slice(0, 3),
    improved: reference,
    provider: 'fallback',
  };
}

// ----------------------------- mock action -----------------------------

interface QuestionReview {
  question: string; // the interviewer question
  answer: string; // what the candidate actually said
  score: number; // 0-100 for this single answer
  covered: string[]; // concepts the answer hit
  missing: string[]; // concepts the answer missed
  model: string; // a strong model answer to learn from ('' when unknown)
}

interface MockResult {
  message: string; // interviewer's next line (question/follow-up) OR the summary text
  done: boolean;
  scorecard?: {
    overall: number;
    dimensions: { label: string; score: number; note: string }[];
    summary: string;
    nextSteps: string[];
    review?: QuestionReview[]; // per-question breakdown with model answers
  };
  provider: Provider;
}

async function handleMock(b: MockBody): Promise<MockResult> {
  const { provider } = pickProvider();

  if (provider === 'fallback') {
    return fallbackMock(b);
  }

  if (b.stage === 'summary') {
    const system = [
      'You are a senior DevOps hiring manager who just finished a mock interview.',
      'Write an honest, constructive scorecard based on the full transcript.',
      'Score on actual correctness, not length. A wrong or empty answer must score low.',
      'For every question the candidate answered, include a review item with the question, what they said, a score, the key concepts they covered and missed, and a strong model answer (3 to 5 sentences) that shows how a great candidate would answer, so the learner can study it.',
      'Return ONLY JSON:',
      '{"overall": 0-100, "dimensions": [{"label":"Technical depth","score":0-100,"note":"short"},{"label":"Communication","score":0-100,"note":"short"},{"label":"Structure","score":0-100,"note":"short"}], "summary":"2-3 sentences", "nextSteps":["...","..."], "review":[{"question":"...","answer":"what they said","score":0-100,"covered":["concept"],"missing":["concept"],"model":"a strong model answer to learn from"}]}',
      'Be specific to what the candidate actually said. Plain professional English. Do not use the dash character that joins clauses.',
    ].join(' ');
    const transcript = b.transcript.map((t) => `${t.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${t.content}`).join('\n');
    const raw = await callLLM(
      [{ role: 'system', content: system }, { role: 'user', content: `Role: ${b.role}\nFocus: ${b.focus || 'general DevOps'}\n\nTranscript:\n${transcript}` }],
      { json: true, maxTokens: 1600 }
    );
    const parsed = extractJSON<NonNullable<MockResult['scorecard']>>(raw);
    if (!parsed) return fallbackMock(b);
    return { message: parsed.summary, done: true, scorecard: parsed, provider };
  }

  // stage === 'next' -> ask the next question or a follow-up.
  const isFirst = b.questionCount === 0;
  const system = [
    `You are a senior engineer interviewing a candidate for a ${b.role} role.`,
    b.focus ? `Focus the interview on ${b.focus}.` : 'Cover a realistic spread of DevOps topics.',
    `Target difficulty: ${b.difficulty}.`,
    isFirst
      ? 'Open with a warm one-line greeting, then ask your first question.'
      : 'Read the last candidate answer. If it was thin or interesting, ask one sharp follow-up. Otherwise move to a fresh question on a new topic.',
    'Ask exactly one question. Keep it to two or three sentences. Do not give away the answer. Do not number the questions.',
    'Plain conversational English. Do not use the dash character that joins clauses.',
  ].join(' ');

  const history: ChatMessage[] = b.transcript.map((t) => ({
    role: t.role === 'interviewer' ? 'assistant' : 'user',
    content: t.content,
  }));
  const messages: ChatMessage[] = [{ role: 'system', content: system }, ...history];
  if (isFirst) messages.push({ role: 'user', content: 'I am ready to begin.' });

  const text = (await callLLM(messages, { maxTokens: 250 })).trim();
  return { message: text || 'Tell me about a time you debugged a production incident. What did you do first?', done: false, provider };
}

// Each bank question carries the concepts a strong answer should hit AND a written
// model answer the learner can study. The mock summary scores the candidate's
// answer against the concepts (so wrong answers score low) and shows the model
// answer so the learner sees how a strong response actually sounds.
interface BankQ {
  q: string;
  keywords: string[];
  model: string;
}

const FALLBACK_BANK: Record<Difficulty, BankQ[]> = {
  beginner: [
    {
      q: 'Lets start simple. What is the difference between a container and a virtual machine?',
      keywords: ['kernel', 'host', 'hypervisor', 'isolated', 'lightweight', 'guest', 'operating', 'namespaces', 'process', 'portable'],
      model: 'A virtual machine runs a full guest operating system on top of a hypervisor, so each VM carries its own kernel and is heavy to boot. A container shares the host kernel and isolates the app using namespaces and cgroups, so it is just an isolated process. That makes containers far more lightweight, faster to start, and more portable, while VMs give stronger isolation because they do not share a kernel. In practice you reach for containers to pack many services densely, and for VMs when you need hard isolation or a different operating system.',
    },
    {
      q: 'How does a container persist data after it is removed?',
      keywords: ['volume', 'mount', 'persistent', 'storage', 'bind', 'stateful', 'data', 'host', 'ephemeral'],
      model: 'A container filesystem is ephemeral, so anything written inside it is lost when the container is removed. To persist data you mount storage that lives outside the container lifecycle: a named volume managed by the runtime, or a bind mount to a path on the host. For stateful workloads in Kubernetes you use a PersistentVolume backed by a PersistentVolumeClaim so the data survives restarts and reschedules. The rule of thumb is keep the container stateless and push any durable state into a volume or an external database.',
    },
    {
      q: 'What does a load balancer do, and why would a team add one?',
      keywords: ['traffic', 'distribute', 'requests', 'health', 'scale', 'availability', 'failover', 'backend', 'instances'],
      model: 'A load balancer sits in front of multiple backend instances and distributes incoming requests across them, using a strategy like round robin or least connections. It runs health checks and stops sending traffic to any instance that fails, which gives you failover. Teams add one to scale horizontally, since you can add more instances behind the same address, and to improve availability, because one instance going down does not take the service down. It also gives you a single stable entry point for things like TLS termination.',
    },
    {
      q: 'Walk me through what happens when you deploy a new version of an app.',
      keywords: ['build', 'artifact', 'pipeline', 'rollout', 'health', 'rollback', 'traffic', 'version', 'test', 'release'],
      model: 'The pipeline builds the code into an immutable versioned artifact, such as a container image, and runs tests against it. Once it passes, the artifact is pushed to a registry and the deploy stage rolls it out, often gradually with a rolling or canary strategy rather than all at once. Health checks and readiness probes confirm the new version is serving correctly before traffic shifts to it. If metrics or health checks regress, the rollout halts and rolls back to the previous known good version. Keeping artifacts versioned and immutable is what makes that rollback fast and safe.',
    },
  ],
  intermediate: [
    {
      q: 'Walk me through how you would keep a CI pipeline fast as the codebase grows.',
      keywords: ['cache', 'parallel', 'incremental', 'shard', 'artifact', 'dependencies', 'only', 'changed', 'graph', 'nightly'],
      model: 'First I cache dependencies and build layers so each run does not start from scratch. Then I run tests in parallel across shards and only build and test what actually changed, using path filters and a build graph instead of rebuilding everything. I fail fast on the cheapest checks like lint and type checks before the expensive ones. Slow end to end suites move to a nightly stage so the per commit pipeline stays tight. A remote build cache shared across runners avoids redundant work, and I watch pipeline duration as a metric so regressions get caught early.',
    },
    {
      q: 'How do you manage configuration that differs between staging and production?',
      keywords: ['environment', 'secrets', 'vault', 'variables', 'config', 'inject', 'runtime', 'separate', 'manager'],
      model: 'I keep configuration out of the code and the image, and inject it per environment at runtime through environment variables or mounted config. The same immutable artifact runs everywhere, only the config differs, which avoids drift between staging and production. Secrets never live in git; they go in a secrets manager like Vault or the platform secret store and are injected at deploy time, scoped to the jobs that need them. Each environment has its own isolated set of variables, and I prefer short lived credentials over long lived static keys.',
    },
    {
      q: 'A pod is stuck in CrashLoopBackOff. How do you investigate it?',
      keywords: ['logs', 'describe', 'events', 'previous', 'probe', 'oomkilled', 'memory', 'image', 'config', 'exit', 'restart'],
      model: 'I start with kubectl describe pod to read the events and the container exit code, then kubectl logs with the previous flag to see what the crashed container printed before it died. The exit code points the way: 137 usually means it was OOMKilled, so I check memory limits, while a config or missing file shows up as an application error. I verify the image tag, the env and mounted config, and whether a failing liveness probe is killing a healthy app. Once I know the root cause, whether it is memory, a bad config, or a broken probe, I fix that rather than just restarting it.',
    },
    {
      q: 'How would you roll out a risky change while limiting the blast radius?',
      keywords: ['canary', 'blue', 'green', 'rolling', 'percentage', 'rollback', 'monitor', 'feature', 'flag', 'gradual'],
      model: 'I roll it out gradually instead of all at once. A canary sends a small percentage of traffic to the new version first while I watch error rates, latency, and key business metrics, then I ramp up only if it stays healthy. Putting the change behind a feature flag lets me turn it off instantly without a redeploy. Blue green is an option when I want an instant switch with the old version kept warm for immediate rollback. The whole point is to expose few users first, monitor real signals, and have a fast automated rollback if anything regresses.',
    },
  ],
  advanced: [
    {
      q: 'Design a deployment strategy you could roll back in under a minute. Walk me through it.',
      keywords: ['blue', 'green', 'canary', 'rollback', 'traffic', 'switch', 'immutable', 'health', 'previous', 'instant'],
      model: 'I would use blue green with immutable artifacts. The current version is blue, I deploy the new version as green alongside it, run smoke and health checks against green while it takes no live traffic, then flip the load balancer or service to green. Rollback is just flipping traffic back to blue, which is still running, so it is near instant. Because artifacts are immutable and versioned, no rebuild is needed to revert. I keep database migrations backward compatible so the old version can still run, and I wire automated rollback to health checks and SLO burn so a regression flips back without a human in the loop.',
    },
    {
      q: 'How would you structure Terraform state for a team running many environments?',
      keywords: ['remote', 'state', 'backend', 'workspace', 'lock', 'module', 'isolation', 'environment', 'separate', 'drift'],
      model: 'I use a remote backend such as S3 with DynamoDB locking, or Terraform Cloud, so state is shared and locked to prevent concurrent applies from corrupting it. Each environment gets its own isolated state file rather than one giant state, which limits blast radius so a mistake in staging cannot touch production. I factor shared infrastructure into reusable modules and keep environment specific values in separate variable files or workspaces. I enable state locking, restrict who can apply, and run plan in CI to catch drift before it reaches production.',
    },
    {
      q: 'Explain how you would set an SLO and use an error budget to decide when to slow down.',
      keywords: ['slo', 'sli', 'error', 'budget', 'reliability', 'target', 'burn', 'rate', 'freeze', 'availability'],
      model: 'First I pick an SLI that reflects user experience, like the fraction of requests served successfully under a latency threshold. The SLO is the target for that SLI over a window, say 99.9 percent over 30 days. The error budget is the allowed unreliability, the remaining 0.1 percent. I track the burn rate: if the budget is being consumed fast, that is a signal to freeze risky launches and prioritize reliability work, and if there is plenty of budget left, the team can ship faster and take more risk. It turns the ship versus stabilize decision into a data driven one instead of an argument.',
    },
    {
      q: 'A dependency is intermittently failing. What resilience patterns do you reach for?',
      keywords: ['retry', 'backoff', 'circuit', 'breaker', 'timeout', 'fallback', 'bulkhead', 'idempotent', 'degrade'],
      model: 'I set aggressive timeouts so a slow dependency does not block my threads, then add retries with exponential backoff and jitter for transient failures, making sure the operation is idempotent so retries are safe. A circuit breaker trips after repeated failures to stop hammering a sick dependency and gives it time to recover, failing fast in the meantime. I add a fallback or graceful degradation so the user gets a reduced but working experience, and bulkheads isolate that dependency so its failures cannot exhaust resources the rest of the system needs.',
    },
  ],
};

// Map a question string back to its full bank entry (keywords + model answer), so
// we can grade the answer that followed it and show the learner a strong model
// answer, even after follow-ups reshuffle the order.
function bankEntryForQuestion(question: string): BankQ | null {
  // Normalize: lowercase, strip any greeting prefix, drop punctuation/extra space
  // so a prefixed or slightly reworded question still maps to its bank entry.
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/^\s*(good to meet you|nice to meet you|lets start( simple)?|to start|alright|okay|ok)[.,!]?\s*/i, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const q = norm(question);
  if (!q) return null;
  let best: { item: BankQ | null; overlap: number } = { item: null, overlap: 0 };
  for (const diff of Object.keys(FALLBACK_BANK) as Difficulty[]) {
    for (const item of FALLBACK_BANK[diff]) {
      const bq = norm(item.q);
      // Direct containment either way is a strong match.
      if (q.includes(bq) || bq.includes(q)) return item;
      // Otherwise score by how many of the bank question's keywords appear in the
      // asked question, so an LLM follow-up that reuses the topic still maps well.
      const qTokens = new Set(tokenize(q));
      const overlap = item.keywords.filter((k) => qTokens.has(k.toLowerCase())).length;
      if (overlap > best.overlap) best = { item, overlap };
    }
  }
  // Require at least two topic-keyword hits before trusting a fuzzy match;
  // otherwise return null so the DevOps-vocabulary safety net handles scoring.
  return best.overlap >= 2 ? best.item : null;
}

function keywordsForQuestion(question: string): string[] {
  return bankEntryForQuestion(question)?.keywords ?? [];
}

function fallbackMock(b: MockBody): MockResult {
  if (b.stage === 'summary') {
    // Pair each candidate answer with the interviewer question that preceded it,
    // then score the answer on content, not length, and build a per-question
    // review that includes the concepts covered/missed and a model answer to study.
    const review: QuestionReview[] = [];
    const scores: number[] = [];
    let lastQuestion = '';
    for (const turn of b.transcript) {
      if (turn.role === 'interviewer') {
        lastQuestion = turn.content;
      } else {
        const entry = bankEntryForQuestion(lastQuestion);
        const kw = entry?.keywords ?? [];
        const cs = scoreContent(turn.content, '', kw);
        scores.push(cs.score);
        review.push({
          question: lastQuestion.replace(/^\s*(good to meet you|nice to meet you)[.,!]?\s*/i, ''),
          answer: turn.content,
          score: cs.score,
          covered: cs.overlap.slice(0, 6),
          missing: cs.missing.slice(0, 6),
          model: entry?.model ?? '',
        });
      }
    }

    const answered = scores.length;
    const overall = answered ? Math.round(scores.reduce((a, s) => a + s, 0) / answered) : 0;
    // Communication and structure track overall but are not allowed to drift far
    // above it. A wrong answer is not 'clear and easy to follow'.
    const communication = Math.round(Math.min(overall + 6, overall * 1.1 + 4));
    const structure = Math.max(0, Math.round(overall - 4));

    const band = (s: number) =>
      s >= 80 ? 'strong' : s >= 60 ? 'solid' : s >= 35 ? 'shaky' : s >= 15 ? 'weak' : 'failing';
    const tier = band(overall);

    const summaryByTier: Record<string, string> = {
      strong: 'A genuinely strong showing. You hit the core concepts on most questions. Sharpen with concrete examples and you are interview ready.',
      solid: 'A solid run with real substance, but several answers were thin on the key ideas. Name specific tools and explain the why.',
      shaky: 'You are partway there. Many answers missed the core concepts the questions were probing for. Go back and study those topics.',
      weak: 'Most answers did not cover what the questions were really asking. This is a study signal, not a polish signal. Work through the model answers.',
      failing: 'These answers did not address the questions. Use the question bank and model answers to learn the fundamentals, then run this again.',
    };
    const depthNote: Record<string, string> = {
      strong: 'Good coverage of the key ideas',
      solid: 'Right area, but missing some core points',
      shaky: 'Several key concepts were absent',
      weak: 'Core technical concepts were missing',
      failing: 'The answers did not engage the technical substance',
    };
    const nextByTier: Record<string, string[]> = {
      strong: ['Add a concrete example to each answer', 'Time yourself to keep answers tight', 'Try the advanced difficulty'],
      solid: ['Drill the topics you felt shaky on in Quick Practice', 'Name the specific tools you would use', 'Explain the why, not just the what'],
      shaky: ['Study the model answers for the questions you missed', 'Practice those topics in Quick Practice', 'Re-run this mock once you have reviewed'],
      weak: ['Work through the question bank with the model answers open', 'Focus on one topic at a time before mixing them', 'Re-run this mock after studying'],
      failing: ['Start with the roadmap modules for these topics', 'Read each model answer in the question bank', 'Come back and try Quick Practice before the next mock'],
    };

    return {
      message: 'Thanks for working through the mock. Here is an honest read based on what you actually said.',
      done: true,
      provider: 'fallback',
      scorecard: {
        overall,
        dimensions: [
          { label: 'Technical depth', score: overall, note: depthNote[tier] },
          { label: 'Communication', score: communication, note: overall >= 50 ? 'Clear enough to follow' : 'Hard to follow when the substance is missing' },
          { label: 'Structure', score: structure, note: overall >= 50 ? 'Lead with the answer, then the reasoning' : 'Build the answer around the core concept first' },
        ],
        summary: summaryByTier[tier],
        nextSteps: nextByTier[tier],
        review,
      },
    };
  }
  const bank = FALLBACK_BANK[b.difficulty];
  const idx = b.questionCount % bank.length;
  const intro = b.questionCount === 0 ? 'Good to meet you. ' : '';
  return { message: intro + bank[idx].q, done: false, provider: 'fallback' };
}

// ----------------------------- handler -----------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Body;
    if (!body || !body.action) {
      res.status(400).json({ error: 'Missing action' });
      return;
    }
    if (body.action === 'grade') {
      const result = await handleGrade(body);
      res.status(200).json(result);
      return;
    }
    if (body.action === 'mock') {
      const result = await handleMock(body);
      res.status(200).json(result);
      return;
    }
    res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    // Never leak provider internals to the client; log server-side.
    console.error('interview api error:', msg);
    res.status(500).json({ error: 'The interviewer is unavailable right now. Please try again.' });
  }
}
