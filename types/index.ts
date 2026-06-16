export type InterviewType = "behavioral" | "technical" | "mixed";
export type Difficulty = "entry" | "mid" | "senior";
export type SessionStatus = "in_progress" | "completed";

export interface Session {
  id: string;
  user_id: string;
  role: string;
  job_description?: string;
  interview_type: InterviewType;
  difficulty: Difficulty;
  question_count: number;
  total_score?: number;
  status: SessionStatus;
  created_at: string;
  completed_at?: string;
}

export interface Response {
  id: string;
  session_id: string;
  user_id: string;
  question_number: number;
  question: string;
  question_type?: string;
  user_answer: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
  model_answer?: string;
  star_breakdown?: StarBreakdown;
  created_at: string;
}

export interface StarBreakdown {
  situation: number; // 0-3
  task: number;
  action: number;
  result: number;
}

export interface FeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  model_answer: string;
  star_breakdown?: StarBreakdown | null;
}

export interface GeneratedQuestion {
  question: string;
  question_type: string;
  tip: string;
}
