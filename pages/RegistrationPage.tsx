
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="px-4 sm:px-10 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Online Exam System</h2>
          </div>
          <a className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Help & Support</span>
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-[960px] grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Side: Context */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 pt-10 sticky top-24">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Studying" 
              />
              <div className="absolute bottom-4 left-4 z-20 text-white">
                <p className="font-bold text-lg">Excellence in Testing</p>
                <p className="text-sm text-slate-200">Secure, reliable, and accessible from anywhere.</p>
              </div>
            </div>
            <div className="space-y-4 px-2">
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="font-semibold">Secure Environment</h3>
                  <p className="text-sm text-slate-500">Advanced proctoring and data protection for every candidate.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h3 className="font-semibold">Flexible Scheduling</h3>
                  <p className="text-sm text-slate-500">Book your exam slots according to your convenience.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 sm:p-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Student Registration</h1>
                <p className="text-slate-500">Create your account to schedule and take exams.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </span>
                    <input className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 sm:text-sm" placeholder="Enter your full legal name" type="text" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </span>
                      <input className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 sm:text-sm" placeholder="name@email.com" type="email" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </span>
                      <input className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 sm:text-sm" placeholder="+1 (555) 000-0000" type="tel" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">badge</span>
                    </span>
                    <input className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 sm:text-sm" placeholder="Choose a unique username" type="text" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </span>
                      <input className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-10 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 sm:text-sm" placeholder="••••••••" type="password" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      </span>
                      <input className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 sm:text-sm" placeholder="••••••••" type="password" required />
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" id="terms" name="terms" type="checkbox" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-slate-700 dark:text-slate-300" htmlFor="terms">I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a></label>
                  </div>
                </div>

                <button type="submit" className="flex w-full justify-center rounded-lg bg-primary py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200">
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account? <Link to="/login" className="font-semibold text-primary hover:text-blue-500 transition-colors">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-400">
        <p>© 2024 Online Exam System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RegistrationPage;
