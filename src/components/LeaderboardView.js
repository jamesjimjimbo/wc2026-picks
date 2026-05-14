'use client';

import { useMemo } from 'react';

export default function LeaderboardView({ leaderboard, currentUserId, leagueMembers, activeLeague }) {
  // Filter leaderboard to only show members of the active league
  const filtered = useMemo(() => {
    if (!leagueMembers || leagueMembers.length === 0) return leaderboard;
    const memberIds = new Set(leagueMembers.map(m => m.user_id));
    return leaderboard.filter(u => memberIds.has(u.user_id));
  }, [leaderboard, leagueMembers]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      b.points - a.points || b.correct_picks - a.correct_picks || b.total_picks - a.total_picks
    );
  }, [filtered]);

  const totalDecided = sorted.length > 0 ? sorted[0].decided_matches : 0;

  return (
    <div className="px-4 pb-24">
      <div className="text-center pt-4 pb-4">
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium mb-1">
          {activeLeague?.name || 'Standings'}
        </p>
        <p className="text-[11px] text-text-muted">
          {sorted.length} player{sorted.length !== 1 ? 's' : ''} · {totalDecided} match{totalDecided !== 1 ? 'es' : ''} decided
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-sm text-text-muted">No players in this league yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((user, i) => {
            const isMe = user.user_id === currentUserId;
            const rank = i + 1;
            const rankColors = {
              1: 'text-amber-500',
              2: 'text-gray-400',
              3: 'text-amber-700',
            };

            return (
              <div
                key={user.user_id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-brand-green-bg border-brand-green/30'
                    : rank === 1
                    ? 'bg-amber-50/50 border-amber-200/50'
                    : 'bg-white border-border'
                }`}
              >
                {/* Rank */}
                <span className={`text-lg font-bold w-7 text-center font-mono ${
                  rankColors[rank] || 'text-text-muted'
                }`}>
                  {rank}
                </span>

                {/* Name and stats */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isMe ? 'text-brand-green-dark' : 'text-text-primary'
                  }`}>
                    {user.display_name}
                    {isMe && <span className="text-[10px] text-brand-green ml-1.5">YOU</span>}
                  </p>
                  <p className="text-[10px] text-text-muted font-mono">
                    {user.correct_picks}/{user.decided_matches} correct · {user.total_picks} picked
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className={`text-xl font-bold font-mono ${
                    user.points > 0 ? 'text-brand-green' : 'text-text-muted'
                  }`}>
                    {user.points.toFixed(1)}
                  </p>
                  <p className="text-[9px] text-text-muted uppercase tracking-wider">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
