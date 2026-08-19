import { useEffect, useRef, useState } from 'react';
import { Button, Ring } from '../ui';
import { Icon } from '../Icon';
import { FallbackNote } from './QuickPractice';
import { mockNext, mockSummary, type MockTurn, type ScoreCard, type Provider } from '../../lib/ai';
import { useSpeechToText, useTextToSpeech } from '../../lib/useVoice';
import type { Difficulty } from '../../data/types';

type Stage = 'setup' | 'interviewing' | 'thinking' | 'summarizing' | 'done' | 'error';

const ROLES = ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer', 'Cloud Engineer'];
const FOCUS = ['General DevOps', 'Kubernetes', 'CI/CD', 'Terraform', 'Networking', 'Observability'];
const DIFFS: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const MAX_QUESTIONS = 5;

export function MockInterview({ onClose }: { onClose?: () => void }) {
  const [stage, setStage] = useState<Stage>('setup');
  const [role, setRole] = useState(ROLES[0]);
  const [focus, setFocus] = useState(FOCUS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');

  const [transcript, setTranscript] = useState<MockTurn[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [draft, setDraft] = useState('');
  const [scorecard, setScorecard] = useState<ScoreCard | null>(null);
  const [provider, setProvider] = useState<Provider>('fallback');
  const [error, setError] = useState('');

  // Which per-question review cards are expanded to show the model answer.
  const [openReview, setOpenReview] = useState<Record<number, boolean>>({});
  const toggleReview = (i: number) => setOpenReview((o) => ({ ...o, [i]: !o[i] }));

  // Voice: speech-to-text for answers, text-to-speech for questions.
  const stt = useSpeechToText();
  const tts = useTextToSpeech();
  const voicePossible = stt.supported || tts.supported;
  const [voiceMode, setVoiceMode] = useState(false); // chosen at setup
  const lastSpokenRef = useRef<string>(''); // avoid re-speaking the same line

  // While the mic is live, mirror the transcript into the draft so the user sees
  // their words land in the answer box and can edit before sending.
  useEffect(() => {
    if (stt.listening && stt.transcript) setDraft(stt.transcript);
  }, [stt.transcript, stt.listening]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [transcript, stage]);

  // Speak each new interviewer line out loud when voice + TTS are on.
  useEffect(() => {
    if (!voiceMode || !tts.enabled || !tts.supported) return;
    const last = transcript[transcript.length - 1];
    if (last && last.role === 'interviewer' && last.content !== lastSpokenRef.current) {
      lastSpokenRef.current = last.content;
      tts.speak(last.content);
    }
  }, [transcript, voiceMode, tts]);

  const focusValue = focus === 'General DevOps' ? undefined : focus;

  const toggleMic = () => {
    if (stt.listening) {
      stt.stop();
    } else {
      tts.cancel(); // do not record the interviewer's own voice
      stt.reset();
      setDraft('');
      stt.start();
    }
  };

  const start = async () => {
    setStage('thinking');
    setError('');
    try {
      const r = await mockNext({ role, focus: focusValue, difficulty, transcript: [], questionCount: 0, maxQuestions: MAX_QUESTIONS });
      setProvider(r.provider);
      setTranscript([{ role: 'interviewer', content: r.message }]);
      setQuestionCount(1);
      setStage('interviewing');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start the interview.');
      setStage('error');
    }
  };

  const send = async () => {
    if (!draft.trim()) return;
    if (stt.listening) stt.stop();
    const myTurn: MockTurn = { role: 'candidate', content: draft.trim() };
    const next = [...transcript, myTurn];
    setTranscript(next);
    setDraft('');

    // If we have hit the question budget, go straight to the scorecard.
    if (questionCount >= MAX_QUESTIONS) {
      await wrapUp(next);
      return;
    }

    setStage('thinking');
    try {
      const r = await mockNext({ role, focus: focusValue, difficulty, transcript: next, questionCount, maxQuestions: MAX_QUESTIONS });
      setProvider(r.provider);
      setTranscript([...next, { role: 'interviewer', content: r.message }]);
      setQuestionCount((c) => c + 1);
      setStage('interviewing');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The interviewer dropped off. Try again.');
      setStage('error');
    }
  };

  const wrapUp = async (finalTranscript: MockTurn[]) => {
    setStage('summarizing');
    try {
      const r = await mockSummary({ role, focus: focusValue, difficulty, transcript: finalTranscript, questionCount, maxQuestions: MAX_QUESTIONS });
      setProvider(r.provider);
      setScorecard(r.scorecard ?? null);
      setStage('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not build the scorecard.');
      setStage('error');
    }
  };

  const restart = () => {
    tts.cancel();
    if (stt.listening) stt.stop();
    lastSpokenRef.current = '';
    setStage('setup');
    setTranscript([]);
    setQuestionCount(0);
    setDraft('');
    setScorecard(null);
    setError('');
  };

  return (
    <div className="glass rounded-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line p-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-bg text-white shadow-glow-sm">
            <Icon name="sparkle" size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-fg">Mock interview</p>
            <p className="text-xs text-fg-faint">
              {stage === 'setup' ? 'Set it up below' : `${role}${focusValue ? ` \u00b7 ${focus}` : ''}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {voiceMode && tts.supported && (stage === 'interviewing' || stage === 'thinking') && (
            <button
              onClick={() => {
                if (tts.enabled) tts.cancel();
                tts.setEnabled(!tts.enabled);
              }}
              aria-label={tts.enabled ? 'Mute spoken questions' : 'Unmute spoken questions'}
              title={tts.enabled ? 'Mute spoken questions' : 'Unmute spoken questions'}
              className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                tts.speaking ? 'text-accent' : 'text-fg-faint hover:bg-card-2 hover:text-fg'
              }`}
            >
              <Icon name={tts.enabled ? 'volume' : 'volume-off'} size={18} />
            </button>
          )}
          {(stage === 'interviewing' || stage === 'thinking') && (
            <span className="mono hidden rounded-full border border-line bg-page px-2.5 py-1 text-[11px] text-fg-muted sm:inline">
              Q {Math.min(questionCount, MAX_QUESTIONS)} / {MAX_QUESTIONS}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close interview"
              className="grid h-8 w-8 place-items-center rounded-lg text-fg-faint transition-colors hover:bg-card-2 hover:text-fg"
            >
              <Icon name="x" size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Setup */}
      {stage === 'setup' && (
        <div className="space-y-5 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-fg-muted">
            A real, back-and-forth interview. The AI asks {MAX_QUESTIONS} questions, follows up on your answers, then gives you an honest scorecard.
          </p>
          <Selector label="Target role" options={ROLES} value={role} onChange={setRole} />
          <Selector label="Focus" options={FOCUS} value={focus} onChange={setFocus} />
          <div>
            <p className="mono mb-2 text-[10px] uppercase tracking-eyebrow text-fg-faint">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium capitalize transition-all ${
                    difficulty === d
                      ? 'gradient-bg border-transparent text-white shadow-glow-sm'
                      : 'border-line bg-card text-fg-muted hover:border-fg-faint hover:text-fg'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          {voicePossible && (
            <button
              type="button"
              onClick={() => setVoiceMode((v) => !v)}
              aria-pressed={voiceMode}
              className={`flex w-full items-center gap-3 rounded-btn border p-3.5 text-left transition-all ${
                voiceMode ? 'border-accent/60 bg-accent/10' : 'border-line bg-card hover:border-fg-faint'
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  voiceMode ? 'gradient-bg text-white shadow-glow-sm' : 'bg-card-2 text-fg-muted'
                }`}
              >
                <Icon name={voiceMode ? 'mic' : 'mic-off'} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-fg">Voice mode</span>
                <span className="block text-xs leading-relaxed text-fg-muted">
                  {voiceMode
                    ? 'The interviewer speaks and you answer out loud. You can still type.'
                    : 'Talk through your answers like a real interview. Tap to turn on.'}
                </span>
              </span>
              <span
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${voiceMode ? 'bg-accent' : 'bg-line'}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${voiceMode ? 'left-[18px]' : 'left-0.5'}`}
                />
              </span>
            </button>
          )}
          <Button onClick={start} icon="play" size="lg" className="w-full">
            Start the interview
          </Button>
        </div>
      )}

      {/* Chat */}
      {(stage === 'interviewing' || stage === 'thinking' || stage === 'summarizing') && (
        <>
          <div ref={scrollRef} className="max-h-[52vh] space-y-4 overflow-y-auto p-5 sm:p-6">
            {transcript.map((t, i) => (
              <ChatBubble key={i} turn={t} />
            ))}
            {(stage === 'thinking' || stage === 'summarizing') && <TypingBubble label={stage === 'summarizing' ? 'Writing your scorecard' : undefined} />}
          </div>

          {/* Composer */}
          <div className="border-t border-line p-4 sm:p-5">
            {questionCount >= MAX_QUESTIONS && stage === 'interviewing' && (
              <p className="mb-2.5 text-center text-xs text-fg-faint">Last question. Your next answer wraps up the interview.</p>
            )}
            <div className="flex items-end gap-2.5">
              {voiceMode && stt.supported && (
                <button
                  onClick={toggleMic}
                  disabled={stage !== 'interviewing'}
                  aria-label={stt.listening ? 'Stop recording' : 'Start recording your answer'}
                  title={stt.listening ? 'Stop recording' : 'Speak your answer'}
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-btn border transition-all disabled:opacity-50 ${
                    stt.listening
                      ? 'border-transparent gradient-bg text-white shadow-glow-sm mic-pulse'
                      : 'border-line bg-page text-fg-muted hover:border-accent hover:text-accent'
                  }`}
                >
                  <Icon name="mic" size={20} />
                </button>
              )}
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send();
                }}
                disabled={stage !== 'interviewing'}
                placeholder={
                  stage !== 'interviewing'
                    ? 'Hold on...'
                    : stt.listening
                    ? 'Listening... speak your answer'
                    : voiceMode && stt.supported
                    ? 'Tap the mic to talk, or type. Cmd or Ctrl + Enter to send.'
                    : 'Type your answer. Cmd or Ctrl + Enter to send.'
                }
                rows={2}
                className="min-h-[48px] w-full resize-y rounded-btn border border-line bg-page p-3 text-sm leading-relaxed text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-accent disabled:opacity-60"
              />
              <Button onClick={send} disabled={!draft.trim() || stage !== 'interviewing'} icon="arrow-right" className="shrink-0">
                Send
              </Button>
            </div>
            {voiceMode && stt.error && (
              <p className="mt-2 text-xs font-medium text-optional">{stt.error}</p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FallbackNote provider={provider} />
                {voiceMode && stt.listening && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-accent">
                    <span className="mic-dot h-1.5 w-1.5 rounded-full bg-accent" />
                    Recording
                  </span>
                )}
              </div>
              {stage === 'interviewing' && questionCount < MAX_QUESTIONS && (
                <button onClick={() => wrapUp(transcript)} className="text-xs font-medium text-fg-faint transition-colors hover:text-fg">
                  End early and see scorecard
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Scorecard */}
      {stage === 'done' && scorecard && (
        <div className="fade-up space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Ring value={scorecard.overall} size={88} stroke={7} />
              <div>
                <p className="text-xs text-fg-faint">Overall</p>
                <p className="font-display text-2xl font-bold text-fg">{scorecard.overall}<span className="text-base text-fg-faint">/100</span></p>
              </div>
            </div>
            <FallbackNote provider={provider} />
          </div>

          <p className="text-sm leading-relaxed text-fg">{scorecard.summary}</p>

          <div className="space-y-3">
            {scorecard.dimensions.map((d, i) => (
              <div key={i} className="rounded-btn border border-line bg-page p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-fg">{d.label}</span>
                  <span className="mono text-sm font-semibold text-accent">{d.score}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ringtrack">
                  <div className="h-full gradient-bg rounded-full" style={{ width: `${Math.max(0, Math.min(100, d.score))}%` }} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-fg-muted">{d.note}</p>
              </div>
            ))}
          </div>

          {scorecard.nextSteps.length > 0 && (
            <div className="rounded-btn border border-line bg-page p-4">
              <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-accent">
                <Icon name="arrow-right" size={15} strokeWidth={2.5} />
                Where to go next
              </p>
              <ul className="space-y-1.5">
                {scorecard.nextSteps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-fg-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scorecard.review && scorecard.review.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="mono text-[10px] uppercase tracking-eyebrow text-accent">Review every question</p>
                <span className="text-xs text-fg-faint">{'\u00b7'} see how a strong answer sounds</span>
              </div>
              {scorecard.review.map((r, i) => {
                const open = !!openReview[i];
                return (
                  <div key={i} className="rounded-btn border border-line bg-page p-4">
                    <button
                      onClick={() => toggleReview(i)}
                      className="flex w-full items-start justify-between gap-3 text-left"
                      aria-expanded={open}
                    >
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="mono text-[10px] text-fg-faint">Q{i + 1}</span>
                          <span className="mono text-xs font-semibold text-accent">{r.score}/100</span>
                        </span>
                        <span className="mt-1 block text-sm font-semibold leading-relaxed text-fg">{r.question}</span>
                      </span>
                      <Icon name="chevron-down" size={16} className={`mt-0.5 shrink-0 text-fg-faint transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`collapsible ${open ? 'open' : ''}`}>
                      <div className="collapsible-inner">
                        <div className="space-y-3 pt-3">
                          {r.answer && (
                            <div>
                              <p className="mono mb-1 text-[10px] uppercase tracking-eyebrow text-fg-faint">Your answer</p>
                              <p className="text-sm leading-relaxed text-fg-muted">{r.answer}</p>
                            </div>
                          )}
                          {(r.covered.length > 0 || r.missing.length > 0) && (
                            <div className="flex flex-wrap gap-1.5">
                              {r.covered.map((c, j) => (
                                <span key={`c${j}`} className="inline-flex items-center gap-1 rounded-full border border-done/30 bg-done/10 px-2 py-0.5 text-[11px] text-done">
                                  <Icon name="check" size={11} strokeWidth={2.5} />
                                  {c}
                                </span>
                              ))}
                              {r.missing.map((m, j) => (
                                <span key={`m${j}`} className="inline-flex items-center gap-1 rounded-full border border-optional/30 bg-optional/10 px-2 py-0.5 text-[11px] text-optional">
                                  <Icon name="target" size={11} strokeWidth={2.5} />
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}
                          {r.model && (
                            <div className="rounded-btn border border-line bg-card p-3.5">
                              <p className="mono mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-eyebrow text-accent">
                                <Icon name="sparkle" size={12} />
                                How a strong answer sounds
                              </p>
                              <p className="text-sm leading-relaxed text-fg">{r.model}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Support card linking to the Edufly PayPal.Me. */}
          <div className="rounded-card border border-line bg-page p-5 text-center">
            <p className="font-display text-base font-bold text-fg">Find this useful?</p>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Edufly is free and always will be. If it helped you prep, you can chip in to keep it running.
            </p>
            <a
              href="https://paypal.me/udayk1109"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-btn gradient-bg px-4 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition-transform hover:scale-[1.02]"
            >
              <Icon name="sparkle" size={15} />
              Support Edufly
              <Icon name="external" size={14} />
            </a>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button onClick={restart} icon="play">
              Run another
            </Button>
            {onClose && (
              <Button variant="light" onClick={onClose}>
                Done
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {stage === 'error' && (
        <div className="p-5 sm:p-6">
          <div className="rounded-btn border border-optional/30 bg-optional/10 p-4">
            <p className="text-sm font-medium text-fg">{error}</p>
            <Button variant="light" size="sm" className="mt-3" icon="arrow-right" onClick={restart}>
              Start over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Selector({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mono mb-2 text-[10px] uppercase tracking-eyebrow text-fg-faint">{label}</p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
              value === o
                ? 'gradient-bg border-transparent text-white shadow-glow-sm'
                : 'border-line bg-card text-fg-muted hover:border-fg-faint hover:text-fg'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ turn }: { turn: MockTurn }) {
  const isInterviewer = turn.role === 'interviewer';
  return (
    <div className={`flex gap-3 ${isInterviewer ? '' : 'flex-row-reverse'}`}>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
          isInterviewer ? 'gradient-bg text-white' : 'bg-card-2 text-fg-muted'
        }`}
      >
        {isInterviewer ? <Icon name="sparkle" size={15} /> : 'You'}
      </span>
      <div
        className={`max-w-[82%] rounded-card border px-4 py-3 text-sm leading-relaxed ${
          isInterviewer ? 'border-line bg-page text-fg' : 'border-transparent gradient-bg text-white'
        }`}
      >
        {turn.content}
      </div>
    </div>
  );
}

function TypingBubble({ label }: { label?: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-bg text-white">
        <Icon name="sparkle" size={15} />
      </span>
      <div className="flex items-center gap-2 rounded-card border border-line bg-page px-4 py-3.5">
        <span className="flex gap-1">
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-faint" style={{ animationDelay: '0ms' }} />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-faint" style={{ animationDelay: '200ms' }} />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-faint" style={{ animationDelay: '400ms' }} />
        </span>
        {label && <span className="text-xs text-fg-faint">{label}</span>}
      </div>
    </div>
  );
}
