// "X vs Y" technical comparisons. Original writing, no fabricated stats or
// fake benchmarks, aligned to the 14 roadmap tracks so each one links back
// to something the learner can actually study.
export interface ComparisonRow {
  label: string;
  left: string;
  right: string;
}

export interface Comparison {
  id: string;
  title: string;
  leftName: string;
  rightName: string;
  category: string;
  trackId?: string;
  tagline: string;
  summary: string;
  rows: ComparisonRow[];
  useLeftWhen: string;
  useRightWhen: string;
  verdict: string;
}

export const comparisons: Comparison[] = [
  {
    id: 'tcp-vs-udp',
    title: 'TCP vs UDP',
    leftName: 'TCP',
    rightName: 'UDP',
    category: 'Networking',
    trackId: 'networking',
    tagline: 'Reliable, ordered delivery versus low-latency, best-effort delivery.',
    summary:
      'TCP and UDP are both transport-layer protocols that sit on top of IP, but they trade off reliability against speed. TCP establishes a connection with a three-way handshake, numbers every segment, retransmits lost packets, and delivers data to the application in order. UDP just fires datagrams at the destination with no handshake, no retransmission and no ordering guarantee, so it has far less overhead per packet.',
    rows: [
      { label: 'Connection', left: 'Connection-oriented (handshake)', right: 'Connectionless' },
      { label: 'Ordering', left: 'Guaranteed in-order delivery', right: 'No ordering guarantee' },
      { label: 'Reliability', left: 'Retransmits lost segments', right: 'Packets can be dropped silently' },
      { label: 'Overhead', left: 'Higher (headers, ACKs, flow control)', right: 'Minimal header, no ACKs' },
      { label: 'Typical use', left: 'HTTP/HTTPS, SSH, database connections', right: 'DNS, video/voice streaming, gaming' },
    ],
    useLeftWhen: 'You need every byte to arrive, in order, and can tolerate a bit of latency, e.g. loading a web page or replicating a database.',
    useRightWhen: 'Speed matters more than a dropped packet here and there, e.g. a live video call where a stale frame is worse than a missing one.',
    verdict: 'TCP is the safe default for anything that must be correct. UDP earns its place when latency is the product, and the application layer (or the codec) can tolerate loss on its own.',
  },
  {
    id: 'docker-vs-kubernetes',
    title: 'Docker vs Kubernetes',
    leftName: 'Docker',
    rightName: 'Kubernetes',
    category: 'Containers',
    trackId: 'docker',
    tagline: 'Packaging and running one container versus orchestrating a fleet of them.',
    summary:
      'Docker builds container images and runs them on a single host. Kubernetes is an orchestrator: it schedules containers (built with Docker or any OCI-compliant tool) across a cluster of machines, restarts them when they crash, load balances traffic between replicas, and rolls out new versions with zero downtime. They are not competitors, Kubernetes usually runs containers that Docker (or Buildah/Podman) built.',
    rows: [
      { label: 'Scope', left: 'Single host, one or a few containers', right: 'Multi-node cluster, hundreds of containers' },
      { label: 'Core job', left: 'Build, ship, run container images', right: 'Schedule, heal, scale, network containers' },
      { label: 'Self-healing', left: 'Restart policy on one host only', right: 'Reschedules pods onto healthy nodes automatically' },
      { label: 'Scaling', left: 'Manual, or docker-compose scale', right: 'Declarative autoscaling (HPA/VPA)' },
      { label: 'Learning curve', left: 'Low, one binary and a CLI', right: 'Steep, its own API objects and networking model' },
    ],
    useLeftWhen: 'You are shipping a small app, a side project, or a single service that fits comfortably on one machine.',
    useRightWhen: 'You are running many services that need to scale independently, survive node failures, or be deployed by multiple teams.',
    verdict: 'Start with Docker to learn containers. Reach for Kubernetes once you actually have a fleet to manage, not because it looks impressive on a resume.',
  },
  {
    id: 'monolith-vs-microservices',
    title: 'Monolith vs Microservices',
    leftName: 'Monolith',
    rightName: 'Microservices',
    category: 'System Design',
    trackId: 'platform',
    tagline: 'One deployable codebase versus many independently deployable services.',
    summary:
      'A monolith ships the entire application, UI, business logic, and data access, as a single deployable unit. Microservices split that same application into small, independently deployable services that talk to each other over the network, usually owned by different teams. The tradeoff is almost always simplicity versus independent scalability and deployment.',
    rows: [
      { label: 'Deployment', left: 'One artifact, one deploy pipeline', right: 'Many artifacts, many pipelines' },
      { label: 'Data', left: 'Usually one shared database', right: 'Each service typically owns its own data' },
      { label: 'Failure isolation', left: 'A bug can take down the whole app', right: 'A failing service can degrade gracefully' },
      { label: 'Operational cost', left: 'Low, one thing to monitor and deploy', right: 'High, needs service discovery, tracing, retries' },
      { label: 'Team structure', left: 'Works well for one team', right: 'Scales well across many autonomous teams' },
    ],
    useLeftWhen: 'You are early stage, have a small team, or your traffic and domain complexity do not yet justify distributed systems overhead.',
    useRightWhen: 'Different parts of the system need to scale, deploy, or evolve independently, and you have the platform maturity (CI/CD, observability) to support it.',
    verdict: 'Most products should start as a well-structured monolith. Split into services when a specific part of the system has outgrown the rest, not on day one.',
  },
  {
    id: 'git-merge-vs-rebase',
    title: 'git merge vs git rebase',
    leftName: 'git merge',
    rightName: 'git rebase',
    category: 'Git',
    trackId: 'git',
    tagline: 'Preserving history with a merge commit versus rewriting history onto a new base.',
    summary:
      'Both bring changes from one branch into another, but they do it differently. git merge creates a new merge commit that ties two histories together, so nothing is rewritten. git rebase replays your commits one by one on top of the target branch, producing a linear history, but it changes commit hashes, which is dangerous on anything already shared with others.',
    rows: [
      { label: 'History shape', left: 'Preserves branching, adds a merge commit', right: 'Linear, no merge commits' },
      { label: 'Commit hashes', left: 'Unchanged', right: 'Rewritten for every replayed commit' },
      { label: 'Safety on shared branches', left: 'Safe to run anytime', right: 'Unsafe after others have pulled the branch' },
      { label: 'Conflict resolution', left: 'Resolve once, in the merge commit', right: 'May need to resolve the same conflict per commit' },
      { label: 'Typical use', left: 'Merging a finished feature into main', right: 'Cleaning up a feature branch before opening a PR' },
    ],
    useLeftWhen: 'You are integrating a completed, shared, or public branch and want an honest record of when it happened.',
    useRightWhen: 'You are tidying up your own local feature branch before pushing, and want a clean, linear commit history for review.',
    verdict: 'Rebase your own unpublished work to keep history readable. Merge once a branch is public or shared, so you never rewrite commits someone else already has.',
  },
  {
    id: 'authentication-vs-authorization',
    title: 'Authentication vs Authorization',
    leftName: 'Authentication',
    rightName: 'Authorization',
    category: 'Security',
    trackId: 'devsecops',
    tagline: 'Proving who you are versus deciding what you are allowed to do.',
    summary:
      'Authentication (AuthN) verifies identity, a password, a passkey, a token that proves you are who you claim to be. Authorization (AuthZ) happens after that and decides what the now-verified identity is permitted to access or do. You can be authenticated and still be denied by authorization, e.g. a logged-in user trying to open someone else\u2019s admin panel.',
    rows: [
      { label: 'Question answered', left: 'Who are you?', right: 'What are you allowed to do?' },
      { label: 'Happens', left: 'First, at login/session start', right: 'On every subsequent protected action' },
      { label: 'Common mechanisms', left: 'Passwords, OAuth, passkeys, MFA', right: 'RBAC, ABAC, permission scopes, ACLs' },
      { label: 'Typical failure', left: '401 Unauthorized', right: '403 Forbidden' },
      { label: 'Example', left: 'Signing in with Google', right: 'Only admins can delete a project' },
    ],
    useLeftWhen: 'You need to establish or confirm identity before granting access to anything.',
    useRightWhen: 'Identity is already known and you need to decide whether that identity can perform a specific action.',
    verdict: 'They are two separate layers that must both be checked on every request. A system that authenticates well but skips authorization checks is still broken.',
  },
  {
    id: 'terraform-vs-ansible',
    title: 'Terraform vs Ansible',
    leftName: 'Terraform',
    rightName: 'Ansible',
    category: 'Infrastructure as Code',
    trackId: 'terraform',
    tagline: 'Declaring and provisioning infrastructure versus configuring machines after they exist.',
    summary:
      'Terraform is a declarative provisioning tool: you describe the desired end state (a VPC, a database, a cluster) and it figures out what to create, change, or destroy to get there, tracking everything in a state file. Ansible is primarily a configuration management and automation tool: it runs ordered tasks (install a package, edit a config, restart a service) against machines that already exist, using a push model over SSH with no state file.',
    rows: [
      { label: 'Model', left: 'Declarative, desired-state', right: 'Procedural, ordered tasks (playbooks)' },
      { label: 'State tracking', left: 'Keeps a state file to diff against', right: 'No state file, re-runs tasks idempotently' },
      { label: 'Primary job', left: 'Create/destroy cloud resources', right: 'Configure OS and app settings on existing hosts' },
      { label: 'Execution', left: 'Plan then apply', right: 'Push tasks over SSH/WinRM' },
      { label: 'Overlap', left: 'Can call provisioners for setup', right: 'Has cloud modules for provisioning too' },
    ],
    useLeftWhen: 'You need to create, version, and safely change cloud infrastructure itself, networks, compute, managed services.',
    useRightWhen: 'The infrastructure already exists and you need to configure software on it, or run repeatable operational tasks.',
    verdict: 'Many teams use both: Terraform to stand up the servers, Ansible to configure what runs on them. Pick based on whether the job is "create infrastructure" or "configure a machine".',
  },
  {
    id: 'ci-vs-cd',
    title: 'CI vs CD',
    leftName: 'Continuous Integration',
    rightName: 'Continuous Delivery/Deployment',
    category: 'CI/CD',
    trackId: 'cicd',
    tagline: 'Automatically testing every change versus automatically shipping it.',
    summary:
      'Continuous Integration means every code change is automatically built and tested as soon as it is pushed, catching integration bugs early instead of at release time. Continuous Delivery goes further and automatically prepares every passing change for a production release (a human still clicks deploy). Continuous Deployment goes all the way and ships every passing change to production with no human gate at all.',
    rows: [
      { label: 'Automates', left: 'Build + test on every push', right: 'Packaging, and optionally the release itself' },
      { label: 'Human gate', left: 'None needed for this stage', right: 'Delivery: yes. Deployment: no' },
      { label: 'Goal', left: 'Catch integration bugs fast', right: 'Get validated changes into users\u2019 hands fast' },
      { label: 'Failure mode if skipped', left: 'Broken builds pile up before release', right: 'Manual, error-prone, slow releases' },
      { label: 'Typical tools', left: 'GitHub Actions, Jenkins, CircleCI', right: 'Same tools, extended with deploy stages' },
    ],
    useLeftWhen: 'You want fast feedback on every commit, this is the baseline every team should have regardless of release cadence.',
    useRightWhen: 'You want releases to be routine and low-risk rather than a scary quarterly event.',
    verdict: 'CI is non-negotiable for any serious team. Whether you stop at Delivery (a human approves) or go to full Deployment depends on how much you trust your test suite and rollback story.',
  },
  {
    id: 'blue-green-vs-canary',
    title: 'Blue-Green vs Canary Deployment',
    leftName: 'Blue-Green',
    rightName: 'Canary',
    category: 'CI/CD',
    trackId: 'sre',
    tagline: 'Switching all traffic at once versus shifting a small slice first.',
    summary:
      'Blue-green deployment keeps two identical environments, one live (blue), one idle with the new version (green), then flips all traffic to green in one cut once it is verified. Canary deployment instead routes a small percentage of real traffic to the new version, watches error rates and latency, and gradually increases that percentage if things look healthy.',
    rows: [
      { label: 'Traffic shift', left: 'All at once, instant cutover', right: 'Gradual, percentage-based ramp' },
      { label: 'Blast radius on a bad release', left: 'Everyone, until you flip back', right: 'A small subset of users first' },
      { label: 'Infrastructure cost', left: 'Two full environments running briefly', right: 'One environment, split traffic weighting' },
      { label: 'Rollback speed', left: 'Instant, just flip the router back', right: 'Instant, just route the canary slice back' },
      { label: 'Best signal source', left: 'Smoke tests before the cutover', right: 'Live production metrics during the ramp' },
    ],
    useLeftWhen: 'You need a clean, instant rollback path and can afford to run two full environments briefly.',
    useRightWhen: 'You want to validate a risky change against real production traffic before committing everyone to it.',
    verdict: 'Canary catches problems that only show up under real traffic patterns. Blue-green gives the fastest, cleanest all-or-nothing rollback. Mature platforms often combine both.',
  },
  {
    id: 'horizontal-vs-vertical-scaling',
    title: 'Horizontal vs Vertical Scaling',
    leftName: 'Horizontal Scaling',
    rightName: 'Vertical Scaling',
    category: 'Cloud',
    trackId: 'cloud',
    tagline: 'Adding more machines versus adding more power to one machine.',
    summary:
      'Horizontal scaling (scaling out) adds more instances of a service behind a load balancer to handle more load. Vertical scaling (scaling up) keeps the same number of instances but gives each one more CPU, memory, or disk. Cloud-native systems favor horizontal scaling because it also improves fault tolerance; a single bigger machine is still a single point of failure.',
    rows: [
      { label: 'How it grows capacity', left: 'More machines/instances', right: 'Bigger machine, more resources' },
      { label: 'Ceiling', left: 'Practically unbounded', right: 'Limited by the largest available instance type' },
      { label: 'Fault tolerance', left: 'Higher, one instance failing barely matters', right: 'Lower, that one machine is a single point of failure' },
      { label: 'App requirements', left: 'App must be stateless or share state externally', right: 'Works with stateful apps unchanged' },
      { label: 'Typical cost curve', left: 'Roughly linear per instance added', right: 'Often non-linear, big instances cost disproportionately more' },
    ],
    useLeftWhen: 'The workload can be distributed across instances (stateless web servers, workers) and you need resilience as well as capacity.',
    useRightWhen: 'The workload is hard to distribute, like a single-writer database, or you need a quick capacity bump without re-architecting.',
    verdict: 'Cloud-native design defaults to horizontal scaling for resilience and near-unlimited headroom. Vertical scaling is a reasonable stopgap, but it has a hard ceiling and a single point of failure.',
  },
  {
    id: 'load-balancer-vs-reverse-proxy',
    title: 'Load Balancer vs Reverse Proxy',
    leftName: 'Load Balancer',
    rightName: 'Reverse Proxy',
    category: 'Networking',
    trackId: 'networking',
    tagline: 'Distributing traffic across many backends versus fronting one or more backends for other reasons.',
    summary:
      'A load balancer\u2019s primary job is distributing incoming requests across multiple backend instances so no single one is overwhelmed, using algorithms like round robin or least connections plus health checks. A reverse proxy sits in front of one or more backend servers and can do TLS termination, caching, compression, or routing by path, load balancing is one thing a reverse proxy can do, not the only thing. In practice, most software (nginx, HAProxy, Envoy) does both roles at once.',
    rows: [
      { label: 'Primary purpose', left: 'Spread load across many backend instances', right: 'Sit between client and server for TLS, caching, routing' },
      { label: 'Health checks', left: 'Core feature, removes unhealthy backends', right: 'Optional, depends on the proxy software' },
      { label: 'Can work alone', left: 'Needs at least one backend to route to', right: 'Can front a single backend for TLS/caching only' },
      { label: 'Common software', left: 'AWS ELB/ALB, HAProxy, Envoy', right: 'nginx, Envoy, Cloudflare' },
      { label: 'Relationship', left: 'A specialized kind of reverse proxy behavior', right: 'The broader category load balancers fall under' },
    ],
    useLeftWhen: 'You have multiple backend instances and need traffic spread across them with automatic health checking.',
    useRightWhen: 'You need TLS termination, caching, or request routing in front of your service, even if there is only one backend.',
    verdict: 'Think of load balancing as one job a reverse proxy can do. Most production setups use a single piece of software that does both at once.',
  },
  {
    id: 'metrics-vs-logs',
    title: 'Metrics vs Logs',
    leftName: 'Metrics',
    rightName: 'Logs',
    category: 'Observability',
    trackId: 'monitoring',
    tagline: 'Aggregated numeric signals over time versus discrete, detailed event records.',
    summary:
      'Metrics are numeric measurements sampled over time, request rate, latency, CPU usage, cheap to store and great for dashboards, alerts, and spotting trends. Logs are timestamped, often unstructured text records of individual events, expensive to store at scale but rich in detail for figuring out exactly what happened during a specific incident.',
    rows: [
      { label: 'Data shape', left: 'Numeric, time-series', right: 'Text/structured event records' },
      { label: 'Storage cost at scale', left: 'Low, pre-aggregated', right: 'High, every event is stored' },
      { label: 'Best for', left: 'Dashboards, alerting, trend detection', right: 'Root-cause investigation of a specific event' },
      { label: 'Query pattern', left: '"How has latency trended this week?"', right: '"What exactly happened at 14:03:12 for request X?"' },
      { label: 'Common tools', left: 'Prometheus, Grafana, Datadog', right: 'Loki, ELK stack, Splunk' },
    ],
    useLeftWhen: 'You need to know something is wrong, right now or over time, without drowning in detail.',
    useRightWhen: 'You already know something is wrong and need the exact sequence of events to explain why.',
    verdict: 'Metrics tell you that something broke and when. Logs (and traces) tell you why. A healthy observability stack needs both, plus traces to connect them.',
  },
  {
    id: 'symmetric-vs-asymmetric-encryption',
    title: 'Symmetric vs Asymmetric Encryption',
    leftName: 'Symmetric Encryption',
    rightName: 'Asymmetric Encryption',
    category: 'Security',
    trackId: 'devsecops',
    tagline: 'One shared secret key versus a public/private key pair.',
    summary:
      'Symmetric encryption uses the same key to encrypt and decrypt, it is fast and efficient (AES is the standard), but both parties need the same secret key, which creates a key-distribution problem. Asymmetric encryption uses a mathematically linked key pair, a public key anyone can use to encrypt, and a private key only the owner holds to decrypt, solving the distribution problem at the cost of being much slower.',
    rows: [
      { label: 'Keys involved', left: 'One shared secret key', right: 'A public key and a private key' },
      { label: 'Speed', left: 'Fast, efficient for bulk data', right: 'Much slower, computationally heavier' },
      { label: 'Key distribution problem', left: 'Yes, must share the secret securely first', right: 'No, the public key can be shared openly' },
      { label: 'Typical algorithms', left: 'AES, ChaCha20', right: 'RSA, ECC' },
      { label: 'Typical use', left: 'Encrypting the actual data/traffic', right: 'Key exchange, digital signatures, TLS handshake' },
    ],
    useLeftWhen: 'You need to encrypt large amounts of data quickly and both sides can already share a key securely.',
    useRightWhen: 'You need to establish trust or exchange a key with someone you have never securely communicated with before.',
    verdict: 'They are complementary, not competing. TLS uses asymmetric encryption during the handshake to safely agree on a symmetric key, then switches to that fast symmetric key for the actual session.',
  },
];

export const comparisonCategories: string[] = [...new Set(comparisons.map((c) => c.category))];

export function comparisonById(id: string): Comparison | undefined {
  return comparisons.find((c) => c.id === id);
}
