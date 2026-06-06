'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function PasswordReset() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error: err } = await updatePassword(password);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-3xl mb-3">✅</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Password Updated</h2>
          <p className="text-sm text-text-secondary mb-6">
            Your password has been reset. You're now logged in.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            Continue to picks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🔒</div>
          <h1 className="text-xl font-bold text-text-primary">Set New Password</h1>
          <p className="text-sm text-text-secondary mt-1">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              New Password
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

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
              required
              minLength={6}
            />
          </div>

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
            {loading ? 'Updating...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
