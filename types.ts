
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum ExamStatus {
  ONGOING = 'ONGOING',
  SCHEDULED = 'SCHEDULED',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  DRAFT = 'DRAFT'
}

export enum CandidateStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  DISABLED = 'Disabled'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  username?: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  options: Option[];
  correctOptionId: string;
  marks: number;
  explanation?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface Exam {
  id: string;
  title: string;
  department: string;
  status: ExamStatus;
  durationMins: number;
  startDate: string;
  endDate?: string;
  questions: Question[];
  totalMarks: number;
  passScore: number;
  thumbnailUrl: string;
  code: string;
  instructor?: string;
  description?: string;
  rules?: string[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>; // questionId -> optionId
  startTime: string;
  endTime?: string;
  score?: number;
  status?: 'in-progress' | 'submitted' | 'auto-submitted';
  violationsCount?: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  idCard: string;
  status: CandidateStatus | string;
  avatar?: string;
  username?: string;
}

export interface ExamSession {
  examId: string;
  candidateId: string;
  startTime: Date;
  answers: Record<string, string>;
  flaggedQuestions: string[];
  currentQuestionIndex: number;
  violationsCount: number;
  isSubmitted: boolean;
}
