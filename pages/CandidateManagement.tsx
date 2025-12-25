
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';

// API Base URL
const API_BASE = '/api';

interface CandidateManagementProps {
  user: User;
  onLogout: () => void;
}

interface Candidate {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  avatar?: string;
}

const CandidateManagement: React.FC<CandidateManagementProps> = ({ user, onLogout }) => {
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formPassword, setFormPassword] = useState('');

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fetch candidates from API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCandidates(data);
    } catch (err: any) {
      console.error('Error fetching candidates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPhone('');
    setFormStatus('Active');
    setFormPassword('');
    setError('');
    setShowCreateModal(true);
  };

  const handleEdit = (id: string) => {
    const candidate = candidates.find(c => c._id === id);
    if (candidate) {
      setFormName(candidate.name);
      setFormUsername(candidate.username);
      setFormEmail(candidate.email);
      setFormPhone(candidate.phone || '');
      setFormStatus(candidate.status);
      setError('');
      setShowEditModal(id);
    }
  };

  const handleSaveCreate = async () => {
    if (!formName || !formEmail || !formUsername || !formPhone) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          name: formName,
          username: formUsername,
          email: formEmail,
          phone: formPhone,
          password: formPassword || 'password123',
          status: formStatus
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Refresh candidates list
      await fetchCandidates();
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!showEditModal || !formName || !formEmail) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/users/${showEditModal}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          status: formStatus
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Refresh candidates list
      await fetchCandidates();
      setShowEditModal(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Refresh candidates list
      await fetchCandidates();
      setShowDeleteModal(null);
    } catch (err: any) {
      console.error('Error deleting candidate:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ password: 'password123' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Password reset to: password123');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
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
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary" to="/admin/candidates">
            <span className="material-symbols-outlined icon-filled">group</span>
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
              <h2 className="text-3xl font-bold tracking-tight">{t('candidateManagement')}</h2>
              <p className="text-slate-500">{t('manageDescription')} {t('all')}: {candidates.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined mr-2 text-[20px]">add</span> {t('addNewCandidate')}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="w-full md:max-w-md relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><span className="material-symbols-outlined">search</span></span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 dark:bg-slate-900 text-sm"
                  placeholder={t('searchCandidates')}
                  type="text"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-medium border-none"
                >
                  <option value="all">{t('allStatus')}</option>
                  <option value="Active">{t('active')}</option>
                  <option value="Pending">{t('pending')}</option>
                  <option value="Disabled">{t('disabled')}</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                <p className="mt-2 text-slate-500">{t('loading')}</p>
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('candidate')}</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('contactInfo')}</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredCandidates.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={c.avatar || `https://i.pravatar.cc/150?u=${c.email}`} alt={c.name} />
                              <div className="ml-4">
                                <div className="text-sm font-medium">{c.name}</div>
                                <div className="text-xs text-slate-500">@{c.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{c.email}</div>
                            {c.phone && <div className="text-xs text-slate-500">{c.phone}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-800' :
                              c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {c.status === 'Active' ? t('active') : c.status === 'Pending' ? t('pending') : t('disabled')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(c._id)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                title={t('edit')}
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleResetPassword(c._id)}
                                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title={t('resetPassword')}
                              >
                                <span className="material-symbols-outlined text-lg">lock_reset</span>
                              </button>
                              <button
                                onClick={() => setShowDeleteModal(c._id)}
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

            {!loading && filteredCandidates.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">group</span>
                <p className="text-slate-500 font-medium">{t('noData')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative z-10 w-full max-w-lg transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">{t('addNewCandidate')}</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">{t('fullName')} *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('fullName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('username')} *</label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('username')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('email')} *</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('email')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('phone')} *</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('phone')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('password')} (mặc định: password123)</label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="password123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('status')}</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">{t('active')}</option>
                  <option value="Pending">{t('pending')}</option>
                  <option value="Disabled">{t('disabled')}</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">{t('cancel')}</button>
              <button
                onClick={handleSaveCreate}
                disabled={saving}
                className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowEditModal(null)}></div>
          <div className="relative z-10 w-full max-w-lg transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">{t('edit')} {t('candidate')}</h2>
              <button onClick={() => setShowEditModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">{t('fullName')} *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('email')} *</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('phone')}</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
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
                  <option value="Active">{t('active')}</option>
                  <option value="Pending">{t('pending')}</option>
                  <option value="Disabled">{t('disabled')}</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">{t('cancel')}</button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {t('save')}
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
                <span className="material-symbols-outlined text-3xl text-red-600">person_remove</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{t('deleteCandidate')}</h2>
              <p className="text-slate-500 mb-6">{t('deleteCandidateDesc')}</p>
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

export default CandidateManagement;
