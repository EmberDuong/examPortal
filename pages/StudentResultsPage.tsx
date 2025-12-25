
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';
import { API_BASE } from '../config/api';

interface StudentResultsPageProps {
    user: User;
    onLogout: () => void;
}

interface ExamResult {
    _id: string;
    exam: {
        _id: string;
        title: string;
        code: string;
        totalMarks: number;
        passScore: number;
    };
    score: number;
    timeTaken: number;
    autoSubmitted: boolean;
    violationsCount: number;
    submittedAt: string;
}

const StudentResultsPage: React.FC<StudentResultsPageProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem('token');

    const fetchResults = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/results/my`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setResults(data);
        } catch (err: any) {
            console.error('Error fetching results:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getResultStatus = (score: number, totalMarks: number, passScore: number) => {
        const percentage = (score / totalMarks) * 100;
        return percentage >= passScore;
    };

    // Calculate stats
    const totalExams = results.length;
    const passedExams = results.filter(r => getResultStatus(r.score, r.exam.totalMarks, r.exam.passScore)).length;
    const avgScore = totalExams > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.score / r.exam.totalMarks * 100), 0) / totalExams)
        : 0;

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
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" to="/dashboard">{t('myExams')}</Link>
                        <Link className="text-primary font-semibold text-sm border-b-2 border-primary pb-0.5" to="/results">{t('results')}</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" to="/profile">{t('profile')}</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
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
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('myResults')}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('viewYourExamHistory')}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">assignment</span>
                            </div>
                            <span className="text-sm font-medium text-slate-500">{t('totalExamsTaken')}</span>
                        </div>
                        <p className="text-3xl font-bold">{totalExams}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                            </div>
                            <span className="text-sm font-medium text-slate-500">{t('examsPassed')}</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{passedExams} / {totalExams}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <span className="material-symbols-outlined text-blue-600">analytics</span>
                            </div>
                            <span className="text-sm font-medium text-slate-500">{t('averageScore')}</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{avgScore}%</p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        <p className="mt-2 text-slate-500">{t('loading')}</p>
                    </div>
                )}

                {/* Results List */}
                {!loading && results.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('exam')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('score')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('timeTaken')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('submitted')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {results.map((result) => {
                                        const isPassed = getResultStatus(result.score, result.exam.totalMarks, result.exam.passScore);
                                        const percentage = Math.round((result.score / result.exam.totalMarks) * 100);

                                        return (
                                            <tr key={result._id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-primary">description</span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium">{result.exam.title}</div>
                                                            <div className="text-xs text-slate-500">{result.exam.code}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold">{result.score}</span>
                                                        <span className="text-slate-500 text-sm">/ {result.exam.totalMarks}</span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${percentage >= 80 ? 'bg-green-100 text-green-700' :
                                                            percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                                                percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                            }`}>{percentage}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        <span className="material-symbols-outlined text-sm">{isPassed ? 'check_circle' : 'cancel'}</span>
                                                        {isPassed ? t('passed') : t('failed')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTime(result.timeTaken)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {new Date(result.submittedAt).toLocaleDateString()} {new Date(result.submittedAt).toLocaleTimeString()}
                                                    {result.autoSubmitted && (
                                                        <span className="ml-2 text-orange-600 text-xs">({t('autoSubmitted')})</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!loading && results.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">assignment</span>
                        <p className="text-slate-500 font-medium">{t('noResults')}</p>
                        <p className="text-slate-400 text-sm mt-1">{t('noResultsDesc')}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-4 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                        >
                            {t('takeFirstExam')}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentResultsPage;
