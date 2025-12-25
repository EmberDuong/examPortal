
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage } from '../i18n';

// API Base URL
const API_BASE = '/api';

interface ExamDetailPageProps {
  user: User;
  onLogout: () => void;
}

interface Question {
  _id: string;
  text: string;
  marks: number;
}

interface Exam {
  _id: string;
  title: string;
  code: string;
  department: string;
  instructor?: string;
  durationMins: number;
  startDate?: string;
  status: string;
  passScore: number;
  totalMarks: number;
  thumbnailUrl?: string;
  questions: Question[];
}

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ user, onLogout }) => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState<{ score: number; submittedAt: string; attemptId: string } | null>(null);

  const getToken = () => localStorage.getItem('token');

  // Fetch exam from API
  const fetchExam = useCallback(async () => {
    if (!examId) return;
    try {
      setLoading(true);

      // Fetch exam details
      const examRes = await fetch(`${API_BASE}/exams/${examId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const examData = await examRes.json();
      if (!examRes.ok) throw new Error(examData.message);
      setExam(examData);

      // Check if already submitted
      const checkRes = await fetch(`${API_BASE}/results/check/${examId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const checkData = await checkRes.json();
      if (checkRes.ok && checkData.hasSubmitted) {
        setAlreadySubmitted(true);
        setSubmissionInfo({
          score: checkData.score,
          submittedAt: checkData.submittedAt,
          attemptId: checkData.attemptId
        });
      }
    } catch (err: any) {
      console.error('Error fetching exam:', err);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">error</span>
        <p className="text-slate-500 font-medium">{t('examNotFound')}</p>
        <Link to="/dashboard" className="mt-4 text-primary hover:underline">{t('backToDashboard')}</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 lg:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">ExamPortal</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary" to="/dashboard">{t('dashboard')}</Link>
            <Link className="text-primary text-sm font-bold" to="/dashboard">{t('myExams')}</Link>
            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary" to="/results">{t('results')}</Link>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{user.name}</p>
              <p className="text-[10px] text-slate-500">Student ID: {user.id.slice(0, 5)}</p>
            </div>
            <div
              onClick={onLogout}
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-slate-700 shadow-sm cursor-pointer"
              style={{ backgroundImage: `url(${user.avatar})` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 pb-32">
        <div className="flex flex-wrap gap-2 py-4 mb-2 items-center">
          <Link className="text-slate-500 hover:text-primary text-sm font-medium flex items-center gap-1" to="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span> {t('dashboard')}
          </Link>
          <span className="text-slate-400 text-sm">/</span>
          <Link className="text-slate-500 hover:text-primary text-sm font-medium" to="/dashboard">{t('myExams')}</Link>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-slate-900 dark:text-white text-sm font-medium">{exam.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${exam.status === 'ONGOING' ? 'bg-green-100 text-green-700 border-green-200' :
                        exam.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                        {exam.status === 'ONGOING' ? t('openForAttempt') : exam.status}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">CODE: {exam.code}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{exam.title}</h1>
                    <p className="text-slate-500 text-base md:text-lg mt-2">{exam.department} • {exam.instructor || 'Instructor'}</p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="size-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-4xl">science</span>
                    </div>
                  </div>
                </div>
                <hr className="border-slate-100 dark:border-slate-700 my-2" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-transparent transition-all">
                    <div className="text-primary mb-1"><span className="material-symbols-outlined">timer</span></div>
                    <span className="text-xs text-slate-500 font-medium">{t('duration')}</span>
                    <span className="text-base font-bold">{exam.durationMins} {t('minutes')}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-transparent transition-all">
                    <div className="text-primary mb-1"><span className="material-symbols-outlined">quiz</span></div>
                    <span className="text-xs text-slate-500 font-medium">{t('questions')}</span>
                    <span className="text-base font-bold">{exam.questions?.length || 0} {t('questions')}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-transparent transition-all">
                    <div className="text-primary mb-1"><span className="material-symbols-outlined">stars</span></div>
                    <span className="text-xs text-slate-500 font-medium">{t('totalMarks')}</span>
                    <span className="text-base font-bold">{exam.totalMarks} {t('points')}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-transparent transition-all">
                    <div className="text-primary mb-1"><span className="material-symbols-outlined">check_circle</span></div>
                    <span className="text-xs text-slate-500 font-medium">{t('passScore')}</span>
                    <span className="text-base font-bold">{exam.passScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                {t('instructionsAndRules')}
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                  <span>{t('instruction1')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                  <span>{t('instruction2')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                  <span>{t('instruction3')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 size-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
                  <span>{t('instruction4')}</span>
                </li>
              </ul>
              <div className="mt-8 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 flex gap-4 items-start">
                <span className="material-symbols-outlined text-orange-600 shrink-0">warning</span>
                <div>
                  <h4 className="text-orange-900 dark:text-orange-300 font-bold text-sm mb-1">{t('disqualificationWarning')}</h4>
                  <p className="text-orange-800 dark:text-orange-400 text-sm leading-relaxed">
                    {t('disqualificationDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="text-lg font-bold mb-4">{t('schedule')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{t('date')}</p>
                    <p className="font-medium">{exam.startDate ? new Date(exam.startDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{t('examWindow')}</p>
                    <p className="font-medium">{exam.startDate ? new Date(exam.startDate).toLocaleTimeString() : 'Anytime'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{t('systemCheck')}</h3>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">{t('passed')}</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">videocam</span>
                    <span className="text-sm font-medium">{t('webcam')}</span>
                  </div>
                  <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">mic</span>
                    <span className="text-sm font-medium">{t('microphone')}</span>
                  </div>
                  <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">wifi</span>
                    <span className="text-sm font-medium">{t('internetSpeed')}</span>
                  </div>
                  <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                </div>
              </div>
              <button className="mt-4 w-full text-xs font-medium text-primary hover:text-blue-700 border border-primary/20 rounded py-2 transition-colors">
                {t('runCheckAgain')}
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
          <div className="max-w-[1200px] mx-auto bg-white dark:bg-slate-800 border border-primary/20 rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {alreadySubmitted ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                    <span className="material-symbols-outlined text-2xl text-green-600">check_circle</span>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">{t('examCompleted')}</p>
                    <p className="text-sm text-slate-500">
                      {t('score')}: <strong>{submissionInfo?.score || 0}/{exam.totalMarks}</strong> •
                      {submissionInfo?.submittedAt && ` ${new Date(submissionInfo.submittedAt).toLocaleString()}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/results')}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-base font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">visibility</span>
                  {t('viewResults')}
                </button>
              </>
            ) : (
              <>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer size-5 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 checked:bg-primary checked:border-primary transition-all"
                      type="checkbox"
                    />
                    <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 select-none">
                    {t('agreeTerms')} <a className="text-primary hover:underline" href="#">{t('termsOfService')}</a>.
                  </span>
                </label>
                <button
                  disabled={!agreed || exam.status !== 'ONGOING'}
                  onClick={() => navigate(`/exam/${exam._id}/start`)}
                  className="w-full md:w-auto bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-primary-hover text-white text-base font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  {t('startExam')}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamDetailPage;
