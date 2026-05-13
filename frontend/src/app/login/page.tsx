'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Shield, 
  ArrowRight,
  CircleDollarSign,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('Server returned an invalid response. Please contact support.');
        setIsLoading(false);
        return;
      }
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_pw', password); // Store for vault reveal
        localStorage.setItem('user', JSON.stringify({
          id: data.user_id,
          name: data.username,
          email: data.email,
          username: data.username_field,
          role: data.role,
          business: data.business,
          access: data.access,
          permissions: data.permissions,
        }));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid identity or secret key. Access denied.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Please ensure backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-400px] right-[-200px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] animate-float-slow" />
        <div className="absolute bottom-[-300px] left-[-150px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] animate-float-medium" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>

      <div className="container relative z-10 max-w-[1200px] px-4 md:px-10 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Branding & Features */}
          <div className="hidden lg:block space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-black">Z</span>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase">
                  Zerozz ERP
                </h1>
                <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Modern Business OS</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-extrabold text-white leading-tight">
                Welcome to the <br />
                <span className="text-cyan-400">Zerozz Universe.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Master your operations with futuristic speed, absolute security, and a stunning interface.
              </p>
            </div>

            <div className="grid gap-4 max-w-md">
              {[
                { icon: <BarChart3 className="text-cyan-400" />, title: "Real-time Analytics", desc: "Track your business metrics in real-time" },
                { icon: <Shield className="text-cyan-400" />, title: "Secure & Reliable", desc: "Enterprise-grade security for your data" },
                { icon: <Zap className="text-cyan-400" />, title: "Lightning Fast", desc: "Optimized performance for productivity" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-10 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-xl shadow-cyan-500/20">
                <span className="text-2xl font-black">Z</span>
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Zerozz ERP</h1>
            </div>

            <div className="bg-white/[0.98] backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl shadow-black/40 border border-white/20">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-slate-900">Sign In</h3>
                <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3 animate-shake">
                    <Info size={18} />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Identity (Username or Email)</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <User size={20} />
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your identity"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold text-slate-700">Secret Key (Password)</label>
                    <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot?</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer">Remember this session</label>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="tracking-[0.2em]">AUTHENTICATE</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

            </div>

            {/* Legal Footer */}
            <p className="mt-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              &copy; 2026 Zerozz ERP Global Systems.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
