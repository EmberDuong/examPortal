
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useLanguage, LanguageSwitcher } from '../i18n';

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        setIsEditing(false);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert(t('passwordMismatch'));
            return;
        }
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

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
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" to="/results">{t('results')}</Link>
                        <Link className="text-primary font-semibold text-sm border-b-2 border-primary pb-0.5" to="/profile">{t('profile')}</Link>
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

            <main className="flex-1 w-full max-w-[800px] mx-auto px-6 md:px-10 py-8">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('myProfile')}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{t('manageAccountSettings')}</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Avatar Section */}
                    <div className="bg-gradient-to-r from-primary to-blue-600 h-32 relative">
                        <div className="absolute -bottom-12 left-6">
                            <div
                                className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg"
                                style={{ backgroundImage: `url(${user.avatar})` }}
                            ></div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="pt-16 px-6 pb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-slate-500">{user.role === 'admin' ? t('administrator') : t('studentRole')}</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    {t('editProfile')}
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">{t('fullName')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                ) : (
                                    <p className="text-lg font-medium">{user.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">{t('email')}</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                ) : (
                                    <p className="text-lg font-medium">{user.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">{t('phone')}</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+84"
                                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-slate-400">{phone || t('notProvided')}</p>
                                )}
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">{t('studentId')}</label>
                                <p className="text-lg font-medium font-mono">{user.id}</p>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                                    >
                                        {saving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                        {t('saveChanges')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        {t('security')}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <div>
                                <p className="font-medium">{t('password')}</p>
                                <p className="text-sm text-slate-500">{t('lastChanged')}: {t('never')}</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                {t('changePassword')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6 mt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                        <span className="material-symbols-outlined">warning</span>
                        {t('dangerZone')}
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div>
                            <p className="font-medium text-red-700 dark:text-red-400">{t('deleteAccount')}</p>
                            <p className="text-sm text-red-600 dark:text-red-500">{t('deleteAccountDesc')}</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            {t('delete')}
                        </button>
                    </div>
                </div>
            </main>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
                    <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-bold mb-6">{t('changePassword')}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('currentPassword')}</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('newPassword')}</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('confirmPassword')}</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={saving}
                                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                {saving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
