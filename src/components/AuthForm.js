'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function AuthForm() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('login'); // login, signup, forgot, reset_sent
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!displayName.trim()) {
        setError('Display name is required');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, displayName.trim());
      if (err) setError(err.message);
      else setSignupSuccess(true);
    } else if (mode === 'forgot') {
      const { error: err } = await resetPassword(email);
      if (err) setError(err.message);
      else setMode('reset_sent');
    } else {
      const { error: err } = await signIn(email, password);
      if (err) setError(err.message);
    }
    setLoading(false);
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Check your email</h2>
          <p className="text-sm text-text-secondary mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <button
            onClick={() => { setSignupSuccess(false); setMode('login'); }}
            className="text-sm text-brand-green font-medium hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'reset_sent') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Check your email</h2>
          <p className="text-sm text-text-secondary mb-6">
            We sent a password reset link to <strong>{email}</strong>. Click it to set a new password.
          </p>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className="text-sm text-brand-green font-medium hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">⚽</div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            World Cup 2026
          </h1>
          <p className="text-sm text-text-secondary mt-1">Picks Tracker</p>
        </div>

        {/* Tab toggle */}
        {mode !== 'forgot' && (
          <div className="flex bg-surface-tertiary rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-muted'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'signup'
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-muted'
              }`}
            >
              Sign up
            </button>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-text-primary">Reset Password</p>
            <p className="text-xs text-text-muted mt-1">Enter your email and we'll send a reset link</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
          </button>
        </form>

        {/* Forgot password link */}
        {mode === 'login' && (
          <div className="text-center mt-4">
            <button
              onClick={() => { setMode('forgot'); setError(''); }}
              className="text-[11px] text-text-muted hover:text-brand-green transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="text-[11px] text-text-muted hover:text-brand-green transition-colors"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
