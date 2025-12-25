// API Service for ExamPortal
import { API_BASE } from './config/api';
const API_BASE_URL = API_BASE;

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Save token to localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove token
export const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Save user to localStorage
export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user from localStorage
export const getUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Generic fetch wrapper with auth
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    removeToken();
    window.location.href = '/#/login';
  }

  return response;
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  verifyPhone: async (phone: string, code: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  resendCode: async (phone: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getMe: async () => {
    const res = await fetchWithAuth('/auth/me');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Users API (Admin)
export const usersAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/users');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id: string) => {
    const res = await fetchWithAuth(`/users/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  create: async (userData: {
    username: string;
    email: string;
    password?: string;
    name: string;
    phone: string;
    status?: string;
  }) => {
    const res = await fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  update: async (id: string, userData: Partial<{
    name: string;
    email: string;
    phone: string;
    status: string;
  }>) => {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id: string) => {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  resetPassword: async (id: string, password?: string) => {
    const res = await fetchWithAuth(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Questions API (Admin)
export const questionsAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/questions');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id: string) => {
    const res = await fetchWithAuth(`/questions/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  create: async (questionData: {
    text: string;
    description?: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    marks: number;
    explanation?: string;
  }) => {
    const res = await fetchWithAuth('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  update: async (id: string, questionData: Partial<{
    text: string;
    description: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    marks: number;
    explanation: string;
  }>) => {
    const res = await fetchWithAuth(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id: string) => {
    const res = await fetchWithAuth(`/questions/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Exams API
export const examsAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/exams');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id: string) => {
    const res = await fetchWithAuth(`/exams/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  create: async (examData: {
    title: string;
    code: string;
    department: string;
    instructor?: string;
    durationMins: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    passScore?: number;
    questions: string[];
    thumbnailUrl?: string;
  }) => {
    const res = await fetchWithAuth('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  update: async (id: string, examData: Partial<{
    title: string;
    code: string;
    department: string;
    instructor: string;
    durationMins: number;
    startDate: string;
    endDate: string;
    status: string;
    passScore: number;
    questions: string[];
    thumbnailUrl: string;
  }>) => {
    const res = await fetchWithAuth(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id: string) => {
    const res = await fetchWithAuth(`/exams/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  start: async (id: string) => {
    const res = await fetchWithAuth(`/exams/${id}/start`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  submit: async (id: string, submitData: {
    answers: Record<string, string>;
    autoSubmitted?: boolean;
    violationsCount?: number;
  }) => {
    const res = await fetchWithAuth(`/exams/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(submitData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  saveAnswer: async (id: string, questionId: string, answerId: string) => {
    const res = await fetchWithAuth(`/exams/${id}/save-answer`, {
      method: 'PUT',
      body: JSON.stringify({ questionId, answerId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Results API
export const resultsAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/results');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getMy: async () => {
    const res = await fetchWithAuth('/results/my');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id: string) => {
    const res = await fetchWithAuth(`/results/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getByExam: async (examId: string) => {
    const res = await fetchWithAuth(`/results/exam/${examId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getStats: async () => {
    const res = await fetchWithAuth('/results/stats/overview');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
