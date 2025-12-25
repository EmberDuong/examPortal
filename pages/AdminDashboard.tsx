
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { MOCK_EXAMS, MOCK_CANDIDATES, MOCK_QUESTIONS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage, LanguageSwitcher } from '../i18n';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const trafficData = [
  { name: 'Week 1', exams: 40 },
  { name: 'Week 2', exams: 30 },
  { name: 'Week 3', exams: 45 },
  { name: 'Week 4', exams: 60 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Dynamic stats from mock data
  const totalCandidates = MOCK_CANDIDATES.length;
  const totalExams = MOCK_EXAMS.length;
  const activeExams = MOCK_EXAMS.filter(e => e.status === 'ONGOING').length;
  const totalQuestions = MOCK_QUESTIONS.length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors hidden lg:flex">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
                <span className="material-symbols-outlined icon-filled text-[28px]">school</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold leading-none tracking-tight">{t('appName')}</h1>
                <p className="text-slate-500 text-xs mt-1">{t('adminPanel')}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-all" to="/admin">
                <span className="material-symbols-outlined icon-filled text-[22px]">dashboard</span>
                <span className="text-sm font-medium">{t('dashboard')}</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" to="/admin/candidates">
                <span className="material-symbols-outlined text-[22px]">group</span>
                <span className="text-sm font-medium">{t('candidates')}</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" to="/admin/questions">
                <span className="material-symbols-outlined text-[22px]">quiz</span>
                <span className="text-sm font-medium">{t('questions')}</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" to="/admin/exams">
                <span className="material-symbols-outlined text-[22px]">description</span>
                <span className="text-sm font-medium">{t('exams')}</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all" to="/admin/results">
                <span className="material-symbols-outlined text-[22px]">analytics</span>
                <span className="text-sm font-medium">{t('results')}</span>
              </Link>
            </nav>
          </div>
          <div className="mt-auto">
            <button
              onClick={() => navigate('/admin/exams')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 px-4 text-white shadow-md hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="text-sm font-bold">{t('createNewExam')}</span>
            </button>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4 px-2">
              <div className="size-10 rounded-full border border-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${user.avatar})` }}></div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">{t('adminPanel')}</p>
              </div>
              <button onClick={onLogout} className="ml-auto text-slate-400 hover:text-slate-600" title={t('signOut')}>
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col h-full overflow-hidden relative">
        <header className="flex h-16 flex-none items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">{t('dashboardOverview')}</h2>
            <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">Live</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden md:flex relative">
              <span className="material-symbols-outlined absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-[20px]">search</span>
              <input className="block w-64 rounded-lg border-0 bg-slate-100 dark:bg-slate-900 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary transition-all" placeholder={t('search') + '...'} type="text" />
            </div>
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-4">
              <button className="flex size-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors relative">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-800"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl flex flex-col gap-6">
            {/* KPI Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/admin/candidates" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{t('totalCandidates')}</p>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-2 text-primary group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">group</span></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{totalCandidates}</span>
                  <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> {t('active')}
                  </span>
                </div>
              </Link>
              <Link to="/admin/exams" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{t('totalExams')}</p>
                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/30 p-2 text-indigo-600 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">description</span></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{totalExams}</span>
                  <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+{activeExams} {t('active').toLowerCase()}</span>
                </div>
              </Link>
              <Link to="/admin/questions" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{t('questionBank')}</p>
                  <div className="rounded-lg bg-purple-50 dark:bg-purple-900/30 p-2 text-purple-600 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">quiz</span></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{totalQuestions}</span>
                  <span className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{t('questions')}</span>
                </div>
              </Link>
              <Link to="/admin/results" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:shadow-md ring-1 ring-primary/20 hover:ring-primary/40 group">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{t('activeNow')}</p>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary animate-pulse"><span className="material-symbols-outlined text-[20px]">vital_signs</span></div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{activeExams}</span>
                  <span className="flex items-center text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">{t('liveExams')}</span>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold">{t('examActivity')}</h3>
                    <p className="text-sm text-slate-500">{t('submissionsOverTime')}</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2b6cee" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#2b6cee" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="exams" stroke="#2b6cee" strokeWidth={2} fillOpacity={1} fill="url(#colorExams)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold">{t('quickActions')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate('/admin/candidates')} className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-primary/5 transition-colors group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person_add</span>
                    <span className="text-xs font-semibold">{t('addCandidate')}</span>
                  </button>
                  <button onClick={() => navigate('/admin/exams')} className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-primary/5 transition-colors group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">post_add</span>
                    <span className="text-xs font-semibold">{t('newExam')}</span>
                  </button>
                  <button onClick={() => navigate('/admin/questions')} className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-primary/5 transition-colors group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">help</span>
                    <span className="text-xs font-semibold">{t('addQuestion')}</span>
                  </button>
                  <button onClick={() => navigate('/admin/results')} className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-primary/5 transition-colors group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">download</span>
                    <span className="text-xs font-semibold">{t('viewResults')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
                <h3 className="text-base font-bold">{t('upcomingActiveExams')}</h3>
                <Link to="/admin/exams" className="text-primary text-xs font-bold hover:underline">{t('viewAll')}</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">{t('examTitle')}</th>
                      <th className="px-6 py-3 font-medium">{t('department')}</th>
                      <th className="px-6 py-3 font-medium">{t('status')}</th>
                      <th className="px-6 py-3 font-medium">{t('startDate')}</th>
                      <th className="px-6 py-3 font-medium text-right">{t('questions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {MOCK_EXAMS.filter(e => e.status !== 'CLOSED').slice(0, 5).map(exam => (
                      <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 font-medium">{exam.title}</td>
                        <td className="px-6 py-4">{exam.department}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${exam.status === 'ONGOING' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {exam.status === 'ONGOING' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>}
                            {exam.status === 'ONGOING' ? t('ongoing') : t('scheduled')}
                          </span>
                        </td>
                        <td className="px-6 py-4">{exam.startDate}</td>
                        <td className="px-6 py-4 text-right">{exam.questions.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
