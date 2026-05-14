'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function JoinLeague({ onJoined }) {
  const { supabase, signOut } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setError('');
    setLoading(true);

    const { data, error: err } = await supabase.rpc('join_league_by_code', {
      code: code.trim().toUpperCase(),
    });

    if (err) {
      setError(err.message.includes('Invalid') ? 'Invalid invite code. Check and try again.' : err.message);
      setLoading(false);
      return;
    }

    onJoined(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-3xl mb-2">⚽</div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          World Cup 2026
        </h1>
        <p className="text-sm text-text-secondary mt-1 mb-8">
          Enter your invite code to join a league
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="INVITE CODE"
              maxLength={20}
              className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-lg text-lg text-center font-mono font-bold tracking-[0.3em] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all uppercase"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-2.5 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join League'}
          </button>
        </form>

        <p className="text-[10px] text-text-muted mt-8">
          Get an invite code from whoever set up your league
        </p>

        <button
          onClick={signOut}
          className="text-[11px] text-text-muted hover:text-text-secondary mt-4 underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
