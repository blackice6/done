import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound, Shield, GraduationCap, Users } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const success = login(email, password);
    if (!success) setError('Invalid email or password. Try the demo accounts below.');
    setLoading(false);
  };

  const quickLogin = (role: string) => {
    if (role === 'admin') { setEmail('admin@goldenkey.com'); setPassword('password123'); }
    else if (role === 'teacher') { setEmail('teacher@goldenkey.com'); setPassword('password123'); }
    else { setEmail('parent@goldenkey.com'); setPassword('password123'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4 animate-pulse-glow">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">GoldenKey Elite</h1>
            <p className="text-gray-500 mt-1">AI-Powered School Management</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none text-gray-900"
                placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none text-gray-900"
                placeholder="Enter your password" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-center text-sm text-gray-500 mb-4">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => quickLogin('admin')}
                className="flex flex-col items-center p-3 rounded-xl border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all">
                <Shield className="w-6 h-6 text-amber-600 mb-1" />
                <span className="text-xs font-semibold text-gray-700">Admin</span>
              </button>
              <button onClick={() => quickLogin('teacher')}
                className="flex flex-col items-center p-3 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
                <GraduationCap className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-semibold text-gray-700">Teacher</span>
              </button>
              <button onClick={() => quickLogin('parent')}
                className="flex flex-col items-center p-3 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all">
                <Users className="w-6 h-6 text-green-600 mb-1" />
                <span className="text-xs font-semibold text-gray-700">Parent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
