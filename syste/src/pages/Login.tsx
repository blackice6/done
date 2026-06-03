import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { School, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
            <School className="w-16 h-16 text-yellow-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          GOLDENKEY ELITE
        </h2>
        <p className="mt-2 text-center text-sm text-indigo-200">
          AI-Powered CBC Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="admin@goldenkey.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <KeyRound className="w-5 h-5 mr-2" />
                Sign in to Dashboard
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">Demo Credentials:</h3>
            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p>Admin: <span className="font-mono font-bold text-indigo-600">admin@goldenkey.com</span></p>
              <p>Teacher: <span className="font-mono font-bold text-indigo-600">teacher@goldenkey.com</span></p>
              <p>Parent: <span className="font-mono font-bold text-indigo-600">parent@goldenkey.com</span></p>
              <p className="mt-2 text-gray-400 italic">Password can be anything for this demo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
