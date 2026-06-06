export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Topic {
  id: string;
  name: string;
  difficulty: Difficulty;
  minutes: number;
  optional?: boolean;
  summary: string;
  objectives: string[];
  sections: { heading: string; body: string }[];
  code?: { label: string; lines: string[] };
  resources: { label: string; kind: string }[];
}

export interface Track {
  id: string;
  name: string;
  short: string;
  blurb: string;
  icon: string; // icon key
  difficulty: Difficulty;
  popular?: boolean;
  locked?: boolean;
  topics: Topic[];
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
  steps: string[];
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
