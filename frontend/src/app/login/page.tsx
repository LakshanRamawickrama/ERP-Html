'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Briefcase, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Super Admin Credentials
    if (email === 'superadmin@central.com' && password === 'superadmin123') {
      localStorage.setItem('user', JSON.stringify({
        email,
        role: 'Super Admin',
        name: 'Super Administrator'
      }));
      router.push('/dashboard');
    } 
    // Admin Credentials
    else if (email === 'admin@central.com' && password === 'admin123') {
      localStorage.setItem('user', JSON.stringify({
        email,
        role: 'Company Admin',
        name: 'Company Administrator'
      }));
      router.push('/dashboard');
    } 
    else {
      setError('Invalid identity or secret key. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-[#2c3e50] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4">
             <Briefcase className="w-8 h-8 text-[#2c3e50]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">BUSINESS CENTRAL</h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Enterprise ERP Solutions</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">Please sign in to access your secure portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold p-3 rounded-xl flex items-center gap-2 animate-pulse">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Identity (Email)</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  required
                  placeholder="admin@central.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secret Key (Password)</label>
                <a href="#" className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#2c3e50] text-white py-4 rounded-xl text-sm font-bold shadow-xl hover:bg-[#34495e] hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center justify-center gap-3 mt-6"
            >
              <ShieldCheck className="w-5 h-5" />
              AUTHENTICATE SESSION
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">Demo Access Credentials</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { setEmail('superadmin@central.com'); setPassword('superadmin123'); }}
                className="flex flex-col items-start p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-left"
              >
                <span className="text-[10px] font-black text-blue-600 uppercase">Super Admin</span>
                <span className="text-[11px] text-slate-500 font-mono mt-1">ID: superadmin@central.com / PW: superadmin123</span>
              </button>
              <button 
                onClick={() => { setEmail('admin@central.com'); setPassword('admin123'); }}
                className="flex flex-col items-start p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-left"
              >
                <span className="text-[10px] font-black text-emerald-600 uppercase">Company Admin</span>
                <span className="text-[11px] text-slate-500 font-mono mt-1">ID: admin@central.com / PW: admin123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            &copy; 2026 Global Enterprise Systems Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}
