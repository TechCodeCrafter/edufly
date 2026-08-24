import type { Question } from './types';

const q = (id: string, question: string, category: string, difficulty: Question['difficulty'], answer: string): Question => ({ id, question, category, difficulty, answer });

export const questions: Question[] = [
  // Docker
  q('q-docker-1', 'What is the difference between a container and a virtual machine?', 'Docker', 'beginner',
    'A VM virtualizes hardware and runs a full guest operating system on a hypervisor, so it is heavy and slow to start. A container is an isolated process that shares the host kernel using namespaces and cgroups, so it starts in milliseconds and uses far fewer resources. Containers package the app and its dependencies but not a full OS, which is why they are smaller and more portable.'),
  q('q-docker-2', 'Explain the layers in a Docker image and the build cache.', 'Docker', 'intermediate',
    'Each instruction in a Dockerfile creates a read-only layer, and layers stack into the final image. Docker caches each layer and reuses it on the next build if the instruction and its inputs are unchanged. To maximize cache hits, order instructions from least to most frequently changing, for example copy the dependency manifest and install before copying source code.'),
  q('q-docker-3', 'How do you reduce Docker image size?', 'Docker', 'intermediate',
    'Use a small base image such as Alpine or distroless, use multi-stage builds so only the final artifact ships, combine and clean up package installs in a single RUN, copy only what you need, and use a dotignore file to keep build context lean. A multi-stage build that compiles in a fat builder and copies the binary into a minimal runtime is usually the biggest win.'),
  q('q-docker-4', 'What is the difference between CMD and ENTRYPOINT?', 'Docker', 'intermediate',
    'ENTRYPOINT defines the executable that always runs, while CMD provides default arguments that are easy to override at runtime. A common pattern is ENTRYPOINT for the binary and CMD for default flags, so users can pass their own arguments without retyping the command. Both should use the exec form, a JSON array, to avoid an extra shell process.'),
  q('q-docker-5', 'How do containers persist data?', 'Docker', 'beginner',
    'Containers are ephemeral, so anything written to the container layer is lost when the container is removed. Use volumes for data that must persist, which Docker manages outside the container lifecycle, or bind mounts to map a host directory in, which is handy in development. For databases, always use a named volume.'),
  q('q-docker-6', 'How do two containers communicate?', 'Docker', 'beginner',
    'Place them on the same user-defined bridge network and they can reach each other by container name, since Docker provides built-in DNS resolution. The default bridge network does not give name resolution, so always create a user-defined network for multi-container apps, which is exactly what Compose does for you.'),

  // Kubernetes
  q('q-k8s-1', 'What is a Pod in Kubernetes?', 'Kubernetes', 'beginner',
    'A Pod is the smallest deployable unit and represents one or more containers that share the same network namespace and storage. Containers in a Pod can reach each other on localhost and share mounted volumes. You rarely create Pods directly; controllers like Deployments manage them so they are recreated and scaled automatically.'),
  q('q-k8s-2', 'What is the difference between a Deployment and a StatefulSet?', 'Kubernetes', 'intermediate',
    'A Deployment manages stateless, interchangeable pods with random names and is ideal for web servers and APIs. A StatefulSet gives pods stable, ordered identities and stable per-pod storage, which is required for stateful systems like databases and clustered queues that need predictable names and persistent disks.'),
  q('q-k8s-3', 'How does a Service discover Pods?', 'Kubernetes', 'intermediate',
    'A Service selects pods using label selectors and tracks their IPs in an Endpoints object that updates as pods come and go. The Service gets a stable virtual IP and DNS name, so clients connect to the Service and kube-proxy load-balances to the current healthy pods, insulating callers from pod churn.'),
  q('q-k8s-4', 'Explain the Kubernetes control plane components.', 'Kubernetes', 'advanced',
    'The API server is the front door that validates and persists all state to etcd, the cluster key-value store. The scheduler assigns pending pods to nodes based on resources and constraints. The controller-manager runs reconciliation loops that drive actual state toward desired state. On each node, the kubelet runs pods and kube-proxy programs service networking.'),
  q('q-k8s-5', 'What is the difference between a ConfigMap and a Secret?', 'Kubernetes', 'beginner',
    'Both inject configuration into pods as env vars or mounted files, but ConfigMaps hold non-sensitive data while Secrets hold sensitive data. Secrets are base64-encoded, not encrypted, by default, so enable encryption at rest and restrict access with RBAC. Treat Secrets as sensitive even though the encoding is not real protection.'),
  q('q-k8s-6', 'How would you debug a pod stuck in CrashLoopBackOff?', 'Kubernetes', 'intermediate',
    'Start with kubectl describe pod to read events, then kubectl logs with the previous flag to see output from the crashed container. Common causes are a failing command or bad config, a missing dependency or secret, a failing liveness probe, or an out-of-memory kill. Fix the root cause, then watch the restart succeed.'),
  q('q-k8s-7', 'What are requests and limits, and why do they matter?', 'Kubernetes', 'intermediate',
    'Requests are the resources guaranteed to a container and used by the scheduler to place it; limits are the hard ceiling. If a container exceeds its memory limit it is OOM-killed, and exceeding CPU limit throttles it. Setting them well prevents noisy-neighbor problems and enables reliable autoscaling.'),
  q('q-k8s-8', 'How does RBAC work in Kubernetes?', 'Kubernetes', 'advanced',
    'RBAC grants permissions through Roles or ClusterRoles that list allowed verbs on resources, bound to subjects via RoleBindings or ClusterRoleBindings. Subjects are users, groups, or service accounts. Pods authenticate with service accounts. The guiding rule is least privilege: grant only the specific verbs and resources each workload needs.'),
  q('q-k8s-9', 'What happens when you run kubectl apply?', 'Kubernetes', 'advanced',
    'The manifest is sent to the API server, authenticated, authorized via RBAC, and validated by admission controllers. The desired state is written to etcd. Controllers notice the change and reconcile: the Deployment controller creates a ReplicaSet, which creates pods, the scheduler binds them to nodes, and kubelets start the containers.'),

  // CI/CD
  q('q-cicd-1', 'What is the difference between continuous delivery and continuous deployment?', 'CI/CD', 'beginner',
    'Continuous delivery means every change that passes the pipeline is ready to release, but a human approves the final push to production. Continuous deployment removes that gate, so every green build deploys to production automatically. Both rely on strong automated testing; deployment just trusts the pipeline enough to skip manual approval.'),
  q('q-cicd-2', 'How do you keep a CI pipeline fast?', 'CI/CD', 'intermediate',
    'Cache dependencies between runs, parallelize independent jobs, run the cheapest and most likely to fail checks first to fail fast, and only run heavy end-to-end tests on the right triggers. Building an artifact once and promoting it through stages, rather than rebuilding per stage, also saves significant time.'),
  q('q-cicd-3', 'How should secrets be handled in a pipeline?', 'CI/CD', 'intermediate',
    'Store secrets in the CI provider encrypted store or an external secrets manager, inject them as masked environment variables at runtime, and scope each secret to the minimum jobs or environments. Never commit secrets to the repo or echo them in logs, and rotate them regularly. Prefer short-lived, OIDC-based credentials over long-lived keys.'),
  q('q-cicd-4', 'Explain blue-green versus canary deployment.', 'CI/CD', 'advanced',
    'Blue-green keeps two identical environments and switches all traffic from the old to the new at once, giving instant rollback by switching back. Canary releases the new version to a small slice of traffic, watches metrics, and gradually ramps up, limiting blast radius. Canary catches problems with real traffic; blue-green is simpler but flips everyone at once.'),
  q('q-cicd-5', 'What is a quality gate?', 'CI/CD', 'beginner',
    'A quality gate is an automated checkpoint that must pass before the pipeline continues, such as passing tests, meeting a coverage threshold, no critical vulnerabilities, or successful linting. Gates encode the team standard so bad changes stop automatically instead of relying on people to remember to check.'),
  q('q-cicd-6', 'How do you build a deployment you can confidently roll back?', 'CI/CD', 'advanced',
    'Deploy immutable, versioned artifacts so the previous version is always available, keep database migrations backward-compatible, and decouple deploy from release using feature flags. Automate health checks after deploy and wire automatic rollback on failure. The goal is that reverting is a fast, boring, well-rehearsed operation.'),

  // Terraform
  q('q-tf-1', 'What is Terraform state and why is it important?', 'Terraform', 'intermediate',
    'State is the file that maps your configuration to real-world resources and stores metadata Terraform needs to plan changes. It is the source of truth, so it must be stored remotely with locking, for example S3 with a DynamoDB lock, to prevent corruption when teams run apply concurrently. Losing or corrupting state is one of the worst things that can happen.'),
  q('q-tf-2', 'What is the difference between terraform plan and apply?', 'Terraform', 'beginner',
    'Plan computes the difference between desired configuration and current state and shows exactly what will be created, changed, or destroyed without making any changes. Apply executes that plan against the real infrastructure. You should always read the plan, ideally a saved plan file, before applying in production.'),
  q('q-tf-3', 'How do you manage multiple environments in Terraform?', 'Terraform', 'intermediate',
    'Keep each environment state isolated. Options are separate directories per environment, separate backends, or workspaces. Many teams prefer separate directories or backends because it makes the separation explicit and reduces the risk of applying a change to the wrong environment. Share logic through versioned modules.'),
  q('q-tf-4', 'What is a Terraform module?', 'Terraform', 'beginner',
    'A module is a reusable, encapsulated set of resources defined behind input variables and output values. It lets you package a pattern, like a VPC or an app stack, once and reuse it across teams and environments, pinned to a version. Modules are how you keep infrastructure code DRY and consistent.'),
  q('q-tf-5', 'What is configuration drift and how do you detect it?', 'Terraform', 'advanced',
    'Drift is when the real infrastructure differs from what state and config describe, usually because someone changed it manually. Run terraform plan to detect it, since the plan will show changes needed to reconcile reality with config. Prevent drift by restricting manual changes and routing all changes through code.'),
  q('q-tf-6', 'How do you prevent Terraform from destroying critical resources?', 'Terraform', 'advanced',
    'Use a lifecycle block with prevent_destroy on the resource, always review the plan before apply, restrict who can run apply in production, and use policy as code to block dangerous changes. For shared state, locking prevents concurrent applies that could cause surprises.'),
  q('q-tf-7', 'Why prefer roles over static access keys with Terraform?', 'Terraform', 'intermediate',
    'Static keys are long-lived and leak easily, and rotating them is painful. Assuming a role or using OIDC federation in CI gives short-lived, automatically-rotated credentials scoped to exactly what the run needs. This shrinks the blast radius if anything is exposed and is the modern best practice.'),

  // Networking
  q('q-net-1', 'Walk through what happens when you type a URL and press enter.', 'Networking', 'intermediate',
    'The browser resolves the domain to an IP via DNS, opens a TCP connection to that IP on port 443, performs a TLS handshake to establish encryption and verify the certificate, then sends an HTTP request. The server responds, possibly through a load balancer and CDN, and the browser renders the result. Each step is a place things can break.'),
  q('q-net-2', 'What is the difference between TCP and UDP?', 'Networking', 'beginner',
    'TCP is connection-oriented and reliable: it establishes a connection, guarantees ordered delivery, and retransmits lost packets, which suits web traffic and databases. UDP is connectionless and best-effort with no ordering or retransmission, which suits low-latency, loss-tolerant traffic like DNS, video, and gaming.'),
  q('q-net-3', 'Explain CIDR notation and subnetting.', 'Networking', 'intermediate',
    'CIDR notation like 10.0.0.0/16 marks how many leading bits are the network portion; the rest address hosts. A /16 has 65,536 addresses, a /24 has 256. Subnetting splits a block into smaller networks for isolation and routing, for example public and private subnets within a VPC.'),
  q('q-net-4', 'What is the difference between a forward and a reverse proxy?', 'Networking', 'intermediate',
    'A forward proxy sits in front of clients and forwards their requests outward, often for filtering or caching on the client side. A reverse proxy sits in front of servers and accepts requests on their behalf, providing load balancing, TLS termination, and caching. NGINX as a reverse proxy is the classic example.'),
  q('q-net-5', 'What DNS record types should an engineer know?', 'Networking', 'beginner',
    'A maps a name to an IPv4 address and AAAA to IPv6. CNAME aliases one name to another. MX directs mail. TXT holds arbitrary text, used for SPF, DKIM, and domain verification. NS delegates a zone. TTL controls caching, which is why DNS changes can take time to propagate.'),
  q('q-net-6', 'How do you debug a service that cannot reach another service?', 'Networking', 'advanced',
    'Walk the stack methodically: confirm the target resolves with DNS, check the route exists, verify the port is listening with ss, check firewall or security group rules, and test connectivity with curl or telnet. Tools like tcpdump and mtr show exactly where packets stop. Isolate the layer before guessing.'),
  q('q-net-7', 'What is the difference between L4 and L7 load balancing?', 'Networking', 'advanced',
    'Layer 4 load balancing operates on TCP/UDP and routes by IP and port without inspecting content, so it is fast and protocol-agnostic. Layer 7 understands HTTP and can route by host, path, header, or cookie, enabling features like path-based routing and TLS termination at the cost of more processing.'),

  // Linux
  q('q-linux-1', 'How do you find what is using all the disk space?', 'Linux', 'beginner',
    'Use df -h to see which filesystem is full, then du -sh on directories, often du -sh /var/* sorted by size, to drill into the offender. Common culprits are logs and old artifacts. Watch for deleted-but-open files, which lsof can reveal, since the space is not freed until the holding process closes them.'),
  q('q-linux-2', 'What is the difference between SIGTERM and SIGKILL?', 'Linux', 'intermediate',
    'SIGTERM (15) asks a process to shut down gracefully, letting it clean up, and can be caught or ignored. SIGKILL (9) forcibly terminates immediately and cannot be caught or ignored. Always try SIGTERM first so the process can flush state, and reserve SIGKILL for processes that refuse to exit.'),
  q('q-linux-3', 'Explain Linux file permissions like 755.', 'Linux', 'beginner',
    'The three digits are owner, group, and other, each summing read 4, write 2, and execute 1. So 755 means the owner has read, write, execute, and group and other have read and execute. 644 is read-write for owner and read for everyone else, the common mode for regular files.'),
  q('q-linux-4', 'How would you investigate high load on a server?', 'Linux', 'advanced',
    'Start with uptime and top or htop to see load average and what is consuming CPU and memory. Use vmstat and iostat to separate CPU, memory, and disk pressure, and check for I/O wait. Inspect the heaviest processes, look at recent changes and logs in journalctl, and correlate with any deploy or traffic spike.'),

  // Monitoring
  q('q-mon-1', 'What are the three pillars of observability?', 'Monitoring', 'beginner',
    'Metrics are numeric time-series that are cheap to store and great for dashboards and alerting. Logs are detailed, timestamped events useful for understanding what happened. Traces follow a single request across services to find where latency or errors occur. Used together they let you ask and answer arbitrary questions about a system.'),
  q('q-mon-2', 'What is the difference between monitoring and observability?', 'Monitoring', 'intermediate',
    'Monitoring watches known signals and alerts on predefined conditions, answering questions you anticipated. Observability is the property of being able to understand a system\'s internal state from its outputs, including questions you did not anticipate. Rich, high-cardinality telemetry is what makes a system observable rather than just monitored.'),
  q('q-mon-3', 'What makes a good alert?', 'Monitoring', 'intermediate',
    'A good alert is actionable, urgent, and tied to user-facing symptoms rather than internal causes. It should fire when a human needs to do something now, link to a runbook, and rarely be a false positive. Alerting on symptoms like elevated error rate or latency, not every resource metric, prevents fatigue.'),
  q('q-mon-4', 'Explain SLI, SLO, and error budget.', 'Monitoring', 'advanced',
    'An SLI is a measured indicator of service health, such as the fraction of successful requests. An SLO is the target for that SLI, for example 99.9% over 30 days. The error budget is the allowed shortfall, here 0.1%, which the team can spend on releases and risk. When the budget is exhausted, slow down and focus on reliability.'),
  q('q-mon-5', 'How do you instrument an application for metrics?', 'Monitoring', 'intermediate',
    'Expose a metrics endpoint using a client library, emitting counters for events, gauges for current values, and histograms for distributions like latency. Use consistent labels but keep cardinality under control. A scraper like Prometheus pulls the endpoint, and you query with PromQL for dashboards and alerts.'),

  // SRE
  q('q-sre-1', 'What is toil and why does SRE want to eliminate it?', 'SRE', 'beginner',
    'Toil is manual, repetitive, automatable work that scales with service size and produces no lasting value, like restarting a service by hand. SRE caps toil so engineers spend time on engineering that reduces future toil. Automating toil away is both a productivity and a reliability win.'),
  q('q-sre-2', 'What is a blameless postmortem?', 'SRE', 'beginner',
    'A blameless postmortem analyzes an incident assuming everyone acted reasonably given what they knew, focusing on systemic causes and concrete fixes rather than punishing individuals. Removing blame encourages honest disclosure, which surfaces the real contributing factors and prevents recurrence far better than finger-pointing.'),
  q('q-sre-3', 'Why is 100% reliability the wrong target?', 'SRE', 'intermediate',
    'Each extra nine of reliability costs exponentially more, and users rarely perceive the difference past a point because their own networks and devices fail. Targeting 100% also leaves no error budget, which means no room to ship changes. The right target is the lowest reliability users are happy with, freeing budget for velocity.'),
  q('q-sre-4', 'Name resilience patterns for calling a flaky dependency.', 'SRE', 'advanced',
    'Set aggressive timeouts so you do not hang, retry with exponential backoff and jitter but bound the retries, use a circuit breaker to stop hammering a failing dependency, and apply load shedding or fallbacks to degrade gracefully. Assume every dependency will fail and design so one failure does not cascade.'),
  q('q-sre-5', 'How do you run an incident?', 'SRE', 'intermediate',
    'Declare the incident early, appoint an incident commander to coordinate, and assign clear roles for operations and communications. Keep a running timeline, communicate status to stakeholders on a cadence, and focus on mitigation first and root cause later. After resolution, run a blameless postmortem with tracked action items.'),

  // GitOps
  q('q-gitops-1', 'What are the core principles of GitOps?', 'GitOps', 'beginner',
    'The desired state is declarative, versioned and immutable in git, pulled automatically by agents, and continuously reconciled so the running system matches git. Git becomes the single source of truth and a full audit log, and changes happen through pull requests rather than manual cluster edits.'),
  q('q-gitops-2', 'What problem does GitOps solve?', 'GitOps', 'intermediate',
    'It removes manual, drift-prone cluster changes by making git the source of truth, so deployments are reviewable, auditable, and easy to roll back by reverting a commit. Reconciliation also auto-heals drift, and recovery becomes pointing a fresh cluster at the repo. It brings software engineering discipline to operations.'),
  q('q-gitops-3', 'How does Argo CD work?', 'GitOps', 'intermediate',
    'Argo CD runs in the cluster and watches a git repo of manifests. It continuously compares the desired state in git with the live cluster state, reports sync and health status, and can automatically apply changes and self-heal drift. Operators push changes to git via pull request and Argo reconciles the cluster.'),
  q('q-gitops-4', 'How do you handle secrets in GitOps when git is the source of truth?', 'GitOps', 'advanced',
    'Never store plaintext secrets in git. Encrypt them so only the cluster can decrypt, using tools like Sealed Secrets, or keep secret material in an external store and reference it with the External Secrets Operator, which injects real values at runtime. The encrypted reference lives in git; the secret never does.'),

  // Platform
  q('q-pe-1', 'What is platform engineering?', 'Platform', 'intermediate',
    'Platform engineering builds and runs an internal developer platform that abstracts infrastructure complexity behind self-service golden paths, treating the platform as a product with developers as customers. The goal is to reduce cognitive load and let product teams ship safely without becoming infrastructure experts.'),

  // Cloud
  q('q-cloud-1', 'What is the principle of least privilege in cloud IAM?', 'Cloud', 'intermediate',
    'Grant each identity only the specific permissions it needs to do its job, and nothing more. Prefer roles with short-lived credentials over long-lived access keys, scope policies tightly to specific resources and actions, and review them regularly. This limits the damage if a credential is compromised.'),
  q('q-cloud-2', 'How would you design a basic VPC for a web app?', 'Cloud', 'intermediate',
    'Create a VPC with public and private subnets across multiple availability zones. Put load balancers in public subnets with an internet gateway, and application and database tiers in private subnets that egress through a NAT gateway. Use security groups for tier-to-tier rules and keep the database reachable only from the app tier.'),

  // Scripting
  q('q-script-1', 'What does set -euo pipefail do in a bash script?', 'Scripting', 'intermediate',
    'set -e exits on any command failure, set -u errors on use of an unset variable, and set -o pipefail makes a pipeline fail if any stage fails, not just the last. Together they make scripts fail loudly and early instead of silently continuing in a broken state, which is essential for reliable automation.'),
  q('q-script-2', 'What does idempotent mean and why does it matter in automation?', 'Scripting', 'advanced',
    'An idempotent operation produces the same result whether run once or many times, for example ensuring a user exists rather than blindly creating it. It matters because automation and configuration management re-run frequently, and idempotency makes re-runs safe, which is the foundation of declarative tooling.'),
  // Extras
  q('q-k8s-extra-1', 'What is the difference between a liveness probe and a readiness probe?', 'Kubernetes', 'intermediate',
    'A liveness probe tells the kubelet whether a container is still healthy, and a failing one triggers a restart of that container. A readiness probe tells the service whether the pod is ready to receive traffic, and a failing one removes the pod from the endpoints list without restarting it. Use readiness for slow startup or temporary overload, and liveness only for unrecoverable hangs, otherwise you risk restart loops.'),
  q('q-k8s-extra-2', 'How does a rolling update work and how do you roll one back?', 'Kubernetes', 'intermediate',
    'A Deployment creates a new ReplicaSet and shifts pods over gradually, governed by maxSurge and maxUnavailable so capacity stays steady. Each revision is recorded, so you can inspect history and revert with a single rollback to the previous ReplicaSet. Pair it with readiness probes so traffic only flows to pods that are actually ready, which keeps the update safe.'),
  q('q-net-extra-1', 'What happens, end to end, when you type a URL and hit enter?', 'Networking', 'intermediate',
    'The browser resolves the hostname through DNS, opens a TCP connection and a TLS handshake for HTTPS, then sends an HTTP request. The server, often behind a load balancer and reverse proxy, routes the request to an app instance, which responds with HTML. The browser then fetches linked assets and renders the page. Knowing each hop helps you reason about where latency or failures come from.'),
  q('q-sre-extra-1', 'What is an error budget and how does it change how teams ship?', 'SRE', 'advanced',
    'An error budget is the allowed amount of unreliability, the gap between your SLO and one hundred percent. While budget remains, teams ship features freely; once it is exhausted, the focus shifts to reliability work until the service recovers. It turns the reliability debate into a shared, data-driven decision instead of a tug of war between product and operations.'),
];

// URL-safe slug for a question category ('CI/CD' -> 'ci-cd'). Powers the
// per-track interview hub pages at /interview/<slug>.
export const categorySlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export interface QuestionCategory {
  name: string;
  slug: string;
  questions: Question[];
}

export const questionCategories: QuestionCategory[] = (() => {
  const map = new Map<string, Question[]>();
  questions.forEach((q) => {
    const list = map.get(q.category) ?? [];
    list.push(q);
    map.set(q.category, list);
  });
  return [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, qs]) => ({ name, slug: categorySlug(name), questions: qs }));
})();

export const categoryBySlug = (slug: string) => questionCategories.find((c) => c.slug === slug);

// Which roadmap track to point to from each interview hub page.
export const categoryTrackId: Record<string, string> = {
  Kubernetes: 'kubernetes',
  Networking: 'networking',
  Terraform: 'terraform',
  Docker: 'docker',
  'CI/CD': 'cicd',
  SRE: 'sre',
  Monitoring: 'monitoring',
  Linux: 'linux',
  GitOps: 'gitops',
  Cloud: 'cloud',
  Scripting: 'scripting',
  Platform: 'platform',
};
