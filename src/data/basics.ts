// Absolute-beginner primers, one per topic, keyed by topic id.
// Tone: explain like the reader has never touched a computer terminal.
// Define every word. No jargon without a plain-English translation.
// Merged onto topics in tracks.ts.

type Basics = { intro: string; points: { term: string; plain: string }[] };

export const basicsById: Record<string, Basics> = {
  // ---------------- Linux Fundamentals ----------------
  'linux-shell': {
    intro:
      'Before any of this makes sense, here is the ground floor. A computer stores everything as files, and those files live inside folders. The shell is just a place where you type short text commands to move around those folders and open or change files, instead of clicking with a mouse.',
    points: [
      { term: 'File', plain: 'A single saved thing on the computer: a photo, a note, a program. It has a name.' },
      { term: 'Folder / directory', plain: 'A container that holds files and other folders. "Directory" is just the technical word for a folder.' },
      { term: 'Filesystem', plain: 'The whole tree of folders inside folders, starting from one top folder, that holds everything on the machine.' },
      { term: 'Terminal', plain: 'The black window where you type commands. Think of it as a chat box with the computer.' },
      { term: 'Shell', plain: 'The program listening inside that window. You type a command, the shell runs it and shows the result.' },
      { term: 'Command', plain: 'A short word you type to make something happen. "ls" lists files, "cd" changes folder.' },
      { term: 'pwd', plain: 'Stands for "print working directory". It tells you which folder you are standing in right now.' },
      { term: 'cd', plain: 'Stands for "change directory". It moves you into a different folder, like double-clicking a folder.' },
      { term: 'ls', plain: 'Stands for "list". It shows you what files and folders are inside where you are.' },
    ],
  },
  'linux-perms': {
    intro:
      'Every file on a Linux machine has rules about who is allowed to look at it, change it, or run it. These rules are called permissions. They exist so that not everyone can read or break everyone else\u2019s files.',
    points: [
      { term: 'Permission', plain: 'A rule that says what someone is allowed to do with a file.' },
      { term: 'Read (r)', plain: 'Permission to open and look at the contents of a file.' },
      { term: 'Write (w)', plain: 'Permission to change or delete a file.' },
      { term: 'Execute (x)', plain: 'Permission to run a file as a program (only matters for programs and scripts).' },
      { term: 'Owner', plain: 'The user account that the file belongs to, usually whoever created it.' },
      { term: 'Group', plain: 'A named set of users who share the same access, like a team.' },
      { term: 'chmod', plain: 'A command that changes a file\u2019s permissions ("change mode").' },
      { term: 'chown', plain: 'A command that changes who owns a file ("change owner").' },
    ],
  },
  'linux-processes': {
    intro:
      'When you run any program, the computer creates a live, running copy of it. That running copy is called a process. This lesson is about seeing what is running and telling those programs to stop, restart, or reload.',
    points: [
      { term: 'Program', plain: 'A file on disk that contains instructions, sitting still until you run it.' },
      { term: 'Process', plain: 'A program that is actually running right now, using memory and the CPU.' },
      { term: 'PID', plain: 'A "process ID" is a unique number the system gives each running process so you can refer to it.' },
      { term: 'Signal', plain: 'A short message you send to a process, such as "please stop" or "reload your settings".' },
      { term: 'kill', plain: 'A command that sends a signal to a process. Despite the name, it can just ask politely, not only force-quit.' },
      { term: 'ps / top', plain: 'Commands that show you the list of processes currently running, like a Task Manager.' },
    ],
  },
  'linux-systemd': {
    intro:
      'Some programs need to run quietly in the background all the time, like a web server. These are called services. On modern Linux, a manager named systemd starts them, keeps them alive, and restarts them if they crash.',
    points: [
      { term: 'Service (daemon)', plain: 'A program that runs in the background continuously, with no window, waiting to do work.' },
      { term: 'systemd', plain: 'The built-in manager that starts services when the machine boots and watches over them.' },
      { term: 'systemctl', plain: 'The command you type to talk to systemd: start, stop, or check a service.' },
      { term: 'Unit file', plain: 'A small settings file that tells systemd how to run one service.' },
      { term: 'Enable on boot', plain: 'Telling the system to start a service automatically every time the computer turns on.' },
      { term: 'journalctl', plain: 'A command to read the logs (the recorded messages) a service has printed.' },
    ],
  },
  'linux-users': {
    intro:
      'A Linux machine can be shared by many people and programs. Each one logs in as a "user" with its own name and its own limits. This keeps things organized and safe, so one account cannot accidentally wreck everything.',
    points: [
      { term: 'User', plain: 'An account on the machine, with a name and its own files and permissions.' },
      { term: 'Root', plain: 'The all-powerful admin account that can do absolutely anything. Powerful and dangerous.' },
      { term: 'Group', plain: 'A label that bundles several users together so they can share access.' },
      { term: 'sudo', plain: 'A command that lets a normal user run one command as the admin, after proving they are allowed.' },
      { term: 'Least privilege', plain: 'The safety rule of giving each account only the access it truly needs and nothing more.' },
    ],
  },
  'linux-text': {
    intro:
      'A huge part of the job is reading and changing text: log files, config files, lists. Linux has three classic tools for slicing text quickly. You do not need to master them today, just know what each one is for.',
    points: [
      { term: 'Text stream', plain: 'A flow of lines of text, such as the contents of a file or the output of a command.' },
      { term: 'grep', plain: 'A search tool. It scans text and prints only the lines that match a word you are looking for.' },
      { term: 'sed', plain: 'A find-and-replace tool for text, like the replace feature in a word processor but on the command line.' },
      { term: 'awk', plain: 'A tool that pulls out specific columns from each line and can do simple math on them.' },
      { term: 'Pipe ( | )', plain: 'A symbol that sends the output of one command straight into the next, chaining tools together.' },
    ],
  },
  'linux-net': {
    intro:
      'Networking is how one computer talks to another. From the command line you can check your machine\u2019s address, see which doors (ports) are open, and test whether you can reach another computer.',
    points: [
      { term: 'Network', plain: 'Two or more computers connected so they can send data to each other.' },
      { term: 'IP address', plain: 'A computer\u2019s numeric address on the network, like a house address for data.' },
      { term: 'Port', plain: 'A numbered doorway on a computer. Different services listen on different ports (web is usually 80 or 443).' },
      { term: 'Interface', plain: 'The hardware or software connection point your machine uses to reach the network (like Wi-Fi or ethernet).' },
      { term: 'curl', plain: 'A command that fetches a web address from the terminal, to test if a server responds.' },
      { term: 'DNS', plain: 'The phonebook of the internet: it turns a name like google.com into an IP address.' },
    ],
  },
  'linux-disk': {
    intro:
      'Your data is physically stored on drives (the disk). This lesson is about seeing how much space is used, how a drive gets connected to a folder so you can use it, and why a full disk causes outages.',
    points: [
      { term: 'Disk / drive', plain: 'The physical storage hardware where files actually live.' },
      { term: 'Partition', plain: 'A slice of a disk treated as if it were its own separate drive.' },
      { term: 'Filesystem', plain: 'The format that organizes a partition into folders and files so software can use it.' },
      { term: 'Mount', plain: 'Attaching a drive or partition to a folder so its contents appear there and you can open them.' },
      { term: 'df / du', plain: 'Commands that report disk space: df shows free space, du shows how big folders are.' },
    ],
  },

  // ---------------- Networking ----------------
  'net-osi': {
    intro:
      'When two computers talk, a lot has to happen: a cable carries electricity, that becomes data, that data finds the right machine, and finally an app reads it. To keep this manageable, people split the whole journey into stacked “layers”, where each layer only worries about its own job.',
    points: [
      { term: 'Layer', plain: 'One step in the journey of data. Each layer does one job and hands off to the next, like an assembly line.' },
      { term: 'OSI model', plain: 'A teaching map that splits networking into 7 layers, from physical cables up to the app.' },
      { term: 'TCP/IP model', plain: 'The simpler, real-world version used by the internet, with 4 layers instead of 7.' },
      { term: 'Protocol', plain: 'An agreed set of rules for how two computers format and exchange messages.' },
      { term: 'Why layers help', plain: 'When something breaks, you can ask “which layer failed?” instead of guessing about everything at once.' },
    ],
  },
  'net-ip': {
    intro:
      'Every device on a network needs an address so data knows where to go, just like a postal address. That address is an IP address. Subnetting is just the trick of splitting one big block of addresses into smaller, organized groups.',
    points: [
      { term: 'IP address', plain: 'A unique number assigned to a device on a network, like 192.168.1.10, used to find it.' },
      { term: 'Network vs host', plain: 'Part of the address names the street (the network); the rest names the specific house (the device).' },
      { term: 'Subnet', plain: 'A smaller block carved out of a bigger address range, used to group and isolate devices.' },
      { term: 'CIDR ( /24 )', plain: 'A shorthand like /24 that says how many addresses are in a block. Smaller number = bigger block.' },
      { term: 'Private vs public', plain: 'Private addresses only work inside your own network; public ones are reachable from the internet.' },
    ],
  },
  'net-dns': {
    intro:
      'Humans remember names like google.com, but computers only talk in numbers (IP addresses). DNS is the system that looks up a name and returns its number, like a phonebook for the internet.',
    points: [
      { term: 'Domain name', plain: 'A human-friendly name for a site, like example.com.' },
      { term: 'DNS', plain: 'The “Domain Name System”: the service that turns a name into the IP address behind it.' },
      { term: 'Resolve', plain: 'The act of looking up a name and getting back its address.' },
      { term: 'A record', plain: 'A DNS entry that maps a name directly to an IP address.' },
      { term: 'CNAME', plain: 'A DNS entry that points one name at another name (an alias).' },
      { term: 'TTL', plain: '“Time to live”: how long an answer can be cached before asking again. This is why DNS changes feel slow.' },
    ],
  },
  'net-http': {
    intro:
      'When you open a website, your browser sends a request and the server sends back a response. The rules for that conversation are called HTTP. HTTPS is the same thing but encrypted so nobody can read it in transit.',
    points: [
      { term: 'Request', plain: 'The message your browser sends asking for a page or some data.' },
      { term: 'Response', plain: 'The message the server sends back, usually the page plus a status code.' },
      { term: 'Method (GET/POST)', plain: 'The verb of a request: GET fetches data, POST sends data to create something.' },
      { term: 'Status code', plain: 'A 3-digit result: 200 means OK, 404 means not found, 500 means the server broke.' },
      { term: 'HTTPS', plain: 'HTTP wrapped in encryption, so the data is scrambled to anyone listening in between.' },
      { term: 'TLS', plain: 'The technology that does the encrypting and proves the site is really who it claims to be.' },
    ],
  },
  'net-loadbalancing': {
    intro:
      'One server can only handle so many users. A load balancer sits in front of several servers and spreads incoming traffic across them, so no single machine gets overwhelmed and the site stays fast.',
    points: [
      { term: 'Load balancer', plain: 'A traffic director that splits incoming requests across multiple servers.' },
      { term: 'Backend', plain: 'One of the actual servers doing the work behind the load balancer.' },
      { term: 'Proxy', plain: 'A middle-man server that forwards traffic on behalf of someone else.' },
      { term: 'Reverse proxy', plain: 'A proxy that sits in front of your servers and receives requests for them.' },
      { term: 'Why it matters', plain: 'It lets you handle more users, survive a server dying, and update servers without downtime.' },
    ],
  },
  'net-firewall': {
    intro:
      'A firewall is a gatekeeper that decides which network traffic is allowed in or out. It is the most basic way to keep unwanted connections away from your machines.',
    points: [
      { term: 'Firewall', plain: 'A filter that allows or blocks network traffic based on rules you set.' },
      { term: 'Rule', plain: 'A single instruction like “allow web traffic on port 443, block everything else”.' },
      { term: 'Inbound vs outbound', plain: 'Inbound is traffic coming to your machine; outbound is traffic leaving it.' },
      { term: 'Security group', plain: 'A cloud firewall attached to a server, controlling what can reach it.' },
      { term: 'Default deny', plain: 'The safe habit of blocking everything first, then only opening what you truly need.' },
    ],
  },
  'net-troubleshoot': {
    intro:
      'When something cannot connect, you do not guess randomly. You check each step of the path in order: is my machine online, is there a route to the target, is the port open, does the name resolve. These tools help you find where it breaks.',
    points: [
      { term: 'ping', plain: 'A command that checks if another machine is reachable and how fast it replies.' },
      { term: 'traceroute', plain: 'A command that shows every hop your data takes to reach a destination.' },
      { term: 'Packet', plain: 'A small chunk of data sent over the network; big messages are split into many packets.' },
      { term: 'Latency', plain: 'The delay, in milliseconds, for data to travel there and back.' },
      { term: 'Work the layers', plain: 'A method: start at your own machine and move outward, testing one thing at each step.' },
    ],
  },

  // ---------------- Scripting & Automation ----------------
  'script-bash': {
    intro:
      'A script is just a text file containing a list of commands, saved so you can run them all at once instead of typing each one by hand. Bash is the most common language for these scripts on Linux.',
    points: [
      { term: 'Script', plain: 'A file full of commands that run top to bottom, automating something you would otherwise type.' },
      { term: 'Bash', plain: 'A common shell and scripting language on Linux. The thing reading your commands.' },
      { term: 'Shebang ( #! )', plain: 'The first line of a script that tells the system which program should run it.' },
      { term: 'Argument', plain: 'Extra input you pass to a script, like a filename, written after its name.' },
      { term: 'set -e', plain: 'A safety switch that stops the script immediately if any command fails.' },
      { term: 'Why script', plain: 'So a long, error-prone manual task becomes one reliable, repeatable command.' },
    ],
  },
  'script-vars': {
    intro:
      'To do anything useful, a script needs to remember values and make decisions. Variables store values, loops repeat actions, and conditionals choose between paths. These three ideas exist in every programming language.',
    points: [
      { term: 'Variable', plain: 'A named box that holds a value, like name="Alice", so you can reuse it later.' },
      { term: 'Loop', plain: 'A way to repeat the same steps many times, such as once for every file.' },
      { term: 'Conditional (if)', plain: 'A check that runs one block of code only when something is true.' },
      { term: 'Comparison', plain: 'Testing whether two things are equal, bigger, smaller, or a file exists.' },
      { term: 'Array', plain: 'A variable that holds a list of values instead of just one.' },
    ],
  },
  'script-python': {
    intro:
      'Bash is great for short tasks, but once you need real logic, data handling, or talking to web services, Python is easier and clearer. Python is a beginner-friendly programming language used everywhere in automation.',
    points: [
      { term: 'Python', plain: 'A popular, readable programming language good for scripts, tools, and APIs.' },
      { term: 'Library / package', plain: 'Pre-written code others made that you import to avoid reinventing the wheel.' },
      { term: 'import', plain: 'The keyword that pulls a library into your script so you can use it.' },
      { term: 'JSON', plain: 'A common text format for structured data, used heavily when talking to web services.' },
      { term: 'When to use it', plain: 'Reach for Python when bash gets messy: complex logic, parsing, or API calls.' },
    ],
  },
  'script-cron': {
    intro:
      'Sometimes you want a task to run automatically on a schedule, like a backup every night. cron is the built-in Linux scheduler that runs commands for you at set times, with no human needed.',
    points: [
      { term: 'Schedule', plain: 'A rule for when something should run automatically, like “every day at 2am”.' },
      { term: 'cron', plain: 'The Linux service that runs commands on a schedule in the background.' },
      { term: 'crontab', plain: 'The list of scheduled jobs for a user. You edit it to add or change schedules.' },
      { term: 'Cron expression', plain: 'Five fields (minute, hour, day, month, weekday) that define exactly when a job runs.' },
      { term: 'Job', plain: 'A single scheduled task: a command plus the time it should run.' },
    ],
  },
  'script-api': {
    intro:
      'An API is how one program asks another program for data or actions over the network. Most modern services offer a web API you can call from a script to fetch info or trigger something.',
    points: [
      { term: 'API', plain: 'A defined way for programs to talk to each other, instead of humans clicking buttons.' },
      { term: 'Endpoint', plain: 'A specific URL on a service you call to do one thing, like /users to list users.' },
      { term: 'Token / key', plain: 'A secret password your script sends to prove it is allowed to use the API.' },
      { term: 'Rate limit', plain: 'A cap on how many calls you may make in a time window, to protect the service.' },
      { term: 'Pagination', plain: 'Getting big lists in smaller chunks (pages) instead of all at once.' },
    ],
  },
  'script-idempotent': {
    intro:
      'A safe automation can run twice without causing damage. “Idempotent” is the fancy word for: running it again gives the same result, instead of creating duplicates or breaking things. This is a core habit in DevOps.',
    points: [
      { term: 'Idempotent', plain: 'Safe to run repeatedly. The 2nd, 3rd, 100th run changes nothing extra.' },
      { term: 'Why it matters', plain: 'Automation often re-runs after failures; you do not want duplicates or surprises.' },
      { term: 'Check then act', plain: 'The habit of first checking if something already exists before creating it.' },
      { term: 'Desired state', plain: 'Describing what you want the end result to be, and letting the tool reach it.' },
      { term: 'Side effect', plain: 'Any change a command makes to the world, like writing a file or sending an email.' },
    ],
  },

  // ---------------- Git & Version Control ----------------
  'git-basics': {
    intro:
      'Git is a time machine and a save system for code. As you work, it records snapshots of your files so you can go back, see what changed, and work with others without overwriting each other. A snapshot is called a commit.',
    points: [
      { term: 'Version control', plain: 'A system that tracks every change to your files over time so nothing is lost.' },
      { term: 'Git', plain: 'The most popular version control tool, used by nearly every software team.' },
      { term: 'Repository (repo)', plain: 'A project folder that Git is tracking, including its full history.' },
      { term: 'Commit', plain: 'A saved snapshot of your files at one moment, with a short note about what changed.' },
      { term: 'Staging', plain: 'A waiting area where you pick which changes go into the next commit.' },
      { term: 'Push / pull', plain: 'Push uploads your commits to a shared server; pull downloads others’ commits.' },
    ],
  },
  'git-branching': {
    intro:
      'A branch lets you work on a new feature on a separate copy of the code, without touching the main version. When the feature is ready, you merge it back in. This is how teams build many things at once safely.',
    points: [
      { term: 'Branch', plain: 'A separate line of work, like a parallel copy of the code you can change freely.' },
      { term: 'main', plain: 'The primary branch that holds the official, working version of the code.' },
      { term: 'Merge', plain: 'Combining the changes from one branch back into another.' },
      { term: 'Conflict', plain: 'When two branches changed the same line, and Git asks you to choose which wins.' },
      { term: 'Why branch', plain: 'So unfinished work stays isolated and never breaks the main version everyone uses.' },
    ],
  },
  'git-rebase': {
    intro:
      'Over time a project’s history can get messy. Rebasing is a way to tidy and reorder your commits so the story of the project reads cleanly. It is powerful, so there are a few safety rules.',
    points: [
      { term: 'History', plain: 'The ordered list of all commits, telling the story of how the code evolved.' },
      { term: 'Rebase', plain: 'Replaying your commits on top of the latest code to keep history neat and linear.' },
      { term: 'Squash', plain: 'Combining several small commits into one tidy commit.' },
      { term: 'Merge vs rebase', plain: 'Merge keeps both histories; rebase rewrites yours to look like one straight line.' },
      { term: 'Golden rule', plain: 'Never rebase work that others have already pulled, or you will confuse everyone.' },
    ],
  },
  'git-workflows': {
    intro:
      'A workflow is just the team agreement for how everyone uses branches and merges together. There is no single right answer; teams pick a style that fits how often they ship.',
    points: [
      { term: 'Workflow', plain: 'The shared rules a team follows for branching, reviewing, and merging code.' },
      { term: 'Pull request (PR)', plain: 'A request to merge your branch, where teammates review the changes first.' },
      { term: 'Trunk-based', plain: 'A style where everyone commits to one main branch often, in small pieces.' },
      { term: 'GitFlow', plain: 'A more structured style with long-lived branches for features and releases.' },
      { term: 'Fork', plain: 'Your own personal copy of someone else’s repo, common in open source.' },
    ],
  },
  'git-hooks': {
    intro:
      'A hook is a script Git runs automatically at certain moments, like right before you commit. They let you catch mistakes early, such as running a formatter or blocking a bad commit.',
    points: [
      { term: 'Hook', plain: 'A script that Git triggers automatically at a specific event.' },
      { term: 'pre-commit', plain: 'A hook that runs before a commit is saved, often to check or format code.' },
      { term: 'Automation', plain: 'Letting the tool do routine checks for you instead of remembering them.' },
      { term: 'Linting', plain: 'Automatically checking code for style problems and obvious errors.' },
      { term: 'Why hooks', plain: 'They stop bad code from ever entering the project, saving review time later.' },
    ],
  },
  'git-tags': {
    intro:
      'When software is ready to release, you mark that exact point in history with a tag and a version number, like v1.2.0. Versioning is the agreed way to name releases so everyone knows what changed.',
    points: [
      { term: 'Tag', plain: 'A permanent label pinned to one commit, marking a release point.' },
      { term: 'Release', plain: 'A specific, named version of the software handed to users.' },
      { term: 'SemVer', plain: 'Semantic Versioning: numbers like 1.2.0 meaning major.minor.patch.' },
      { term: 'Major / minor / patch', plain: 'Major = breaking changes, minor = new features, patch = small fixes.' },
      { term: 'Why version', plain: 'So people can tell at a glance whether an update is safe or risky to take.' },
    ],
  },

  // ---------------- Docker & Containers ----------------
  'docker-what': {
    intro:
      'A container is a lightweight, sealed box that holds an app plus everything it needs to run. Because it carries its own setup, it runs the same on your laptop, a teammate’s machine, and a server. This fixes the classic “it works on my machine” problem.',
    points: [
      { term: 'Container', plain: 'A self-contained package with your app and all its dependencies, ready to run anywhere.' },
      { term: 'Image', plain: 'The frozen blueprint a container is started from, like a template.' },
      { term: 'Docker', plain: 'The most popular tool for building and running containers.' },
      { term: 'Virtual machine (VM)', plain: 'An older, heavier way to isolate apps that includes a whole operating system.' },
      { term: 'Container vs VM', plain: 'Containers share the host’s OS so they are tiny and fast; VMs each carry a full OS so they are bulky.' },
      { term: '“Works on my machine”', plain: 'The bug where code runs for you but not others. Containers solve it by shipping the environment too.' },
    ],
  },
  'docker-images': {
    intro:
      'An image is built from a recipe called a Dockerfile. The Dockerfile lists steps: start from a base, copy your code in, install things. Each step becomes a cached layer, which makes rebuilds fast.',
    points: [
      { term: 'Dockerfile', plain: 'A text recipe with step-by-step instructions for building an image.' },
      { term: 'Base image', plain: 'The starting point you build on, such as a minimal Linux or a Node.js image.' },
      { term: 'Layer', plain: 'One step’s result, saved and reused so unchanged steps do not rebuild.' },
      { term: 'Build', plain: 'The act of turning a Dockerfile into a finished image.' },
      { term: 'Tag', plain: 'A label like myapp:v1 that names a specific version of an image.' },
    ],
  },
  'docker-multistage': {
    intro:
      'Sometimes building an app needs heavy tools, but running it does not. A multi-stage build uses one big stage to compile, then copies just the finished result into a tiny final image. Smaller images are faster and safer.',
    points: [
      { term: 'Multi-stage build', plain: 'A Dockerfile with multiple stages, where only the final small one ships.' },
      { term: 'Build stage', plain: 'A temporary stage that holds compilers and tools, thrown away at the end.' },
      { term: 'Artifact', plain: 'The finished output of a build, like a compiled program, that you keep.' },
      { term: 'Image size', plain: 'How big the image is. Smaller means faster downloads and fewer things to attack.' },
      { term: 'Attack surface', plain: 'Everything in an image a hacker could exploit. Less stuff means less risk.' },
    ],
  },
  'docker-volumes': {
    intro:
      'Containers are throwaway by design: delete one and its internal data is gone. A volume is a separate storage area that lives outside the container, so important data like a database survives restarts.',
    points: [
      { term: 'Ephemeral', plain: 'Short-lived. A container’s own files vanish when it is removed.' },
      { term: 'Volume', plain: 'Storage managed by Docker that persists even after a container is deleted.' },
      { term: 'Persistence', plain: 'Keeping data alive beyond the life of any single container.' },
      { term: 'Bind mount', plain: 'Linking a folder on your computer into the container, handy during development.' },
      { term: 'Why it matters', plain: 'Without volumes, restarting a database container would wipe all its data.' },
    ],
  },
  'docker-network': {
    intro:
      'Apps are rarely alone; a web app needs to reach its database. Docker networking lets containers find and talk to each other, and lets you expose a container to the outside world through a port.',
    points: [
      { term: 'Network', plain: 'A private space where containers can reach each other by name.' },
      { term: 'Publish a port', plain: 'Opening a container’s port to your computer so you can reach the app from a browser.' },
      { term: 'Service discovery', plain: 'Containers finding each other by name instead of by changing IP addresses.' },
      { term: 'Host', plain: 'The actual machine running the containers.' },
      { term: 'Mapping ( 8080:80 )', plain: 'Connecting a port on your machine (8080) to a port inside the container (80).' },
    ],
  },
  'docker-compose': {
    intro:
      'Real apps have several containers at once: a web server, a database, a cache. Docker Compose lets you describe the whole set in one file and start them all together with a single command.',
    points: [
      { term: 'Docker Compose', plain: 'A tool to define and run multiple containers together from one file.' },
      { term: 'compose file', plain: 'A YAML file listing each service, its image, ports, and settings.' },
      { term: 'Service', plain: 'One container definition inside the compose file, like “web” or “db”.' },
      { term: 'YAML', plain: 'A simple, indented text format used for configuration files.' },
      { term: 'up / down', plain: 'Commands that start the whole stack (up) or stop and remove it (down).' },
    ],
  },
  'docker-security': {
    intro:
      'Images can carry security holes, especially if they include things you do not need. Hardening means trimming an image down and running it carefully so attackers have fewer ways in.',
    points: [
      { term: 'Hardening', plain: 'Making something more secure by removing risk and locking it down.' },
      { term: 'Non-root user', plain: 'Running the app as a limited account, so a break-in cannot take over everything.' },
      { term: 'Vulnerability', plain: 'A known weakness in software that an attacker could exploit.' },
      { term: 'Scanning', plain: 'Automatically checking an image for known vulnerabilities before shipping.' },
      { term: 'Minimal base', plain: 'Starting from the smallest possible image so there is less to attack.' },
    ],
  },
  'docker-registry': {
    intro:
      'Once you build an image, you need a place to store and share it. A registry is that storage, like an app store for container images. You push images up and others pull them down.',
    points: [
      { term: 'Registry', plain: 'A server that stores container images so they can be shared and downloaded.' },
      { term: 'Docker Hub', plain: 'The most common public registry, full of ready-made images.' },
      { term: 'Push', plain: 'Uploading your image to a registry.' },
      { term: 'Pull', plain: 'Downloading an image from a registry to run it.' },
      { term: 'Digest', plain: 'A unique fingerprint that pins the exact image content, so you get precisely what you expect.' },
    ],
  },

  // ---------------- Kubernetes ----------------
  'k8s-arch': {
    intro:
      'Once you have many containers across many machines, running them by hand is impossible. Kubernetes is an autopilot that runs containers for you across a group of machines, restarts crashed ones, and scales them up or down. The group of machines is called a cluster.',
    points: [
      { term: 'Kubernetes (k8s)', plain: 'A system that automatically runs and manages containers across many machines.' },
      { term: 'Cluster', plain: 'The group of machines Kubernetes manages as one big pool.' },
      { term: 'Node', plain: 'A single machine (the worker) in the cluster that actually runs containers.' },
      { term: 'Control plane', plain: 'The brain of the cluster that decides what runs where and keeps things healthy.' },
      { term: 'Orchestration', plain: 'Automatically scheduling, healing, and scaling containers without a human babysitting.' },
      { term: 'Desired state', plain: 'You declare what you want (e.g. 3 copies running) and Kubernetes makes it true.' },
    ],
  },
  'k8s-pods': {
    intro:
      'In Kubernetes you do not run a container directly; you run a Pod. A Pod is the smallest unit, a wrapper around one (or a few tightly-linked) containers that share an address and storage.',
    points: [
      { term: 'Pod', plain: 'The smallest thing Kubernetes runs: a wrapper around one or more containers.' },
      { term: 'Workload', plain: 'The general word for an app running in the cluster.' },
      { term: 'Manifest', plain: 'A YAML file describing what you want Kubernetes to create.' },
      { term: 'kubectl', plain: 'The command-line tool you use to talk to a Kubernetes cluster.' },
      { term: 'apply', plain: 'The command that tells Kubernetes “make the cluster match this file”.' },
    ],
  },
  'k8s-deployments': {
    intro:
      'You rarely manage Pods by hand. A Deployment is a manager that keeps the right number of identical Pods running, and rolls out new versions gradually so updates do not cause downtime.',
    points: [
      { term: 'Deployment', plain: 'A controller that keeps N copies of your app running and handles updates.' },
      { term: 'Replica', plain: 'One of the identical copies of your Pod running in parallel.' },
      { term: 'Scaling', plain: 'Changing how many replicas run, up for more traffic or down to save money.' },
      { term: 'Rolling update', plain: 'Replacing old Pods with new ones a few at a time, so the app never goes fully down.' },
      { term: 'Rollback', plain: 'Instantly reverting to the previous version if a new one is broken.' },
    ],
  },
  'k8s-services': {
    intro:
      'Pods come and go, and each gets a new address. A Service gives a stable, unchanging address and name for a group of Pods, so other apps can reliably reach them even as Pods are replaced.',
    points: [
      { term: 'Service', plain: 'A stable address and name for a set of Pods, even as those Pods change.' },
      { term: 'ClusterIP', plain: 'A Service reachable only inside the cluster (the default).' },
      { term: 'LoadBalancer', plain: 'A Service exposed to the outside world through a cloud load balancer.' },
      { term: 'Service discovery', plain: 'Finding the right Pods by a steady name instead of chasing changing IPs.' },
      { term: 'In-cluster DNS', plain: 'A built-in phonebook that lets Pods reach Services by simple names.' },
    ],
  },
  'k8s-config': {
    intro:
      'Apps need settings (like a database URL) and secrets (like passwords). Kubernetes keeps these separate from your image so you can change them without rebuilding, and handle secrets more carefully.',
    points: [
      { term: 'Configuration', plain: 'Settings your app reads at runtime, like which database to use.' },
      { term: 'ConfigMap', plain: 'A Kubernetes object that holds non-secret settings as key-value pairs.' },
      { term: 'Secret', plain: 'A special object for sensitive values like passwords and API keys.' },
      { term: 'Environment variable', plain: 'A named value handed to your app when it starts, a common way to pass settings.' },
      { term: 'Why separate', plain: 'So the same image can run in dev and prod with different settings, no rebuild needed.' },
    ],
  },
  'k8s-storage': {
    intro:
      'Most Pods are stateless and can disappear anytime. But databases need their data to stick around. Kubernetes offers persistent storage and a special controller (StatefulSet) for apps that must keep their identity and data.',
    points: [
      { term: 'Stateless', plain: 'An app that keeps no important data of its own; any copy is interchangeable.' },
      { term: 'Stateful', plain: 'An app that must remember data, like a database.' },
      { term: 'Persistent Volume', plain: 'Long-lived storage that survives Pod restarts and rescheduling.' },
      { term: 'StatefulSet', plain: 'A controller for stateful apps that gives each Pod a stable name and its own storage.' },
      { term: 'Claim', plain: 'A Pod’s request for a chunk of persistent storage of a certain size.' },
    ],
  },
  'k8s-ingress': {
    intro:
      'A Service can expose an app, but managing one public entry per app gets messy. Ingress is a single smart front door that routes incoming web traffic to the right Service based on the URL.',
    points: [
      { term: 'Ingress', plain: 'A rulebook that routes outside web traffic to the correct Service by hostname or path.' },
      { term: 'Ingress controller', plain: 'The actual program (often nginx) that reads those rules and does the routing.' },
      { term: 'Route', plain: 'A rule like “send shop.example.com to the shop Service”.' },
      { term: 'TLS termination', plain: 'Handling HTTPS encryption at the front door so apps behind it stay simple.' },
      { term: 'Gateway API', plain: 'A newer, more flexible standard that is gradually replacing Ingress.' },
    ],
  },
  'k8s-helm': {
    intro:
      'Deploying a real app to Kubernetes can take many YAML files. Helm is a package manager that bundles them into a reusable “chart”, so installing complex software becomes one command with a few settings.',
    points: [
      { term: 'Helm', plain: 'A package manager for Kubernetes, like an app installer.' },
      { term: 'Chart', plain: 'A reusable package of Kubernetes files for one app, with adjustable settings.' },
      { term: 'Values', plain: 'The settings you tweak to customize a chart for your environment.' },
      { term: 'Release', plain: 'One installed instance of a chart running in your cluster.' },
      { term: 'Templating', plain: 'Filling in blanks in the YAML so the same chart works in dev and prod.' },
    ],
  },
  'k8s-rbac': {
    intro:
      'In a shared cluster, not everyone should be able to do everything. RBAC controls who and what is allowed to take which actions, following the rule of giving each only the access it needs.',
    points: [
      { term: 'RBAC', plain: 'Role-Based Access Control: deciding who can do what, based on assigned roles.' },
      { term: 'Role', plain: 'A bundle of permissions, like “can read Pods in this namespace”.' },
      { term: 'Binding', plain: 'The link that grants a role to a specific user or service.' },
      { term: 'Service account', plain: 'An identity for a program (not a person) so apps can be limited too.' },
      { term: 'Least privilege', plain: 'Granting only the minimum access needed, so a mistake or breach does less harm.' },
    ],
  },
  'k8s-observability': {
    intro:
      'When a Pod misbehaves, you need to look inside the cluster to find out why. These tools let you read a Pod’s state, view its logs, and even step inside it, so you can diagnose problems.',
    points: [
      { term: 'Observability', plain: 'Being able to understand what is happening inside a system from the outside.' },
      { term: 'Logs', plain: 'The text messages a program prints about what it is doing.' },
      { term: 'describe', plain: 'A kubectl command that shows a resource’s full status and recent events.' },
      { term: 'exec', plain: 'A command that opens a shell inside a running container to look around.' },
      { term: 'CrashLoopBackOff', plain: 'A common error meaning a Pod keeps starting and crashing in a loop.' },
    ],
  },

  // ---------------- CI/CD ----------------
  'cicd-concepts': {
    intro:
      'CI/CD is about automating the boring, risky steps between writing code and getting it to users. Instead of a human manually testing and deploying, a pipeline does it the same way every time. CI checks your code; CD ships it.',
    points: [
      { term: 'CI (Continuous Integration)', plain: 'Automatically building and testing your code every time you push a change.' },
      { term: 'CD (Continuous Delivery)', plain: 'Automatically preparing every change so it is always ready to release with one click.' },
      { term: 'Continuous Deployment', plain: 'Going one step further: every passing change ships to users automatically, no click needed.' },
      { term: 'Pipeline', plain: 'The automated assembly line your code travels through: build, test, deploy.' },
      { term: 'Why automate', plain: 'Humans forget steps and make mistakes; automation does it identically every single time.' },
    ],
  },
  'cicd-pipelines': {
    intro:
      'A pipeline is built from stages that run in order, and jobs inside each stage. Defining them in a file means the whole process is written down, version-controlled, and repeatable.',
    points: [
      { term: 'Stage', plain: 'A phase of the pipeline, like “build” then “test” then “deploy”.' },
      { term: 'Job', plain: 'A unit of work inside a stage, such as running the test suite.' },
      { term: 'Step', plain: 'A single command inside a job.' },
      { term: 'Runner', plain: 'The machine that actually executes the pipeline’s jobs.' },
      { term: 'Trigger', plain: 'The event that starts the pipeline, usually a push or a pull request.' },
    ],
  },
  'cicd-testing': {
    intro:
      'Tests are code that checks your code automatically. A quality gate uses these tests to block a change from moving forward if something is broken, so bugs are caught before users ever see them.',
    points: [
      { term: 'Test', plain: 'Code that automatically verifies your app behaves as expected.' },
      { term: 'Unit test', plain: 'A small, fast test that checks one tiny piece of code in isolation.' },
      { term: 'Integration test', plain: 'A test that checks several parts work correctly together.' },
      { term: 'Quality gate', plain: 'A checkpoint that stops a broken change from continuing through the pipeline.' },
      { term: 'Fail fast', plain: 'Running the quickest checks first so problems surface in seconds, not hours.' },
    ],
  },
  'cicd-artifacts': {
    intro:
      'When a pipeline builds your code, the finished result is called an artifact. Storing it and caching repeated work makes pipelines faster and means you deploy exactly what you tested.',
    points: [
      { term: 'Artifact', plain: 'The packaged output of a build, like a container image or a zip file, ready to deploy.' },
      { term: 'Artifact store', plain: 'A place that keeps built artifacts so they can be reused and deployed later.' },
      { term: 'Cache', plain: 'Saved results of slow steps (like downloads) so the next run skips them.' },
      { term: 'Build once', plain: 'The habit of building a thing one time and promoting that same artifact through environments.' },
      { term: 'Reproducibility', plain: 'Getting the same artifact from the same code every time, with no surprises.' },
    ],
  },
  'cicd-secrets': {
    intro:
      'Pipelines often need passwords, tokens, or keys to deploy. These secrets must never be written in plain text in your code. Instead they are stored securely and injected only when needed.',
    points: [
      { term: 'Secret', plain: 'A sensitive value like a password, API key, or token that must stay hidden.' },
      { term: 'Hardcoding', plain: 'The dangerous mistake of typing a secret directly into your code or config.' },
      { term: 'Secret store', plain: 'A secure vault that holds secrets and hands them out only to those allowed.' },
      { term: 'Injection', plain: 'Supplying a secret to the pipeline at run time, never saving it in the repo.' },
      { term: 'Rotation', plain: 'Regularly replacing secrets so an old leaked one becomes useless.' },
    ],
  },
  'cicd-deploy-strategies': {
    intro:
      'Pushing a new version to all users at once is risky. Deployment strategies are safer ways to roll out changes gradually, so if something is wrong you affect few people and can undo it fast.',
    points: [
      { term: 'Deployment strategy', plain: 'The chosen method for releasing a new version with minimal risk.' },
      { term: 'Blue-green', plain: 'Running two copies (old and new) and switching traffic over instantly.' },
      { term: 'Canary', plain: 'Sending the new version to a small slice of users first, then more if it is healthy.' },
      { term: 'Rolling', plain: 'Replacing instances a few at a time so the app is never fully down.' },
      { term: 'Rollback', plain: 'Quickly switching back to the old version if the new one misbehaves.' },
    ],
  },
  'cicd-gitops-intro': {
    intro:
      'Attackers increasingly target the build pipeline itself, because whatever it builds gets trusted and shipped. Securing the supply chain means making sure every step and ingredient that goes into your software is trustworthy.',
    points: [
      { term: 'Supply chain', plain: 'Everything that goes into your software: code, libraries, build steps, and tools.' },
      { term: 'Dependency', plain: 'Outside code your app relies on. A poisoned dependency can compromise you.' },
      { term: 'Signing', plain: 'Stamping an artifact with proof of who built it, so tampering is detectable.' },
      { term: 'SBOM', plain: 'A “Software Bill of Materials”: a full list of everything inside your software.' },
      { term: 'Provenance', plain: 'A trustworthy record of where an artifact came from and how it was built.' },
    ],
  },

  // ---------------- Terraform & IaC ----------------
  'tf-iac': {
    intro:
      'Instead of clicking around a cloud console to create servers by hand, you can write a file describing the infrastructure you want, and a tool builds it for you. That idea is Infrastructure as Code, and Terraform is the leading tool.',
    points: [
      { term: 'Infrastructure', plain: 'The servers, networks, databases, and other cloud resources your app runs on.' },
      { term: 'Infrastructure as Code (IaC)', plain: 'Describing that infrastructure in text files instead of clicking buttons.' },
      { term: 'Terraform', plain: 'A popular tool that reads your files and creates the matching cloud resources.' },
      { term: 'Declarative', plain: 'You describe the end result you want, and the tool figures out how to get there.' },
      { term: 'Why IaC', plain: 'It makes infrastructure repeatable, reviewable, and easy to rebuild from scratch.' },
    ],
  },
  'tf-hcl': {
    intro:
      'Terraform files are written in a simple language called HCL. In it you declare resources, and a provider plugin translates those into real API calls to your cloud, like AWS or Google Cloud.',
    points: [
      { term: 'HCL', plain: 'HashiCorp Configuration Language: the readable syntax Terraform files are written in.' },
      { term: 'Resource', plain: 'One thing you want to create, like a server, a bucket, or a database.' },
      { term: 'Provider', plain: 'A plugin that knows how to talk to a specific cloud (AWS, Azure, GCP).' },
      { term: 'Variable', plain: 'A placeholder so the same config works with different values per environment.' },
      { term: 'Output', plain: 'A value Terraform reports back after creating things, like a server’s address.' },
    ],
  },
  'tf-state': {
    intro:
      'Terraform needs to remember what it has already built so it knows what to change next time. It records this in a state file. This file is the single most important and sensitive part of using Terraform.',
    points: [
      { term: 'State', plain: 'Terraform’s memory of what it has created, mapping your files to real resources.' },
      { term: 'State file', plain: 'The actual file holding that memory. Lose it and Terraform gets confused.' },
      { term: 'Backend', plain: 'Where the state file is stored, ideally a shared remote location, not your laptop.' },
      { term: 'Locking', plain: 'Preventing two people from changing infrastructure at the same time and clashing.' },
      { term: 'Why it matters', plain: 'The state can contain secrets and is the source of truth, so it must be protected.' },
    ],
  },
  'tf-plan': {
    intro:
      'Terraform never changes things blindly. First it shows you a plan: exactly what it will add, change, or destroy. You read it, and only then do you apply it. This preview step prevents costly mistakes.',
    points: [
      { term: 'plan', plain: 'A preview of the exact changes Terraform will make, shown before anything happens.' },
      { term: 'apply', plain: 'The step that actually carries out the changes from the plan.' },
      { term: 'destroy', plain: 'Tearing down the resources Terraform created.' },
      { term: 'Diff', plain: 'The list of differences between what exists now and what your files describe.' },
      { term: 'Always read the plan', plain: 'The golden habit: never apply without checking the plan, especially for destroys.' },
    ],
  },
  'tf-modules': {
    intro:
      'If you find yourself writing the same infrastructure over and over, you can package it into a reusable building block called a module. Then you use it many times with different inputs, just like a function in programming.',
    points: [
      { term: 'Module', plain: 'A reusable bundle of Terraform resources you can use again and again.' },
      { term: 'Input', plain: 'A value you pass into a module to customize what it builds.' },
      { term: 'Output', plain: 'A value a module hands back, like the ID of something it created.' },
      { term: 'Reuse', plain: 'Using the same tested module everywhere instead of copy-pasting config.' },
      { term: 'Versioning', plain: 'Pinning a module to a specific version so upgrades are deliberate.' },
    ],
  },
  'tf-workspaces': {
    intro:
      'You usually have multiple environments: a dev playground, a staging copy, and production. You want the same infrastructure shape in each, with small differences. Terraform offers ways to manage these separately and safely.',
    points: [
      { term: 'Environment', plain: 'A separate copy of your infrastructure, such as dev, staging, or production.' },
      { term: 'Workspace', plain: 'A Terraform feature for keeping separate state per environment.' },
      { term: 'Promotion', plain: 'Moving a tested change from dev up to staging and then to production.' },
      { term: 'Drift', plain: 'When the real infrastructure no longer matches your files, often from manual edits.' },
      { term: 'Parity', plain: 'Keeping environments as similar as possible so dev results predict production.' },
    ],
  },
  'tf-testing': {
    intro:
      'Just like app code, infrastructure code can be tested and governed. Policy as Code lets you write automatic rules, like “no storage bucket may be public”, that block bad infrastructure before it is created.',
    points: [
      { term: 'Policy', plain: 'A rule your infrastructure must follow, like “never open this to the public”.' },
      { term: 'Policy as Code', plain: 'Writing those rules as code so they are checked automatically every time.' },
      { term: 'Validation', plain: 'Checking config for mistakes before it is applied.' },
      { term: 'Guardrail', plain: 'An automatic limit that stops risky changes without blocking safe ones.' },
      { term: 'Why test infra', plain: 'A bad infrastructure change can cause outages or security holes, so catch them early.' },
    ],
  },

  // ---------------- Cloud ----------------
  'cloud-model': {
    intro:
      'The cloud just means renting computers in someone else\u2019s data center over the internet instead of buying your own. Companies like Amazon, Google, and Microsoft own huge buildings full of servers and let you use them by the hour. A region is the physical location of one of those buildings, like a city, and you pick one close to your users so things load fast.',
    points: [
      { term: 'Cloud', plain: 'Renting computers and storage over the internet instead of owning the hardware yourself.' },
      { term: 'Provider', plain: 'A company that rents you cloud resources, such as AWS, Azure, or Google Cloud.' },
      { term: 'Region', plain: 'A geographic area where a provider has data centers, like \u201cUS East\u201d or \u201cEurope West\u201d.' },
      { term: 'Availability Zone', plain: 'A separate building inside a region, so if one loses power the others keep running.' },
      { term: 'IaaS / PaaS / SaaS', plain: 'Three levels of renting: raw machines, a ready-made platform, or finished software you just log into.' },
      { term: 'On-demand', plain: 'You turn resources on when you need them and pay only for what you use.' },
    ],
  },
  'cloud-iam': {
    intro:
      'IAM stands for Identity and Access Management. It is the system that decides who is allowed to do what in your cloud account. Think of it like keys and locks: a person or program gets an identity, and you hand them only the keys they truly need.',
    points: [
      { term: 'Identity', plain: 'Who someone is, such as a user account or an automated program.' },
      { term: 'Permission', plain: 'A specific thing an identity is allowed to do, like read a file or start a server.' },
      { term: 'Role', plain: 'A bundle of permissions you can hand to a person or service at once.' },
      { term: 'Policy', plain: 'A written rule that lists exactly what is allowed or denied.' },
      { term: 'Least privilege', plain: 'Giving each identity the smallest set of permissions it needs and nothing more.' },
      { term: 'Credential', plain: 'The secret proof of identity, like a password or access key, used to log in.' },
    ],
  },
  'cloud-compute': {
    intro:
      'Compute just means the part of the cloud that actually runs your code and does work. There are a few flavors: a full virtual computer you control, a lightweight container, or serverless where you only hand over code and the cloud runs it for you.',
    points: [
      { term: 'Compute', plain: 'The cloud resources that run your programs and do the processing.' },
      { term: 'Virtual Machine (VM)', plain: 'A whole computer that exists as software, which you rent and manage like your own PC.' },
      { term: 'Container', plain: 'A small, fast package that holds an app and everything it needs to run.' },
      { term: 'Serverless', plain: 'You upload only your code and the cloud runs it on demand, with no machine to manage.' },
      { term: 'Instance', plain: 'One running copy of a virtual machine.' },
      { term: 'Autoscaling', plain: 'Automatically adding or removing machines as traffic goes up or down.' },
    ],
  },
  'cloud-network': {
    intro:
      'In the cloud, your servers need a private space to talk to each other safely. A VPC, or Virtual Private Cloud, is your own walled-off section of the cloud network where you decide what can connect to what. It is like having your own private office network inside a giant shared building.',
    points: [
      { term: 'Network', plain: 'The connections that let computers send data to each other.' },
      { term: 'VPC', plain: 'Your private, isolated section of the cloud network that you fully control.' },
      { term: 'Subnet', plain: 'A smaller slice of your VPC, often split into public and private parts.' },
      { term: 'Public vs private', plain: 'Public resources can be reached from the internet; private ones cannot.' },
      { term: 'Security group', plain: 'A set of rules controlling which traffic is allowed in or out of a resource.' },
      { term: 'Gateway', plain: 'A door that connects your private network to the internet or to other networks.' },
    ],
  },
  'cloud-storage': {
    intro:
      'Storage is simply where your data lives in the cloud. Different jobs need different kinds of storage: big buckets for files like images, fast disks attached to servers, and databases for organized, searchable information.',
    points: [
      { term: 'Storage', plain: 'Any place the cloud keeps your data so you can get it back later.' },
      { term: 'Object storage', plain: 'A giant bucket for files like photos, videos, and backups, reached over the internet.' },
      { term: 'Block storage', plain: 'A virtual hard drive you attach to a server for fast, local-feeling access.' },
      { term: 'Database', plain: 'Software that stores data in an organized way so you can search and update it quickly.' },
      { term: 'SQL vs NoSQL', plain: 'SQL stores data in neat tables; NoSQL is more flexible for less structured data.' },
      { term: 'Backup', plain: 'A saved copy of your data you can restore if something goes wrong.' },
    ],
  },
  'cloud-cost': {
    intro:
      'Because you pay for the cloud by the hour or by usage, costs can quietly grow large. FinOps is the practice of watching and controlling cloud spending so you only pay for what you actually need. It is just good budgeting applied to your cloud bill.',
    points: [
      { term: 'Billing', plain: 'The charges you rack up for using cloud resources.' },
      { term: 'FinOps', plain: 'A team habit of tracking and trimming cloud costs continuously.' },
      { term: 'Pay-as-you-go', plain: 'You are charged based on how much you use, by the hour or request.' },
      { term: 'Reserved / Savings', plain: 'Committing to use a resource for a year or more in exchange for a lower price.' },
      { term: 'Right-sizing', plain: 'Picking a machine that fits your needs instead of one that is too big and wasteful.' },
      { term: 'Idle resources', plain: 'Things you are paying for but not using, which you should turn off.' },
    ],
  },
  'cloud-wellarchitected': {
    intro:
      'Well-Architected is a checklist of good habits that cloud providers recommend for building systems that are reliable, secure, and affordable. It is not a single tool, just a set of questions you ask to make sure you did not skip something important.',
    points: [
      { term: 'Architecture', plain: 'The overall design of how all the pieces of your system fit together.' },
      { term: 'Reliability', plain: 'How well your system keeps working even when parts fail.' },
      { term: 'Performance', plain: 'How fast and smoothly your system responds to users.' },
      { term: 'Security pillar', plain: 'Protecting your data and systems from attackers and mistakes.' },
      { term: 'Cost optimization', plain: 'Making sure you get the job done without overspending.' },
      { term: 'Operational excellence', plain: 'Running and improving your system smoothly day to day.' },
    ],
  },
  'cloud-multicloud': {
    intro:
      'Multi-cloud means using more than one cloud provider at the same time, for example some things on Amazon and others on Google. Portability means building your system so it is not locked into a single provider and could move if needed. The goal is flexibility and avoiding being trapped.',
    points: [
      { term: 'Multi-cloud', plain: 'Using two or more cloud providers together instead of just one.' },
      { term: 'Vendor lock-in', plain: 'Being so tied to one provider that switching would be hard and costly.' },
      { term: 'Portability', plain: 'Designing your system so it can move between providers with little rework.' },
      { term: 'Abstraction', plain: 'Hiding provider-specific details behind a common layer so your code stays generic.' },
      { term: 'Hybrid cloud', plain: 'Mixing your own data center with public cloud resources.' },
      { term: 'Trade-off', plain: 'The downside, like extra complexity, that comes with the flexibility of multi-cloud.' },
    ],
  },

  // ---------------- Monitoring & Observability ----------------
  'mon-pillars': {
    intro:
      'Once your software is running, you need to know if it is healthy. Observability means being able to understand what is happening inside your system from the outside. It usually rests on three pillars: metrics, logs, and traces, which together answer what is wrong, why, and where.',
    points: [
      { term: 'Monitoring', plain: 'Watching your system to spot problems, ideally before users do.' },
      { term: 'Observability', plain: 'Being able to understand the inside of your system from the signals it gives off.' },
      { term: 'Metrics', plain: 'Numbers measured over time, like CPU usage or requests per second.' },
      { term: 'Logs', plain: 'Text records of events, like a diary your software writes as it runs.' },
      { term: 'Traces', plain: 'A timeline showing how one request traveled through all your services.' },
      { term: 'Why it matters', plain: 'You cannot fix what you cannot see, so these signals guide every fix.' },
    ],
  },
  'mon-metrics': {
    intro:
      'Metrics are simple numbers your system reports over time, like temperature readings for software. Prometheus is a popular free tool that regularly collects these numbers and stores them so you can graph and alert on them. Watching metrics tells you if things are getting slower or busier.',
    points: [
      { term: 'Metric', plain: 'A number measured repeatedly over time, such as memory used or error count.' },
      { term: 'Prometheus', plain: 'A widely used open-source tool that gathers and stores metrics.' },
      { term: 'Scrape', plain: 'When Prometheus reaches out and pulls the current numbers from your app.' },
      { term: 'Time series', plain: 'A list of values for one metric stamped with the time each was recorded.' },
      { term: 'Counter vs gauge', plain: 'A counter only goes up (total requests); a gauge can go up or down (current users).' },
      { term: 'Query', plain: 'Asking the metrics store a question, like \u201cwhat was CPU usage last hour\u201d.' },
    ],
  },
  'mon-logs': {
    intro:
      'Logs are the text messages your software writes while it runs, like \u201cuser logged in\u201d or \u201cpayment failed\u201d. When you have many servers, you collect all their logs into one place so you can search them together. That collecting and combining is called aggregation.',
    points: [
      { term: 'Log', plain: 'A line of text your program writes to record that something happened.' },
      { term: 'Log level', plain: 'A label like info, warning, or error showing how serious a message is.' },
      { term: 'Aggregation', plain: 'Gathering logs from many machines into one searchable place.' },
      { term: 'Structured logging', plain: 'Writing logs in a tidy format like JSON so computers can search them easily.' },
      { term: 'Retention', plain: 'How long you keep logs before deleting them to save space.' },
      { term: 'Search', plain: 'Looking through collected logs to find the clue you need.' },
    ],
  },
  'mon-tracing': {
    intro:
      'In modern apps, one click might touch many small services. Distributed tracing follows a single request as it hops from service to service and records how long each step took. It is like putting a tracking number on a package so you can see every stop on its journey.',
    points: [
      { term: 'Trace', plain: 'The full recorded journey of one request through your whole system.' },
      { term: 'Span', plain: 'One step in that journey, such as a single service handling part of the work.' },
      { term: 'Latency', plain: 'How long a step or the whole request took to finish.' },
      { term: 'Distributed', plain: 'Spread across many separate services or machines.' },
      { term: 'Trace ID', plain: 'A shared label that ties all the steps of one request together.' },
      { term: 'Bottleneck', plain: 'The slowest step that holds up the whole request, which tracing helps you find.' },
    ],
  },
  'mon-dashboards': {
    intro:
      'A dashboard is a screen full of charts that shows the health of your system at a glance. Grafana is a popular free tool for building these dashboards by pulling in your metrics and drawing graphs. Good dashboards turn piles of numbers into pictures anyone can read.',
    points: [
      { term: 'Dashboard', plain: 'A single screen of charts summarizing how your system is doing.' },
      { term: 'Grafana', plain: 'A popular open-source tool for building and viewing dashboards.' },
      { term: 'Panel', plain: 'One chart or widget on a dashboard showing a single thing.' },
      { term: 'Data source', plain: 'Where the dashboard pulls its numbers from, like Prometheus.' },
      { term: 'Visualization', plain: 'Turning numbers into a graph, gauge, or table that is easy to read.' },
      { term: 'At a glance', plain: 'The goal of a dashboard: understand health in a few seconds.' },
    ],
  },
  'mon-alerting': {
    intro:
      'An alert is an automatic message that warns you when something is wrong, so you do not have to stare at dashboards all day. On-call means being the person responsible for answering those alerts during a shift. Good alerts wake you only for things that truly matter.',
    points: [
      { term: 'Alert', plain: 'An automatic notification that fires when a metric crosses a danger line.' },
      { term: 'Threshold', plain: 'The limit that, once crossed, triggers an alert.' },
      { term: 'On-call', plain: 'Taking turns being the person who responds when alerts fire.' },
      { term: 'Paging', plain: 'Urgently contacting the on-call person, often by phone, for serious problems.' },
      { term: 'Alert fatigue', plain: 'Getting so many noisy alerts that you start ignoring them, which is dangerous.' },
      { term: 'Escalation', plain: 'Passing an unanswered alert to the next person up the chain.' },
    ],
  },
  'mon-slo': {
    intro:
      'How reliable should your service be? SLIs, SLOs, and error budgets are a way to answer that with numbers instead of guesses. You measure something users care about, set a target, and allow a small amount of failure as your budget. This keeps teams honest about reliability.',
    points: [
      { term: 'SLI', plain: 'A Service Level Indicator: a measured number showing how well you are doing, like the percent of fast requests.' },
      { term: 'SLO', plain: 'A Service Level Objective: the target you promise to hit, like 99.9 percent uptime.' },
      { term: 'Error budget', plain: 'The small amount of failure you are allowed before breaking your promise.' },
      { term: 'Uptime', plain: 'The percent of time your service is working and available.' },
      { term: 'Reliability', plain: 'How dependably your service does what users expect.' },
      { term: 'Why budgets', plain: 'They let you balance shipping new features against staying stable.' },
    ],
  },

  // ---------------- DevSecOps ----------------
  'sec-shift': {
    intro:
      'Security used to be checked only at the very end, right before launch, which made fixing problems slow and costly. Shift-left means moving security checks earlier, into the everyday work of writing and building code. Finding a problem early is far cheaper than finding it after release.',
    points: [
      { term: 'Security', plain: 'Protecting your software and data from attackers and accidents.' },
      { term: 'Shift-left', plain: 'Doing security checks early in development instead of only at the end.' },
      { term: 'Vulnerability', plain: 'A weakness in software that an attacker could exploit.' },
      { term: 'DevSecOps', plain: 'Building security into the normal development and operations workflow.' },
      { term: 'Automated check', plain: 'A tool that scans your code for problems without a human having to remember.' },
      { term: 'Cost of late fixes', plain: 'The later a bug is found, the more expensive and risky it is to fix.' },
    ],
  },
  'sec-secrets': {
    intro:
      'Secrets are sensitive pieces of information like passwords, API keys, and certificates that must stay hidden. Secrets management is the practice of storing and handing out these secrets safely, instead of pasting them into code where anyone could find them.',
    points: [
      { term: 'Secret', plain: 'Sensitive data like a password, token, or key that must be kept private.' },
      { term: 'Hardcoding', plain: 'Typing a secret directly into your code, which is unsafe and should be avoided.' },
      { term: 'Secrets manager', plain: 'A secure vault that stores secrets and hands them out only to those allowed.' },
      { term: 'Rotation', plain: 'Regularly changing secrets so an old leaked one stops working.' },
      { term: 'Encryption', plain: 'Scrambling data so only someone with the key can read it.' },
      { term: 'Access control', plain: 'Rules deciding exactly who or what can read each secret.' },
    ],
  },
  'sec-scanning': {
    intro:
      'Vulnerability scanning means using tools to automatically search your code, containers, and dependencies for known security weaknesses. It is like a spell-checker, but for security holes. Running scans regularly catches problems before attackers do.',
    points: [
      { term: 'Scanning', plain: 'Automatically inspecting code or systems to find known weaknesses.' },
      { term: 'Dependency', plain: 'Outside code your app relies on, which can carry its own vulnerabilities.' },
      { term: 'CVE', plain: 'A public ID for a known security flaw, used so everyone refers to it the same way.' },
      { term: 'False positive', plain: 'A warning that turns out not to be a real problem.' },
      { term: 'Severity', plain: 'How dangerous a found weakness is, from low to critical.' },
      { term: 'Patch', plain: 'An update that fixes a known vulnerability.' },
    ],
  },
  'sec-supplychain': {
    intro:
      'Your software is built from many outside pieces: libraries, base images, and tools. The supply chain is that whole chain of ingredients. Supply chain security means making sure every ingredient is trustworthy and has not been tampered with before it reaches your product.',
    points: [
      { term: 'Supply chain', plain: 'All the outside code and tools that go into building your software.' },
      { term: 'Provenance', plain: 'Proof of where a piece of code came from and that it is genuine.' },
      { term: 'SBOM', plain: 'A Software Bill of Materials: a list of every ingredient in your software.' },
      { term: 'Signing', plain: 'Adding a tamper-proof seal so you can verify code was not altered.' },
      { term: 'Trusted source', plain: 'A place you are confident gives you safe, unmodified code.' },
      { term: 'Tampering', plain: 'When someone secretly changes code to sneak in something malicious.' },
    ],
  },
  'sec-policy': {
    intro:
      'Policy as Code means writing your security and compliance rules as code that a computer can check automatically. Instead of a human reading a checklist, a tool enforces the rules every time. This makes the rules consistent and impossible to forget.',
    points: [
      { term: 'Policy', plain: 'A rule your systems must follow, like \u201cno server may be open to the public\u201d.' },
      { term: 'Policy as Code', plain: 'Writing those rules in code so they are checked automatically.' },
      { term: 'Enforcement', plain: 'Automatically blocking anything that breaks a rule.' },
      { term: 'Compliance', plain: 'Proving you follow the rules required by law or company standards.' },
      { term: 'Guardrail', plain: 'An automatic limit that stops risky actions while allowing safe ones.' },
      { term: 'Audit trail', plain: 'A record showing the rules were checked and what the result was.' },
    ],
  },
  'sec-compliance': {
    intro:
      'Compliance means following the rules set by laws, industry standards, or your own company, such as protecting customer data. Hardening means tightening up your systems to remove weaknesses, like locking every door and window. Together they keep you both legal and safe.',
    points: [
      { term: 'Compliance', plain: 'Following required rules and being able to prove it.' },
      { term: 'Standard', plain: 'An agreed-upon set of rules, like PCI for payments or HIPAA for health data.' },
      { term: 'Hardening', plain: 'Removing weak spots and turning off anything unnecessary to reduce risk.' },
      { term: 'Audit', plain: 'An official check to confirm you are following the rules.' },
      { term: 'Baseline', plain: 'A known-good secure starting configuration you compare against.' },
      { term: 'Attack surface', plain: 'All the ways an attacker could try to get in; hardening shrinks it.' },
    ],
  },

  // ---------------- GitOps ----------------
  'gitops-principles': {
    intro:
      'GitOps is a way of running infrastructure where Git, the place you store code, becomes the single source of truth for how everything should look. You describe the desired state in files, and an automatic tool makes the real system match those files. To change something, you change the files, not the live system.',
    points: [
      { term: 'GitOps', plain: 'Managing your systems by editing files in Git and letting a tool apply them.' },
      { term: 'Source of truth', plain: 'The one authoritative place that defines how things should be, here it is Git.' },
      { term: 'Desired state', plain: 'A written description of how your system should look.' },
      { term: 'Reconciliation', plain: 'A tool constantly comparing reality to the files and fixing differences.' },
      { term: 'Declarative', plain: 'Saying what you want, not the step-by-step of how to get there.' },
      { term: 'Pull request', plain: 'A proposed file change others review before it goes live.' },
    ],
  },
  'gitops-argo': {
    intro:
      'Argo CD is a popular GitOps tool for Kubernetes. It watches a Git repository and makes your cluster match what the files say. If someone changes the live system by hand, Argo CD notices the difference and can put it back, keeping reality and your files in sync.',
    points: [
      { term: 'Argo CD', plain: 'A GitOps tool that keeps a Kubernetes cluster matching files in Git.' },
      { term: 'Sync', plain: 'Making the live cluster match the desired state stored in Git.' },
      { term: 'Drift', plain: 'When the live system no longer matches the files, often from manual edits.' },
      { term: 'Application', plain: 'In Argo CD, a defined link between a Git folder and where it should deploy.' },
      { term: 'Healthy vs degraded', plain: 'Argo CD shows whether your deployed app is running fine or has problems.' },
      { term: 'Self-heal', plain: 'Automatically undoing unwanted manual changes to restore the desired state.' },
    ],
  },
  'gitops-flux': {
    intro:
      'Flux is another popular GitOps tool, similar in spirit to Argo CD. It runs inside your Kubernetes cluster, watches your Git repository, and automatically applies any changes it finds. The idea is the same: Git is the source of truth and Flux keeps the cluster matching it.',
    points: [
      { term: 'Flux', plain: 'A GitOps tool that runs in your cluster and applies changes from Git automatically.' },
      { term: 'Controller', plain: 'A small program inside the cluster that watches and takes action.' },
      { term: 'Repository', plain: 'The Git project that holds your desired configuration files.' },
      { term: 'Automation', plain: 'Applying changes without a human running commands by hand.' },
      { term: 'Polling', plain: 'Regularly checking Git for new changes to apply.' },
      { term: 'Reconcile', plain: 'Bringing the cluster back in line with what the files say.' },
    ],
  },
  'gitops-rollouts': {
    intro:
      'Progressive delivery means rolling out a new version slowly and carefully instead of switching everyone at once. You send the new version to a small group first, watch for problems, and only continue if all looks well. This limits the damage if the new version is bad.',
    points: [
      { term: 'Progressive delivery', plain: 'Releasing a change gradually to small groups before everyone gets it.' },
      { term: 'Canary', plain: 'Sending the new version to a tiny slice of users first as a test.' },
      { term: 'Blue-green', plain: 'Running old and new versions side by side, then switching traffic over.' },
      { term: 'Rollback', plain: 'Quickly going back to the old version if the new one misbehaves.' },
      { term: 'Metrics gate', plain: 'A check that pauses the rollout if error rates climb.' },
      { term: 'Blast radius', plain: 'How many users a bad release can hurt, which gradual rollout keeps small.' },
    ],
  },
  'gitops-secrets': {
    intro:
      'GitOps stores everything in Git, but you cannot put raw passwords there because anyone could read them. Managing secrets in GitOps means storing them in a safe, encrypted way so the files in Git stay harmless while the real secret is still delivered securely to the cluster.',
    points: [
      { term: 'Secret', plain: 'Sensitive data like a password or key that must stay private.' },
      { term: 'Encrypted secret', plain: 'A secret scrambled so it is safe to store in Git, unreadable without the key.' },
      { term: 'Sealed secret', plain: 'A common method where only the cluster can unscramble the stored secret.' },
      { term: 'External vault', plain: 'Keeping the real secret in a separate secure store, not in Git at all.' },
      { term: 'Decryption', plain: 'Unscrambling the secret inside the cluster when it is actually needed.' },
      { term: 'Why not plain', plain: 'Plain-text secrets in Git could be seen by anyone with repo access.' },
    ],
  },

  // ---------------- Site Reliability Engineering ----------------
  'sre-what': {
    intro:
      'SRE stands for Site Reliability Engineering. It is an approach, started at Google, where engineers use software and data to keep systems reliable instead of relying on manual effort. The core idea is treating operations problems as engineering problems you can measure and automate away.',
    points: [
      { term: 'SRE', plain: 'Site Reliability Engineering: using software skills to keep systems dependable.' },
      { term: 'Reliability', plain: 'How consistently your service works the way users expect.' },
      { term: 'Toil', plain: 'Boring repetitive manual work that SREs try to automate or remove.' },
      { term: 'Automation', plain: 'Replacing manual steps with code so machines handle the routine work.' },
      { term: 'Operations', plain: 'The day-to-day work of running and maintaining live systems.' },
      { term: 'Engineering mindset', plain: 'Solving operational pain with better tools and design, not just more effort.' },
    ],
  },
  'sre-slos': {
    intro:
      'Reliability targets are clear numbers that say how dependable a service should be, so the team is not just guessing. They are built from a measured indicator, a target goal, and a small budget for failure. These numbers help decide when to focus on stability versus new features.',
    points: [
      { term: 'Reliability target', plain: 'A specific number describing how dependable a service must be.' },
      { term: 'SLI', plain: 'The measured number, like the percent of requests that succeed.' },
      { term: 'SLO', plain: 'The goal you aim for, like 99.9 percent of requests succeeding.' },
      { term: 'Error budget', plain: 'The small amount of failure allowed before you break the goal.' },
      { term: 'Nines', plain: 'Shorthand for uptime levels, like \u201cthree nines\u201d meaning 99.9 percent.' },
      { term: 'Trade-off', plain: 'Using the budget to balance shipping features against staying stable.' },
    ],
  },
  'sre-incidents': {
    intro:
      'An incident is any unplanned event that hurts your service, like an outage. Incident management is the organized way a team responds: detecting the problem, coordinating the fix, and communicating clearly until things are back to normal. Having a plan turns chaos into calm.',
    points: [
      { term: 'Incident', plain: 'An unplanned problem that disrupts your service for users.' },
      { term: 'Severity', plain: 'How bad the incident is, which decides how urgently you respond.' },
      { term: 'Incident commander', plain: 'The person who coordinates the response and makes decisions.' },
      { term: 'Mitigation', plain: 'A quick action that stops the bleeding, even before the full fix.' },
      { term: 'Communication', plain: 'Keeping users and teammates informed about status during the incident.' },
      { term: 'Resolution', plain: 'The point where the service is working normally again.' },
    ],
  },
  'sre-postmortem': {
    intro:
      'After an incident, you write a postmortem, a document explaining what happened and how to prevent it next time. Blameless means you focus on fixing the system, not punishing people. When people are not afraid of blame, they share the full truth and everyone learns more.',
    points: [
      { term: 'Postmortem', plain: 'A write-up after an incident describing what went wrong and why.' },
      { term: 'Blameless', plain: 'Focusing on fixing causes, not blaming the people involved.' },
      { term: 'Root cause', plain: 'The real underlying reason the incident happened.' },
      { term: 'Timeline', plain: 'A step-by-step record of what happened and when.' },
      { term: 'Action item', plain: 'A specific follow-up task to prevent the problem from recurring.' },
      { term: 'Learning culture', plain: 'Treating failures as chances to improve rather than reasons to punish.' },
    ],
  },
  'sre-capacity': {
    intro:
      'Capacity planning means making sure you have enough computing power to handle expected demand, without buying far too much. Reliability patterns are proven design tricks, like retries and backups, that help systems keep working when parts fail. Together they prepare you for both growth and trouble.',
    points: [
      { term: 'Capacity', plain: 'How much work your system can handle before it slows or breaks.' },
      { term: 'Capacity planning', plain: 'Predicting future demand and making sure you have enough resources.' },
      { term: 'Headroom', plain: 'Spare capacity kept in reserve for unexpected spikes.' },
      { term: 'Redundancy', plain: 'Having backup parts so one failure does not take everything down.' },
      { term: 'Failover', plain: 'Automatically switching to a backup when the main part fails.' },
      { term: 'Graceful degradation', plain: 'Losing some features instead of crashing entirely when overloaded.' },
    ],
  },

  // ---------------- Platform Engineering ----------------
  'pe-what': {
    intro:
      'Platform engineering means building an internal toolset that makes life easier for your own developers. An IDP, or Internal Developer Platform, is that toolset: a set of self-service tools so developers can ship code without needing to understand every piece of the underlying infrastructure.',
    points: [
      { term: 'Platform engineering', plain: 'Building internal tools that make your developers faster and happier.' },
      { term: 'IDP', plain: 'Internal Developer Platform: the self-service toolset developers use to ship.' },
      { term: 'Self-service', plain: 'Letting developers do things themselves without filing a ticket and waiting.' },
      { term: 'Abstraction', plain: 'Hiding complex details so developers only deal with the simple parts.' },
      { term: 'Developer', plain: 'The person writing application code, who is the customer of the platform.' },
      { term: 'Cognitive load', plain: 'How much a developer must hold in their head; good platforms reduce it.' },
    ],
  },
  'pe-goldenpath': {
    intro:
      'A golden path is a recommended, well-supported way to do a common task, like creating a new service. It is the easy, paved road that already handles the boring setup correctly. Developers can stray off it if needed, but the golden path makes the right way the easy way.',
    points: [
      { term: 'Golden path', plain: 'The recommended, well-supported way to do a common task.' },
      { term: 'Paved road', plain: 'Another name for the golden path: a smooth, ready-made route.' },
      { term: 'Template', plain: 'A pre-built starting point so developers do not begin from scratch.' },
      { term: 'Self-service', plain: 'Developers using the golden path on their own, without waiting on a team.' },
      { term: 'Opinionated', plain: 'The platform makes sensible default choices for you to reduce decisions.' },
      { term: 'Guardrails', plain: 'Safe limits built into the path so the easy way is also the correct way.' },
    ],
  },
  'pe-backstage': {
    intro:
      'A developer portal is a single website where developers find everything they need: their services, documentation, and tools. Backstage is a popular open-source tool for building such a portal. It acts like a front door, so developers do not have to hunt across many systems.',
    points: [
      { term: 'Developer portal', plain: 'One website where developers find their services, docs, and tools.' },
      { term: 'Backstage', plain: 'A popular open-source tool for building a developer portal.' },
      { term: 'Catalog', plain: 'A searchable list of all your services and who owns each one.' },
      { term: 'Plugin', plain: 'An add-on that brings a new tool or feature into the portal.' },
      { term: 'Single pane of glass', plain: 'One screen that pulls together info scattered across many systems.' },
      { term: 'Discoverability', plain: 'How easily developers can find what already exists instead of rebuilding it.' },
    ],
  },
  'pe-dx': {
    intro:
      'DX stands for Developer Experience, meaning how pleasant and productive it feels to build software at your company. DX metrics are numbers that measure that experience, like how long it takes to ship a change. You measure it so you know what to improve.',
    points: [
      { term: 'Developer Experience (DX)', plain: 'How smooth and productive it feels for developers to do their work.' },
      { term: 'Metric', plain: 'A number you measure to track how things are going.' },
      { term: 'Lead time', plain: 'How long from writing code to having it running in production.' },
      { term: 'Deployment frequency', plain: 'How often the team successfully ships changes.' },
      { term: 'Feedback loop', plain: 'How quickly a developer learns whether their change worked.' },
      { term: 'Why measure DX', plain: 'Happier, faster developers ship better software, so it is worth tracking.' },
    ],
  },
  'pe-abstractions': {
    intro:
      'An abstraction is a simpler interface that hides messy details underneath. In platform engineering, you give developers clean abstractions and APIs so they can ask for what they want, like a database, without learning every underlying detail. Good abstractions make complex systems feel simple.',
    points: [
      { term: 'Abstraction', plain: 'A simple front that hides complicated details behind it.' },
      { term: 'API', plain: 'A defined way for one piece of software to ask another for something.' },
      { term: 'Interface', plain: 'The agreed set of buttons and requests you use, without seeing the inner workings.' },
      { term: 'Encapsulation', plain: 'Wrapping up complexity so users only touch the safe, simple parts.' },
      { term: 'Leaky abstraction', plain: 'When hidden details still poke through and confuse the user, which you try to avoid.' },
      { term: 'Why it helps', plain: 'Developers move faster when they do not have to understand everything underneath.' },
    ],
  },
};
