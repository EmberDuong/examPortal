import { User, UserRole, Question, Exam, ExamStatus, ExamAttempt } from './types';

// ========================================
// LOGIN CREDENTIALS
// ========================================
export const LOGIN_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 's@uRiengRoiVoDau123'
  }
};

// ========================================
// MOCK ADMIN USER
// ========================================
export const MOCK_ADMIN: User = {
  id: 'admin-001',
  name: 'Administrator',
  email: 'admin@examportal.vn',
  role: UserRole.ADMIN,
  avatar: 'https://i.pravatar.cc/150?u=admin'
};

// ========================================
// EMPTY MOCK DATA (for initial state)
// ========================================
export const MOCK_STUDENTS: User[] = [];

export const MOCK_CANDIDATES = MOCK_STUDENTS.map(s => ({
  id: s.id,
  name: s.name,
  email: s.email,
  phone: '',
  idCard: `#CAND-2024-${s.id.slice(-3).toUpperCase()}`,
  status: 'Active',
  avatar: s.avatar
}));

// ========================================
// EMPTY QUESTIONS BANK
// ========================================
export const MOCK_QUESTIONS: Question[] = [];

// ========================================
// EMPTY EXAMS
// ========================================
export const MOCK_EXAMS: Exam[] = [];

// ========================================
// EMPTY EXAM ATTEMPTS
// ========================================
export const MOCK_EXAM_ATTEMPTS: ExamAttempt[] = [];
