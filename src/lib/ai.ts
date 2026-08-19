// Frontend client for the AI interview serverless function.
// Posts to /api/interview on the same origin so it works locally (vercel dev)
// and in production without any base-URL config.

import type { Difficulty } from '../data/types';

export type Provider = 'openai' | 'anthropic' | 'fallback';

export interface GradeResult {
  score: number;
  verdict: string;
  strengths: string[];
  gaps: string[];
  improved: string;
  provider: Provider;
}

export interface MockTurn {
  role: 'interviewer' | 'candidate';
  content: string;
}

export interface QuestionReview {
  question: string;
  answer: string;
  score: number;
  covered: string[];
  missing: string[];
  model: string;
}

export interface ScoreCard {
  overall: number;
  dimensions: { label: string; score: number; note: string }[];
  summary: string;
  nextSteps: string[];
  review?: QuestionReview[];
}

export interface MockResult {
  message: string;
  done: boolean;
  scorecard?: ScoreCard;
  provider: Provider;
}

const ENDPOINT = '/api/interview';

async function post<T>(payload: unknown): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = 'The interviewer is unavailable right now. Please try again.';
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export function gradeAnswer(input: {
  question: string;
  category: string;
  difficulty: Difficulty;
  modelAnswer?: string;
  userAnswer: string;
}): Promise<GradeResult> {
  return post<GradeResult>({ action: 'grade', ...input });
}

export function mockNext(input: {
  role: string;
  focus?: string;
  difficulty: Difficulty;
  transcript: MockTurn[];
  questionCount: number;
  maxQuestions: number;
}): Promise<MockResult> {
  return post<MockResult>({ action: 'mock', stage: 'next', ...input });
}

export function mockSummary(input: {
  role: string;
  focus?: string;
  difficulty: Difficulty;
  transcript: MockTurn[];
  questionCount: number;
  maxQuestions: number;
}): Promise<MockResult> {
  return post<MockResult>({ action: 'mock', stage: 'summary', ...input });
}
