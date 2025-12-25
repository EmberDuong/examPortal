
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';

// API Base URL
const API_BASE = '/api';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
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
  questions: any[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');

  const getToken = () => localStorage.getItem('token');

  // Fetch exams from API
  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/exams`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Only show exams that are SCHEDULED or ONGOING for students
      const availableExams = data.filter((e: Exam) => e.status === 'SCHEDULED' || e.status === 'ONGOING' || e.status === 'CLOSED');
      setExams(availableExams);
    } catch (err: any) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const filteredExams = exams.filter(exam => {
    const matchesFilter = filter === 'all' || exam.status === filter;
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.department.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ONGOING': return t('ongoing');
      case 'SCHEDULED': return t('upcoming');
      case 'CLOSED': return t('completed');
      default: return status;
    }
  };

  const pendingCount = exams.filter(e => e.status !== 'CLOSED').length;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="px-6 md:px-10 lg:px-20 py-3 flex items-center justify-between mx-auto max-w-[1400px]">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{t('appName')}</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-primary font-semibold text-sm leading-normal border-b-2 border-primary pb-0.5" to="/dashboard">{t('myExams')}</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium leading-normal transition-colors" to="/results">{t('results')}</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium leading-normal transition-colors" to="/profile">{t('profile')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500"></span>
            </button>
            <div
              onClick={onLogout}
              className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer"
              style={{ backgroundImage: `url(${user.avatar})` }}
              title={t('signOut')}
            ></div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('myExams')}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
              {t('welcomeBack')}, {user.name.split(' ')[0]}. {pendingCount} {t('pendingExams')}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              {t('calendarView')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-full lg:max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t('searchExams')}
              type="text"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`flex whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              {t('allExams')}
            </button>
            <button
              onClick={() => setFilter('SCHEDULED')}
              className={`flex whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'SCHEDULED' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              {t('upcoming')}
            </button>
            <button
              onClick={() => setFilter('ONGOING')}
              className={`flex whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'ONGOING' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              {t('ongoing')}
            </button>
            <button
              onClick={() => setFilter('CLOSED')}
              className={`flex whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'CLOSED' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              {t('completed')}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="mt-2 text-slate-500">{t('loading')}</p>
          </div>
        )}

        {/* Exam Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <article key={exam._id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${exam.status === 'ONGOING' ? 'bg-green-100 text-green-700 border-green-200' :
                      exam.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                      {exam.status === 'ONGOING' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>}
                      {getStatusLabel(exam.status)}
                    </span>
                  </div>
                  <div className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${exam.thumbnailUrl || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400'})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white/90 text-xs font-medium uppercase tracking-wider">{exam.department}</p>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 line-clamp-1">{exam.title}</h3>
                  <div className="flex flex-col gap-3 mt-1 mb-6">
                    <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                      <span className="material-symbols-outlined text-lg mr-2">schedule</span>
                      <span>{t('duration')}: <strong className="text-slate-900 dark:text-white">{exam.durationMins} {t('minutes')}</strong></span>
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                      <span className="material-symbols-outlined text-lg mr-2">quiz</span>
                      <span>{t('questions')}: <strong className="text-slate-900 dark:text-white">{exam.questions?.length || 0}</strong></span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                    {exam.status === 'ONGOING' ? (
                      <>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500">{t('progress')}</span>
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/exam/${exam._id}`)}
                          className="flex-1 bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{t('startExam')}</span>
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                      </>
                    ) : exam.status === 'SCHEDULED' ? (
                      <>
                        <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium px-3 py-2">
                          {t('viewSyllabus')}
                        </button>
                        <button
                          onClick={() => navigate(`/exam/${exam._id}`)}
                          className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                        >
                          {t('viewDetails')}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate('/results')}
                        className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        {t('viewResult')}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredExams.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">description</span>
            <p className="text-slate-500 font-medium">{t('noExamsFound')}</p>
            <p className="text-slate-400 text-sm mt-1">{t('adjustSearchExam')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
