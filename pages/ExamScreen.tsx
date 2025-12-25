import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { User } from '../types';
import { useLanguage } from '../i18n';
import { API_BASE } from '../config/api';

interface ExamScreenProps {
  user: User;
}

interface Option {
  id: string;
  text: string;
}

interface Question {
  _id: string;
  text: string;
  description?: string;
  options: Option[];
  correctOptionId: string;
  marks: number;
}

interface Exam {
  _id: string;
  title: string;
  code: string;
  department: string;
  durationMins: number;
  totalMarks: number;
  passScore: number;
  status: string;
  questions: Question[];
}

const ExamScreen: React.FC<ExamScreenProps> = ({ user }) => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { t } = useLanguage();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const getToken = () => localStorage.getItem('token');

  // Fetch exam with questions from API
  const fetchExam = useCallback(async () => {
    if (!examId) return;
    try {
      setLoading(true);

      // First check if already submitted
      const checkRes = await fetch(`${API_BASE}/results/check/${examId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const checkData = await checkRes.json();
      if (checkRes.ok && checkData.hasSubmitted) {
        setAlreadySubmitted(true);
        setLoading(false);
        return; // Don't load exam if already submitted
      }

      const res = await fetch(`${API_BASE}/exams/${examId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setExam(data);
      setTimeLeft(data.durationMins * 60);
    } catch (err: any) {
      console.error('Error fetching exam:', err);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  // Timer countdown
  useEffect(() => {
    if (!exam || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam]);

  // Anti-cheat: Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationsCount(prev => prev + 1);
        setShowWarningModal(true);
      }
    };

    const handleBlur = () => {
      if (document.hasFocus() === false) {
        setViolationsCount(prev => prev + 1);
        setShowWarningModal(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimeClass = () => {
    if (timeLeft <= 60) return 'bg-red-600 text-white animate-pulse';
    if (timeLeft <= 300) return 'bg-red-50 text-red-600';
    return 'bg-slate-100 dark:bg-slate-700';
  };

  const handleAnswer = (optionId: string) => {
    if (!exam) return;
    const currentQuestion = exam.questions[currentIndex];
    setAnswers({ ...answers, [currentQuestion._id]: optionId });
  };

  const toggleFlag = () => {
    if (!exam) return;
    const currentQuestion = exam.questions[currentIndex];
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion._id)) {
      newFlagged.delete(currentQuestion._id);
    } else {
      newFlagged.add(currentQuestion._id);
    }
    setFlagged(newFlagged);
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (!exam) return;
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getQuestionStatus = (questionId: string) => {
    if (!exam) return 'unanswered';
    const currentQuestion = exam.questions[currentIndex];
    if (questionId === currentQuestion._id) return 'current';
    if (answers[questionId]) return 'answered';
    if (flagged.has(questionId)) return 'flagged';
    return 'unanswered';
  };

  const submitExam = useCallback(async (autoSubmit: boolean = false) => {
    if (!exam || submitting) return;

    setSubmitting(true);

    // Calculate score
    let score = 0;
    exam.questions.forEach(q => {
      if (answers[q._id] === q.correctOptionId) {
        score += q.marks;
      }
    });

    const result = {
      exam: exam._id,
      student: user.id,
      answers,
      score,
      totalMarks: exam.totalMarks,
      timeTaken: exam.durationMins * 60 - timeLeft,
      autoSubmitted: autoSubmit,
      violationsCount,
      startedAt: new Date(Date.now() - (exam.durationMins * 60 - timeLeft) * 1000).toISOString(),
      submittedAt: new Date().toISOString()
    };

    try {
      // Try to submit to API
      const res = await fetch(`${API_BASE}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(result)
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Error submitting result:', data.message);
      }
    } catch (err) {
      console.error('Error submitting result:', err);
    }

    // Save result to localStorage for results page
    const localResult = {
      ...result,
      examTitle: exam.title,
      questionsCount: exam.questions.length,
      correctCount: exam.questions.filter(q => answers[q._id] === q.correctOptionId).length
    };

    localStorage.setItem('lastExamResult', JSON.stringify(localResult));
    navigate('/results');
  }, [answers, exam, timeLeft, violationsCount, navigate, user.id, submitting]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  // Already submitted - redirect
  if (alreadySubmitted) {
    return <Navigate to="/dashboard" />;
  }

  // Exam not found
  if (!exam) {
    return <Navigate to="/dashboard" />;
  }

  const questions = exam.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  if (!currentQuestion) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary">
              <span className="material-symbols-outlined">school</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <h1 className="font-bold text-lg">{exam.title}</h1>
              <p className="text-xs text-slate-500">{exam.department} • {exam.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {violationsCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg text-xs font-medium">
                <span className="material-symbols-outlined text-sm">warning</span>
                {violationsCount} {t('warnings')}
              </div>
            )}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold ${getTimeClass()}`}>
              <span className="material-symbols-outlined text-lg">timer</span>
              <span className="text-lg">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={() => setShowExitModal(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span> {t('exitExam')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-8">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold">{currentIndex + 1}</span>
                  <div>
                    <p className="text-sm text-slate-500">{t('question')} {currentIndex + 1} {t('of')} {questions.length}</p>
                    <p className="text-xs text-slate-400">{currentQuestion.marks} {t('points')}</p>
                  </div>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${flagged.has(currentQuestion._id)
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-slate-500 hover:bg-slate-100'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">{flagged.has(currentQuestion._id) ? 'flag' : 'outlined_flag'}</span>
                  {t('flagForReview')}
                </button>
              </div>

              <h2 className="text-xl font-bold mb-6 leading-relaxed">{currentQuestion.text}</h2>

              {currentQuestion.description && (
                <p className="text-slate-600 dark:text-slate-400 mb-6">{currentQuestion.description}</p>
              )}

              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${answers[currentQuestion._id] === opt.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    <span className={`flex items-center justify-center size-8 rounded-full border-2 font-bold text-sm transition-all ${answers[currentQuestion._id] === opt.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-300 text-slate-500'
                      }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="font-medium">{opt.text}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500">
                  {answers[currentQuestion._id]
                    ? <span className="text-green-600 flex items-center gap-1"><span className="material-symbols-outlined text-lg">check_circle</span> {t('answerSaved')}</span>
                    : t('waitingInput')
                  }
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span> {t('previous')}
              </button>
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <span className="material-symbols-outlined">task_alt</span> {t('finishExam')}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary-hover transition-colors"
                >
                  {t('nextQuestion')} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette (Sidebar) */}
        <aside className="hidden lg:flex w-80 flex-col border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 overflow-y-auto">
          <h3 className="font-bold mb-4">{t('questionPalette')}</h3>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((q, idx) => {
              const status = getQuestionStatus(q._id);
              return (
                <button
                  key={q._id}
                  onClick={() => goToQuestion(idx)}
                  className={`size-10 rounded-lg font-bold text-sm transition-all ${status === 'current' ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' :
                    status === 'answered' ? 'bg-green-500 text-white' :
                      status === 'flagged' ? 'bg-orange-400 text-white' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-green-500"></span> {t('answered')} ({answeredCount})</div>
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-slate-200 dark:bg-slate-700"></span> {t('unanswered')} ({questions.length - answeredCount})</div>
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-primary"></span> {t('current')}</div>
            <div className="flex items-center gap-2"><span className="size-4 rounded bg-orange-400"></span> {t('flagged')} ({flagged.size})</div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <span className="material-symbols-outlined">send</span> {t('submit')}
            </button>
          </div>
        </aside>
      </main>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)}></div>
          <div className="relative z-10 w-full max-w-md transform rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                <span className="material-symbols-outlined text-3xl text-green-600">task_alt</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{t('submitAssessment')}</h2>
              <p className="text-slate-500 mb-6">{t('submitDescription')}</p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 w-full mb-6 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t('answered')}:</span>
                  <span className="font-medium">{answeredCount} / {questions.length}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t('unanswered')}:</span>
                  <span className="font-medium text-orange-600">{questions.length - answeredCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('timeRemaining')}:</span>
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="flex w-full gap-3">
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">{t('cancel')}</button>
                <button
                  onClick={() => submitExam(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {submitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                  {t('confirmSubmit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Warning Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowExitModal(false)}></div>
          <div className="relative z-10 w-full max-w-md transform rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <span className="material-symbols-outlined text-3xl text-red-600">warning</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{t('exitExamTitle')}</h2>
              <p className="text-slate-500 mb-6">{t('exitWarning')}</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setShowExitModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">{t('continueExam')}</button>
                <button onClick={() => submitExam(false)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">{t('exitAndSubmit')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full max-w-md transform rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border-2 border-orange-400">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20 animate-pulse">
                <span className="material-symbols-outlined text-5xl text-orange-600">visibility_off</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-orange-600">{t('tabSwitchDetected')}</h2>
              <p className="text-slate-500 mb-4">{t('tabSwitchWarning')}</p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 w-full mb-6 flex items-center justify-center gap-2">
                <span className="text-orange-600 font-bold">{t('totalWarnings')}: {violationsCount}</span>
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors"
              >
                {t('understandContinue')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamScreen;
