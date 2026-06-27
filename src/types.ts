/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PositionType = 'BUY' | 'SELL';

export type TradeOutcome = 'PROFIT' | 'LOSS' | 'BREAK_EVEN' | 'RUNNING';

export interface Trade {
  id: string;
  pair: string;
  type: PositionType;
  entryPrice: number;
  exitPrice?: number;
  lotSize: number;
  stopLoss?: number;
  takeProfit?: number;
  entryTime: string;
  exitTime?: string;
  outcome: TradeOutcome;
  profitAmount?: number; // positive or negative
  strategy: string; // e.g. 'SMC', 'Price Action', 'Breakout', 'Trend'
  emotion: string; // e.g. 'Patient', 'Fearful', 'Greedy', 'Confident', 'Neutral'
  session: string; // e.g. 'London', 'New York', 'Asian', 'Overlap'
  notes?: string;
  screenshot?: string; // base64 encoded or placeholder image URL
  riskReward?: number; // e.g. 1.5, 3.0
}

export interface AccountSettings {
  balance: number;
  currency: string; // e.g. 'USD', 'EUR', 'GBP', 'JPY'
  riskPerTrade: number; // default percentage e.g. 1% or 2%
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  youtubeId?: string;
  contentMarkdown: string;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  tagline: string;
  lessons: Lesson[];
  cheatsheetPdfTitle: string;
  cheatsheetSlides: string[]; // List of visual concepts / mock PDF slides
}
