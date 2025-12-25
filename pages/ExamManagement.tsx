
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';

// API Base URL
const API_BASE = '/api';

interface ExamManagementProps {
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
    questions: string[] | Question[];
}

const ExamManagement: React.FC<ExamManagementProps> = ({ user, onLogout }) => {
    const { t } = useLanguage();
    const [exams, setExams] = useState<Exam[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    // Form state - separate from formData to allow controlled updates
    const [formTitle, setFormTitle] = useState('');
    const [formCode, setFormCode] = useState('');
    const [formDepartment, setFormDepartment] = useState('');
    const [formInstructor, setFormInstructor] = useState('');
    const [formDuration, setFormDuration] = useState(60);
    const [formStartDate, setFormStartDate] = useState('');
    const [formStatus, setFormStatus] = useState('DRAFT');
    const [formPassScore, setFormPassScore] = useState(60);

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
            setExams(data);
        } catch (err: any) {
            console.error('Error fetching exams:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch questions for selection
    const fetchQuestions = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/questions`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAllQuestions(data);
        } catch (err: any) {
            console.error('Error fetching questions:', err);
        }
    }, []);

    useEffect(() => {
        fetchExams();
        fetchQuestions();
    }, [fetchExams, fetchQuestions]);

    const filteredExams = exams.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase()) ||
        e.code.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setFormTitle('');
        setFormCode('');
        setFormDepartment('');
        setFormInstructor('');
        setFormDuration(60);
        setFormStartDate('');
        setFormStatus('DRAFT');
        setFormPassScore(60);
        setSelectedQuestions([]);
        setError('');
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/exams/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            await fetchExams();
            setShowDeleteModal(null);
        } catch (err: any) {
            console.error('Error deleting exam:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (id: string) => {
        const exam = exams.find(e => e._id === id);
        if (exam) {
            setFormTitle(exam.title);
            setFormCode(exam.code);
            setFormDepartment(exam.department);
            setFormInstructor(exam.instructor || '');
            setFormDuration(exam.durationMins);
            setFormStartDate(exam.startDate || '');
            setFormStatus(exam.status);
            setFormPassScore(exam.passScore);
            // Handle both populated and non-populated questions
            const qIds = exam.questions.map((q: any) => typeof q === 'string' ? q : q._id);
            setSelectedQuestions(qIds);
            setError('');
            setShowEditModal(id);
        }
    };

    const handleCreate = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const toggleQuestion = (qId: string) => {
        if (selectedQuestions.includes(qId)) {
            setSelectedQuestions(selectedQuestions.filter(id => id !== qId));
        } else {
            setSelectedQuestions([...selectedQuestions, qId]);
        }
    };

    const calculateTotalMarks = () => {
        return allQuestions.filter(q => selectedQuestions.includes(q._id)).reduce((sum, q) => sum + q.marks, 0);
    };

    const handleSaveCreate = async () => {
        if (!formTitle || !formCode || !formDepartment) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    title: formTitle,
                    code: formCode,
                    department: formDepartment,
                    instructor: formInstructor,
                    durationMins: formDuration,
                    startDate: formStartDate || undefined,
                    status: formStatus,
                    passScore: formPassScore,
                    questions: selectedQuestions
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            await fetchExams();
            setShowCreateModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!showEditModal) return;

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/exams/${showEditModal}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    title: formTitle,
                    code: formCode,
                    department: formDepartment,
                    instructor: formInstructor,
                    durationMins: formDuration,
                    startDate: formStartDate || undefined,
                    status: formStatus,
                    passScore: formPassScore,
                    questions: selectedQuestions
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            await fetchExams();
            setShowEditModal(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE}/exams/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            await fetchExams();
        } catch (err: any) {
            console.error('Error updating status:', err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONGOING': return 'bg-green-100 text-green-700 border-green-200';
            case 'SCHEDULED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'DRAFT': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Determine if form modal should be shown
    const showFormModal = showCreateModal || showEditModal;
    const formModalTitle = showCreateModal ? t('createNewExamTitle') : t('editExam');
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
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group" to="/admin/questions">
                        <span className="material-symbols-outlined text-slate-400">quiz</span>
                        <span className="text-sm font-medium">{t('questions')}</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary" to="/admin/exams">
                        <span className="material-symbols-outlined icon-filled">description</span>
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
                <header className="flex-shrink-0 px-8 py-6">
                    <div className="max-w-7xl mx-auto w-full flex justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-bold tracking-tight">{t('examManagement')}</h2>
                            <p className="text-slate-500">{t('examManagementDesc')} {t('all')}: {exams.length}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
                            >
                                <span className="material-symbols-outlined mr-2 text-[20px]">add</span> {t('createExam')}
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
                                    placeholder={t('searchExamsAdmin')}
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

                        {/* Exams Table */}
                        {!loading && filteredExams.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('exam')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('questions')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('duration')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {filteredExams.map((exam) => (
                                                <tr key={exam._id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-primary">description</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium">{exam.title}</div>
                                                                <div className="text-xs text-slate-500">{exam.code} • {exam.department}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium">{exam.questions.length}</span>
                                                        <span className="text-slate-500 text-sm"> ({exam.totalMarks} {t('points').toLowerCase()})</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{exam.durationMins} {t('minutes').toLowerCase()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <select
                                                            value={exam.status}
                                                            onChange={(e) => handleStatusChange(exam._id, e.target.value)}
                                                            className={`text-xs font-bold rounded px-2 py-1 border ${getStatusColor(exam.status)} bg-transparent cursor-pointer`}
                                                        >
                                                            <option value="DRAFT">{t('draft')}</option>
                                                            <option value="SCHEDULED">{t('scheduled')}</option>
                                                            <option value="ONGOING">{t('ongoing')}</option>
                                                            <option value="CLOSED">{t('closed')}</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(exam._id)}
                                                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                                                title={t('edit')}
                                                            >
                                                                <span className="material-symbols-outlined text-lg">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setShowDeleteModal(exam._id)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title={t('delete')}
                                                            >
                                                                <span className="material-symbols-outlined text-lg">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {!loading && filteredExams.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">description</span>
                                <p className="text-slate-500 font-medium">{t('noExamsFound')}</p>
                                <p className="text-slate-400 text-sm mt-1">{t('adjustSearchExam')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Form Modal - Rendered inline to prevent re-creation */}
            {showFormModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleFormCancel}></div>
                    <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('examTitle')} *</label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('examCode')} *</label>
                                    <input
                                        type="text"
                                        value={formCode}
                                        onChange={(e) => setFormCode(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('department')} *</label>
                                    <input
                                        type="text"
                                        value={formDepartment}
                                        onChange={(e) => setFormDepartment(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('instructor')}</label>
                                    <input
                                        type="text"
                                        value={formInstructor}
                                        onChange={(e) => setFormInstructor(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('durationMins')} *</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="300"
                                        value={formDuration}
                                        onChange={(e) => setFormDuration(parseInt(e.target.value) || 60)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('passScore')}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formPassScore}
                                        onChange={(e) => setFormPassScore(parseInt(e.target.value) || 60)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('startDate')}</label>
                                    <input
                                        type="datetime-local"
                                        value={formStartDate}
                                        onChange={(e) => setFormStartDate(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('status')}</label>
                                    <select
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="DRAFT">{t('draft')}</option>
                                        <option value="SCHEDULED">{t('scheduled')}</option>
                                        <option value="ONGOING">{t('ongoing')}</option>
                                        <option value="CLOSED">{t('closed')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Question Selection */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium">{t('selectQuestions')}</label>
                                    <span className="text-sm text-slate-500">{selectedQuestions.length} {t('selected')} • {calculateTotalMarks()} {t('totalPoints')}</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700">
                                    {allQuestions.length === 0 ? (
                                        <div className="p-4 text-center text-slate-500 text-sm">
                                            Chưa có câu hỏi nào. Vui lòng tạo câu hỏi trước.
                                        </div>
                                    ) : (
                                        allQuestions.map((q) => (
                                            <label key={q._id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedQuestions.includes(q._id)}
                                                    onChange={() => toggleQuestion(q._id)}
                                                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                />
                                                <span className="flex-1 text-sm line-clamp-1">{q.text}</span>
                                                <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{q.marks} {t('points').toLowerCase()}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
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
                                {t('saveExam')}
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
                            <h2 className="text-xl font-bold mb-2">{t('deleteExam')}</h2>
                            <p className="text-slate-500 mb-6">{t('deleteExamDesc')}</p>
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

export default ExamManagement;
