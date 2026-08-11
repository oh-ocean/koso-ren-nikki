export interface Condition {
  wave: string;
  wind: string;
  board: string;
}

export interface TaskDraft {
  id: string;
  title: string;
  description: string;
  color?: string;
}

export interface TaskResult {
  id: string;
  name: string;
  score: number;
  memo?: string;
}

export interface SessionDraft {
  date: string; // YYYY-MM-DD
  location: string;
  condition: Condition;
  tasks: TaskDraft[];
}

export interface SessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  location: string;
  condition: Condition;
  tasks: TaskResult[];
  overallScore: number;
  memo: string;
}

export type NewSessionInput = Omit<SessionRecord, 'id' | 'date'> & {
  date?: string;
};

export interface Goal {
  id: string;
  title: string;
  isPinned: boolean;
  isAchieved: boolean;
  createdAt: string; // YYYY-MM-DD
}
