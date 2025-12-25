
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_QUESTIONS } from '../constants';
import { useLanguage, LanguageSwitcher } from '../i18n';

interface ResultPageProps {
  user: User;
  onLogout: () => void;
}

interface ExamResult {
  examId: string;
  examTitle: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  totalMarks: number;
  questionsCount: number;
  correctCount: number;
  timeTaken: number;
  autoSubmitted: boolean;
  violationsCount: number;
  submittedAt: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('lastExamResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get questions that were in the exam
  const getQuestionDetails = (questionId: string) => {
    return MOCK_QUESTIONS.find(q => q.id === questionId);
  };

  // Default result if none found
  const displayResult = result || {
    examId: 'demo',
    examTitle: 'Demo Exam Result',
    studentId: user.id,
    answers: {},
    score: 0,
    totalMarks: 100,
    questionsCount: 0,
    correctCount: 0,
    timeTaken: 0,
    autoSubmitted: false,
    violationsCount: 0,
    submittedAt: new Date().toISOString()
  };

  const isPassed = displayResult.score >= (displayResult.totalMarks * 0.6);
  const accuracyPercent = displayResult.questionsCount > 0
    ? Math.round((displayResult.correctCount / displayResult.questionsCount) * 100)
    : 0;
  const wrongCount = displayResult.questionsCount - displayResult.correctCount;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 lg:px-10 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary"><span className="material-symbols-outlined text-[32px]">school</span></div>
          <h2 className="text-lg font-bold tracking-tight">{t('appName')}</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
          <LanguageSwitcher />
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold">{user.name}</span>
              <span className="text-xs text-slate-500">ID: {user.id.slice(0, 10)}</span>
            </div>
            <div
              onClick={onLogout}
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white dark:border-slate-800 shadow-sm cursor-pointer"
              style={{ backgroundImage: `url(${user.avatar})` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="flex h-full grow flex-col px-4 sm:px-8 lg:px-40 py-8">
        <div className="flex flex-col max-w-[1200px] mx-auto w-full gap-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{displayResult.examTitle} - {t('resultsTitle')}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-sm md:text-base">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">calendar_today</span> {new Date(displayResult.submittedAt).toLocaleDateString()}</span>
                <span className="hidden md:inline">|</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">schedule</span> {t('submittedAt')} {new Date(displayResult.submittedAt).toLocaleTimeString()}</span>
                {displayResult.autoSubmitted && (
                  <>
                    <span className="hidden md:inline">|</span>
                    <span className="flex items-center gap-1 text-orange-600"><span className="material-symbols-outlined text-lg">warning</span> {t('autoSubmitted')}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span> {t('backToDashboard')}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined">analytics</span><p className="text-sm font-medium uppercase tracking-wide">{t('totalScore')}</p></div>
              <div className="flex items-baseline gap-2"><p className="text-primary text-4xl font-black">{displayResult.score}</p><p className="text-slate-500 text-lg font-bold">/ {displayResult.totalMarks}</p></div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined">verified</span><p className="text-sm font-medium uppercase tracking-wide">{t('status')}</p></div>
              <p className={`text-3xl font-bold tracking-tight ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{isPassed ? t('passed') : t('failed')}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined">timer</span><p className="text-sm font-medium uppercase tracking-wide">{t('timeTaken')}</p></div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">{formatTime(displayResult.timeTaken)}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500"><span className="material-symbols-outlined">pie_chart</span><p className="text-sm font-medium uppercase tracking-wide">{t('accuracy')}</p></div>
              <div className="flex w-full h-4 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-green-500" style={{ width: `${accuracyPercent}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold mt-1">
                <span className="text-green-600">{displayResult.correctCount} {t('correct')}</span>
                <span className="text-red-600">{wrongCount} {t('wrong')}</span>
              </div>
            </div>
          </div>

          {/* Violations Warning */}
          {displayResult.violationsCount > 0 && (
            <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <span className="material-symbols-outlined text-yellow-600">warning</span>
              </div>
              <div>
                <p className="font-bold text-yellow-800 dark:text-yellow-200">{t('examIntegrityNotice')}</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{t('violationsReceived').replace('warning(s)', displayResult.violationsCount.toString() + ' ' + t('warnings').toLowerCase())}</p>
              </div>
            </div>
          )}

          {/* Questions Breakdown */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold">{t('questionReview')}</h2>
            {Object.keys(displayResult.answers).length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">quiz</span>
                <p className="text-slate-500">{t('noData')}</p>
              </div>
            ) : (
              Object.entries(displayResult.answers).map(([questionId, answerId], idx) => {
                const question = getQuestionDetails(questionId);
                if (!question) return null;

                const isCorrect = answerId === question.correctOptionId;
                const selectedOption = question.options.find(o => o.id === answerId);
                const correctOption = question.options.find(o => o.id === question.correctOptionId);

                return (
                  <div key={questionId} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-6 flex gap-4 items-start">
                      <span className={`flex-shrink-0 flex items-center justify-center size-8 rounded-full font-bold text-sm ${isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{idx + 1}</span>
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-bold leading-snug">{question.text}</h3>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset whitespace-nowrap ${isCorrect
                              ? 'bg-green-50 text-green-700 ring-green-600/20'
                              : 'bg-red-50 text-red-700 ring-red-600/20'
                            }`}>
                            <span className="material-symbols-outlined text-sm">{isCorrect ? 'check_circle' : 'cancel'}</span> {isCorrect ? t('correct') : t('wrong')}
                          </span>
                        </div>
                        <div className={`border rounded-lg p-4 ${isCorrect ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'}`}>
                          <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>{t('yourAnswer')}</p>
                          <p className="text-slate-900 dark:text-white font-medium">{selectedOption?.text || t('noData')}</p>
                        </div>
                        {!isCorrect && (
                          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg p-4">
                            <p className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wide mb-1">{t('correctAnswer')}</p>
                            <p className="text-slate-900 dark:text-white font-medium">{correctOption?.text}</p>
                          </div>
                        )}
                        {question.explanation && (
                          <div className="mt-2 bg-primary/5 rounded-lg p-4 border border-primary/10">
                            <p className="text-sm"><span className="font-bold text-primary mr-1">{t('explanation')}:</span> {question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                      <span className="text-xs font-medium text-slate-500">{t('score')}: {isCorrect ? question.marks : 0}/{question.marks}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 py-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors"
            >
              <span className="material-symbols-outlined">home</span> {t('returnToDashboard')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
