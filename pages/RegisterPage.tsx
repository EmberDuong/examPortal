
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage, LanguageSwitcher } from '../i18n';

// API Base URL
const API_BASE = '/api';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Register form
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Verification
    const [verificationCode, setVerificationCode] = useState('');
    const [testCode, setTestCode] = useState(''); // For testing, shows the code

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordMismatch'));
            return;
        }

        if (formData.password.length < 6) {
            setError(t('passwordTooShort'));
            return;
        }

        if (!formData.phone) {
            setError(t('phoneRequired'));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // For testing, show the verification code
            setTestCode(data.verificationCode || '');
            setSuccess(t('registrationSuccess'));
            setStep('verify');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/verify-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, code: verificationCode }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Save token and redirect to login
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            setSuccess(t('verificationSuccess'));
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/resend-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setTestCode(data.verificationCode || '');
            setSuccess(t('codeSent'));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background-light dark:bg-slate-900 font-display text-slate-900 dark:text-white">
            {/* Left side - form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[24px]">school</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">{t('appName')}</span>
                        </div>
                        <LanguageSwitcher />
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                        {step === 'register' ? (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold mb-2">{t('registerTitle')}</h1>
                                    <p className="text-slate-500 text-sm">{t('registerDescription')}</p>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">{t('fullName')} *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('username')} *</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('phone')} *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                placeholder="0912345678"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">{t('email')} *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('password')} *</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                minLength={6}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">{t('confirmPassword')} *</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                                {t('loading')}...
                                            </>
                                        ) : (
                                            t('registerButton')
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-slate-500 text-sm">
                                        {t('haveAccount')}{' '}
                                        <Link to="/login" className="text-primary hover:underline font-medium">
                                            {t('loginNow')}
                                        </Link>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-6 text-center">
                                    <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-primary text-3xl">phone_android</span>
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">{t('verifyPhone')}</h1>
                                    <p className="text-slate-500 text-sm">
                                        {t('verifyPhoneDesc')} <strong>{formData.phone}</strong>
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        {success}
                                    </div>
                                )}

                                {/* Test code display - remove in production */}
                                {testCode && (
                                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-400 text-sm">
                                        <p className="font-medium">🧪 Mã xác thực (test only):</p>
                                        <p className="text-2xl font-mono font-bold tracking-widest mt-1">{testCode}</p>
                                    </div>
                                )}

                                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">{t('verificationCode')}</label>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className="w-full px-4 py-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl font-mono tracking-[0.5em]"
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || verificationCode.length !== 6}
                                        className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                                {t('loading')}...
                                            </>
                                        ) : (
                                            t('verifyButton')
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleResendCode}
                                        disabled={loading}
                                        className="text-primary hover:underline font-medium text-sm"
                                    >
                                        {t('resendCode')}
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => setStep('register')}
                                        className="text-slate-500 hover:text-slate-700 text-sm"
                                    >
                                        ← {t('backToRegister')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side - decorative */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="max-w-md text-center">
                        <div className="size-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <span className="material-symbols-outlined text-[48px]">how_to_reg</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">{t('joinUs')}</h2>
                        <p className="text-white/80 mb-8">
                            {t('registerBenefit')}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span>{t('freeAccess')}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
                                <span className="material-symbols-outlined text-lg">security</span>
                                <span>{t('secureExam')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
