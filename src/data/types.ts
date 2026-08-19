export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// A terminal line: either a raw string, or a command paired with a plain-language note.
export type CodeLine = string | { cmd: string; note?: string };

export interface Topic {
  id: string;
  name: string;
  difficulty: Difficulty;
  minutes: number;
  optional?: boolean;
  summary: string;
  objectives: string[];
  // Absolute-beginner primer shown before the main lesson. Each point defines
  // a term or idea in plain English, assuming zero prior knowledge.
  basics?: { intro: string; points: { term: string; plain: string }[] };
  sections: { heading: string; body: string }[];
  code?: { label: string; lines: CodeLine[] };
  resources: { label: string; kind: string }[];
}

export type Phase = 'foundations' | 'core' | 'advanced';

export interface Track {
  id: string;
  name: string;
  short: string;
  blurb: string;
  icon: string; // icon key
  difficulty: Difficulty;
  phase: Phase;
  popular?: boolean;
  locked?: boolean;
  // A short, action-oriented one-liner used on cards (verb-first outcome).
  action?: string;
  topics: Topic[];
}

// A build step: a short imperative title plus a plain-language "how", written
// as a simple memory aid (an analogy or a mnemonic) so it sticks.
export interface ProjectStep {
  title: string;
  how: string;
}

export interface Project {
  id: string;
  title: string;
  trackId: string;
  area: string;
  difficulty: Difficulty;
  time: string;
  blurb: string;
  icon: string;
  outcomes: string[];
  steps: ProjectStep[];
  stack: string[];
  prerequisites: string[];
}

export interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: Difficulty;
  answer: string;
}
