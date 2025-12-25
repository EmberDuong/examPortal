
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';

// API Base URL
const API_BASE = '/api';

interface QuestionManagementProps {
    user: User;
    onLogout: () => void;
}

interface Question {
    _id: string;
    text: string;
    description?: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    marks: number;
    explanation?: string;
}

const QuestionManagement: React.FC<QuestionManagementProps> = ({ user, onLogout }) => {
    const { t } = useLanguage();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form state
    const [formText, setFormText] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formOptA, setFormOptA] = useState('');
    const [formOptB, setFormOptB] = useState('');
    const [formOptC, setFormOptC] = useState('');
    const [formOptD, setFormOptD] = useState('');
    const [formCorrect, setFormCorrect] = useState('a');
    const [formMarks, setFormMarks] = useState(5);
    const [formExplanation, setFormExplanation] = useState('');

    const getToken = () => localStorage.getItem('token');

    // Fetch questions from API
    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/questions`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setQuestions(data);
        } catch (err: any) {
            console.error('Error fetching questions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const filteredQuestions = questions.filter(q =>
        q.text.toLowerCase().includes(search.toLowerCase()) ||
        (q.explanation && q.explanation.toLowerCase().includes(search.toLowerCase()))
    );

    const resetForm = () => {
        setFormText('');
        setFormDescription('');
        setFormOptA('');
        setFormOptB('');
        setFormOptC('');
        setFormOptD('');
        setFormCorrect('a');
        setFormMarks(5);
        setFormExplanation('');
        setError('');
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/questions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            await fetchQuestions();
            setShowDeleteModal(null);
        } catch (err: any) {
            console.error('Error deleting question:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (id: string) => {
        const question = questions.find(q => q._id === id);
        if (question) {
            setFormText(question.text);
            setFormDescription(question.description || '');
            setFormOptA(question.options.find(o => o.id === 'a')?.text || '');
            setFormOptB(question.options.find(o => o.id === 'b')?.text || '');
            setFormOptC(question.options.find(o => o.id === 'c')?.text || '');
            setFormOptD(question.options.find(o => o.id === 'd')?.text || '');
            setFormCorrect(question.correctOptionId);
            setFormMarks(question.marks);
            setFormExplanation(question.explanation || '');
            setError('');
            setShowEditModal(id);
        }
    };

    const handleCreate = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const handleSaveCreate = async () => {
        if (!formText || !formOptA || !formOptB || !formOptC || !formOptD) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    text: formText,
                    description: formDescription,
                    options: [
                        { id: 'a', text: formOptA },
                        { id: 'b', text: formOptB },
                        { id: 'c', text: formOptC },
                        { id: 'd', text: formOptD }
                    ],
                    correctOptionId: formCorrect,
                    marks: formMarks,
                    explanation: formExplanation
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            await fetchQuestions();
            setShowCreateModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!showEditModal || !formText) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/questions/${showEditModal}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    text: formText,
                    description: formDescription,
                    options: [
                        { id: 'a', text: formOptA },
                        { id: 'b', text: formOptB },
                        { id: 'c', text: formOptC },
                        { id: 'd', text: formOptD }
                    ],
                    correctOptionId: formCorrect,
                    marks: formMarks,
                    explanation: formExplanation
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            await fetchQuestions();
            setShowEditModal(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // Determine if form modal should be shown
    const showFormModal = showCreateModal || showEditModal;
    const formModalTitle = showCreateModal ? t('createNewQuestion') : t('editQuestion');
    const handleFormSave = showCreateModal ? handleSaveCreate : handleSaveEdit;
    const handleFormCancel = () => {
        setShowCreateModal(false);
        setShowEditModal(null);
    };

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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary" to="/admin/questions">
                        <span className="material-symbols-outlined icon-filled">quiz</span>
                        <span className="text-sm font-medium">{t('questions')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin/exams">
                        <span className="material-symbols-outlined text-slate-400">description</span>
                        <span className="text-sm font-medium">{t('exams')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin/results">
                        <span className="material-symbols-outlined text-slate-400">analytics</span>
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
                <header className="flex-shrink-0 px-8 py-6 flex justify-between items-center">
                    <div className="max-w-7xl w-full flex justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-bold tracking-tight">{t('questionManagement')}</h2>
                            <p className="text-slate-500">{t('questionDescription')} {t('all')}: {questions.length}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
                            >
                                <span className="material-symbols-outlined mr-2 text-[20px]">add</span> {t('addQuestionBtn')}
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                        {/* Search */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                            <div className="w-full md:max-w-md relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><span className="material-symbols-outlined">search</span></span>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 dark:bg-slate-900 text-sm"
                                    placeholder={t('searchQuestions')}
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                                <p className="mt-2 text-slate-500">{t('loading')}</p>
                            </div>
                        )}

                        {/* Questions List */}
                        {!loading && (
                            <div className="space-y-4">
                                {filteredQuestions.map((q, idx) => (
                                    <div key={q._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <span className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold">{idx + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-4 mb-3">
                                                    <h3 className="text-base font-medium leading-snug">{q.text}</h3>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">{q.marks} {t('points').toLowerCase()}</span>
                                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">{t('correctAnswerLabel')}: {q.correctOptionId.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                                    {q.options.map(opt => (
                                                        <div key={opt.id} className={`px-3 py-2 rounded-lg text-sm ${opt.id === q.correctOptionId ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-800' : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'}`}>
                                                            <span className="font-medium">{opt.id.toUpperCase()}.</span> {opt.text}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(q._id)}
                                                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span> {t('edit')}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteModal(q._id)}
                                                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span> {t('delete')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && filteredQuestions.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">quiz</span>
                                <p className="text-slate-500 font-medium">{t('noQuestionsFound')}</p>
                                <p className="text-slate-400 text-sm mt-1">{t('adjustSearchQuestion')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Form Modal - Rendered inline to prevent re-creation */}
            {showFormModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleFormCancel}></div>
                    <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold">{formModalTitle}</h2>
                            <button onClick={handleFormCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('questionText')} *</label>
                                <textarea
                                    value={formText}
                                    onChange={(e) => setFormText(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder={t('questionText') + '...'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('description')}</label>
                                <input
                                    type="text"
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('optionA')} *</label>
                                    <input
                                        type="text"
                                        value={formOptA}
                                        onChange={(e) => setFormOptA(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('optionB')} *</label>
                                    <input
                                        type="text"
                                        value={formOptB}
                                        onChange={(e) => setFormOptB(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('optionC')} *</label>
                                    <input
                                        type="text"
                                        value={formOptC}
                                        onChange={(e) => setFormOptC(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('optionD')} *</label>
                                    <input
                                        type="text"
                                        value={formOptD}
                                        onChange={(e) => setFormOptD(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('correctAnswerLabel')} *</label>
                                    <select
                                        value={formCorrect}
                                        onChange={(e) => setFormCorrect(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="a">{t('optionA')}</option>
                                        <option value="b">{t('optionB')}</option>
                                        <option value="c">{t('optionC')}</option>
                                        <option value="d">{t('optionD')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('pointsLabel')} *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formMarks}
                                        onChange={(e) => setFormMarks(parseInt(e.target.value) || 5)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('explanationLabel')}</label>
                                <textarea
                                    value={formExplanation}
                                    onChange={(e) => setFormExplanation(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button onClick={handleFormCancel} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">{t('cancel')}</button>
                            <button
                                onClick={handleFormSave}
                                disabled={saving}
                                className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                {saving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                {t('saveQuestion')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(null)}></div>
                    <div className="relative z-10 w-full max-w-md transform rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                                <span className="material-symbols-outlined text-3xl text-red-600">delete</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2">{t('deleteQuestion')}</h2>
                            <p className="text-slate-500 mb-6">{t('deleteQuestionDesc')}</p>
                            <div className="flex w-full gap-3">
                                <button onClick={() => setShowDeleteModal(null)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">{t('cancel')}</button>
                                <button
                                    onClick={() => handleDelete(showDeleteModal)}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    {saving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                    {t('delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionManagement;
