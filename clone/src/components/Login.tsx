import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Shield, BookOpen, Users, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

const roleBadges = [
  { role: 'Admin', email: 'admin@goldenkey.com', password: 'admin123', icon: Shield, color: 'from-blue-600 to-indigo-700', desc: 'Full system access — Finance, Performance, Audit' },
  { role: 'Teacher', email: 'teacher@goldenkey.com', password: 'teacher123', icon: BookOpen, color: 'from-emerald-600 to-teal-700', desc: 'Subject performance, Assessments, AI Comments' },
  { role: 'Parent', email: 'parent@goldenkey.com', password: 'parent123', icon: Users, color: 'from-purple-600 to-pink-700', desc: 'Child fees, Performance, Report cards' },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      setLoading(false);
    }, 600);
  };

  const quickLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
    setLoading(true);
    setTimeout(() => {
      login(e, p);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-200/50">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">GoldenKey</h1>
              <p className="text-sm font-semibold text-amber-700 tracking-widest uppercase">Elite School Management</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">AI-Powered CBC System • Role-Based Access Control</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Login Form */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-amber-900/10 p-8 border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all outline-none"
                    placeholder="you@goldenkey.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all outline-none"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-200/50 disabled:opacity-60 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Quick Access Cards */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1 mb-3">Quick Demo Access</h3>
            {roleBadges.map(badge => (
              <button
                key={badge.role}
                onClick={() => quickLogin(badge.email, badge.password)}
                className="w-full group text-left"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all group-hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
                      <badge.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-sm">{badge.role}</div>
                      <div className="text-xs text-gray-500 truncate">{badge.desc}</div>
                    </div>
                    <div className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <div className="bg-amber-50/80 border border-amber-200/50 rounded-2xl p-4 mt-4">
              <div className="flex items-start gap-2">
                <div className="text-amber-600 mt-0.5">💡</div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Click any role above for instant access. Each role has different permissions and views.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 GoldenKey Elite • AI-Powered CBC School Management System • Kenya
        </p>
      </div>
    </div>
  );
}
