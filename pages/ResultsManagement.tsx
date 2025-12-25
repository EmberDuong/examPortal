
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';

// API Base URL
const API_BASE = '/api';

interface ResultsManagementProps {
    user: User;
    onLogout: () => void;
}

interface ExamResult {
    _id: string;
    student: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    exam: {
        _id: string;
        title: string;
        totalMarks: number;
        passScore: number;
    };
    score: number;
    timeTaken: number;
    submittedAt: string;
    startedAt: string;
    autoSubmitted: boolean;
    violationsCount: number;
    answers: Record<string, string>;
}

interface Exam {
    _id: string;
    title: string;
}

const ResultsManagement: React.FC<ResultsManagementProps> = ({ user, onLogout }) => {
    const { t } = useLanguage();
    const [results, setResults] = useState<ExamResult[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterExam, setFilterExam] = useState('all');
    const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

    const getToken = () => localStorage.getItem('token');

    // Fetch results from API
    const fetchResults = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/results`, {
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
    };

    // Fetch exams for filter
    const fetchExams = async () => {
        try {
            const res = await fetch(`${API_BASE}/exams`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setExams(data);
        } catch (err: any) {
            console.error('Error fetching exams:', err);
        }
    };

    useEffect(() => {
        fetchResults();
        fetchExams();
    }, []);

    const filteredResults = results.filter(r => {
        const matchesSearch = r.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
            r.student?.email?.toLowerCase().includes(search.toLowerCase());
        const matchesExam = filterExam === 'all' || r.exam?._id === filterExam;
        return matchesSearch && matchesExam;
    });

    const totalSubmissions = results.length;
    const passedCount = results.filter(r => {
        return r.exam && r.score >= (r.exam.totalMarks * r.exam.passScore / 100);
    }).length;
    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0;

    const selectedResult = results.find(r => r._id === showDetailModal);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-colors hidden lg:flex">
                <div className="p-6">
                    <div className="flex gap-3 items-center">
                        <div className="bg-primary/10 flex items-center justify-center rounded-lg size-10 text-primary">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold">{t('adminPanel')}</h1>
                            <p className="text-xs text-slate-500 mt-1">{t('examSystem')}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin">
                        <span className="material-symbols-outlined text-slate-400">dashboard</span>
                        <span className="text-sm font-medium">{t('dashboard')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin/candidates">
                        <span className="material-symbols-outlined text-slate-400">group</span>
                        <span className="text-sm font-medium">{t('candidates')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin/questions">
                        <span className="material-symbols-outlined text-slate-400">quiz</span>
                        <span className="text-sm font-medium">{t('questions')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin/exams">
                        <span className="material-symbols-outlined text-slate-400">description</span>
                        <span className="text-sm font-medium">{t('exams')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary" to="/admin/results">
                        <span className="material-symbols-outlined icon-filled">analytics</span>
                        <span className="text-sm font-medium">{t('results')}</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <span className="material-symbols-outlined text-slate-400">logout</span>
                        <span className="text-sm font-medium">{t('signOut')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="flex-shrink-0 px-8 py-6">
                    <div className="max-w-7xl mx-auto w-full flex justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-bold tracking-tight">{t('resultsManagement')}</h2>
                            <p className="text-slate-500">{t('resultsDescription')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                                <span className="material-symbols-outlined text-[20px]">download</span> {t('exportCSV')}
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                                <div className="flex items-center gap-3 text-slate-500 mb-2">
                                    <span className="material-symbols-outlined">assignment</span>
                                    <span className="text-sm font-medium">{t('totalSubmissions')}</span>
                                </div>
                                <p className="text-3xl font-bold">{totalSubmissions}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                                <div className="flex items-center gap-3 text-slate-500 mb-2">
                                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                                    <span className="text-sm font-medium">{t('passedCount')}</span>
                                </div>
                                <p className="text-3xl font-bold text-green-600">{passedCount} <span className="text-base text-slate-400">/ {totalSubmissions}</span></p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                                <div className="flex items-center gap-3 text-slate-500 mb-2">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    <span className="text-sm font-medium">{t('avgScore')}</span>
                                </div>
                                <p className="text-3xl font-bold text-primary">{avgScore}</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="w-full md:max-w-md relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><span className="material-symbols-outlined">search</span></span>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 dark:bg-slate-900 text-sm"
                                    placeholder={t('searchStudents')}
                                    type="text"
                                />
                            </div>
                            <select
                                value={filterExam}
                                onChange={(e) => setFilterExam(e.target.value)}
                                className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-medium border-none"
                            >
                                <option value="all">{t('allExamsFilter')}</option>
                                {exams.map(exam => (
                                    <option key={exam._id} value={exam._id}>{exam.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                                <p className="mt-2 text-slate-500">{t('loading')}</p>
                            </div>
                        )}

                        {/* Results Table */}
                        {!loading && filteredResults.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('candidate')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('exam')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('score')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('submitted')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {filteredResults.map((result) => {
                                                const isPassed = result.exam && result.score >= (result.exam.totalMarks * result.exam.passScore / 100);

                                                return (
                                                    <tr key={result._id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <img className="size-8 rounded-full object-cover border border-slate-200" src={result.student?.avatar || `https://i.pravatar.cc/150?u=${result.student?.email}`} alt="" />
                                                                <div>
                                                                    <div className="text-sm font-medium">{result.student?.name || 'Unknown'}</div>
                                                                    <div className="text-xs text-slate-500">{result.student?.email || ''}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{result.exam?.title || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-sm font-bold">{result.score}</span>
                                                            <span className="text-slate-500 text-sm">/{result.exam?.totalMarks || 100}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {isPassed ? t('passed') : t('failed')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                            {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => setShowDetailModal(result._id)}
                                                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                                                title={t('view')}
                                                            >
                                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {!loading && filteredResults.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">analytics</span>
                                <p className="text-slate-500 font-medium">{t('noResultsFound')}</p>
                                <p className="text-slate-400 text-sm mt-1">{t('adjustSearchResults')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Detail Modal */}
            {showDetailModal && selectedResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDetailModal(null)}></div>
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold">{t('resultDetails')}</h2>
                            <button onClick={() => setShowDetailModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Student Info */}
                            <div className="flex items-center gap-4">
                                <img className="size-16 rounded-full object-cover border-2 border-primary" src={selectedResult.student?.avatar || `https://i.pravatar.cc/150?u=${selectedResult.student?.email}`} alt="" />
                                <div>
                                    <h3 className="text-lg font-bold">{selectedResult.student?.name || 'Unknown'}</h3>
                                    <p className="text-slate-500">{selectedResult.student?.email || ''}</p>
                                </div>
                            </div>

                            {/* Score Summary */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-primary">{selectedResult.score}</p>
                                    <p className="text-xs text-slate-500">{t('totalScore')}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold">{selectedResult.timeTaken}m</p>
                                    <p className="text-xs text-slate-500">{t('timeTaken')}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-red-600">{selectedResult.violationsCount}</p>
                                    <p className="text-xs text-slate-500">{t('violations')}</p>
                                </div>
                            </div>

                            {/* Exam Info */}
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h4 className="font-bold mb-2">{t('examInfo')}</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p><span className="text-slate-500">{t('exam')}:</span> {selectedResult.exam?.title || 'N/A'}</p>
                                    <p><span className="text-slate-500">{t('submitted')}:</span> {selectedResult.submittedAt ? new Date(selectedResult.submittedAt).toLocaleString() : 'N/A'}</p>
                                    <p><span className="text-slate-500">{t('startedAt')}:</span> {selectedResult.startedAt ? new Date(selectedResult.startedAt).toLocaleString() : 'N/A'}</p>
                                    <p><span className="text-slate-500">{t('status')}:</span> {selectedResult.autoSubmitted ? t('autoSubmitted') : t('submitted')}</p>
                                </div>
                            </div>

                            {/* Answers */}
                            {selectedResult.answers && Object.keys(selectedResult.answers).length > 0 && (
                                <div>
                                    <h4 className="font-bold mb-3">{t('answersGiven')}</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {Object.entries(selectedResult.answers).map(([qId, ans], idx) => (
                                            <div key={qId} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                                                <span className="size-6 flex items-center justify-center bg-primary/10 text-primary rounded-full text-xs font-bold">{idx + 1}</span>
                                                <span className="text-slate-500">{t('question')} {idx + 1}:</span>
                                                <span className="font-medium">{(ans as string).toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button onClick={() => setShowDetailModal(null)} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium">{t('close')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsManagement;
