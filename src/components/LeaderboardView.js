'use client';

import { useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import { withTimeout } from '@/lib/supabase-browser';
import { GROUP_MATCHES, FLAGS, SHORT_NAMES, hasMatchStarted, formatMatchDate } from '@/data/matches';

export default function LeaderboardView({ leaderboard, currentUserId, leagueMembers, activeLeague, results, odds }) {
  const { supabase } = useAuth();
  const [expandedUser, setExpandedUser] = useState(null);
  const [userPicks, setUserPicks] = useState({}); // { userId: { matchId: pick } }
  const [loadingPicks, setLoadingPicks] = useState(false);

  // Filter leaderboard to only show members of the active league
  const filtered = useMemo(() => {
    if (!leagueMembers || leagueMembers.length === 0) return [];
    const memberIds = new Set(leagueMembers.map(m => m.user_id));
    return leaderboard.filter(u => memberIds.has(u.user_id));
  }, [leaderboard, leagueMembers]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      b.points - a.points || b.correct_picks - a.correct_picks || b.total_picks - a.total_picks
    );
  }, [filtered]);

  const totalDecided = sorted.length > 0 ? sorted[0].decided_matches : 0;

  async function handleToggleUser(userId) {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }

    setExpandedUser(userId);

    // Load this user's picks if we haven't already
    if (!userPicks[userId] && supabase) {
      setLoadingPicks(true);
      try {
        const { data } = await withTimeout(
          supabase.from('picks').select('match_id, pick, wager').eq('user_id', userId),
          5000,
          'load user picks'
        );
        if (data) {
          const picksMap = {};
          data.forEach(p => { picksMap[p.match_id] = p; });
          setUserPicks(prev => ({ ...prev, [userId]: picksMap }));
        }
      } catch (e) {
        console.error('Failed to load user picks:', e.message);
      }
      setLoadingPicks(false);
    }
  }

  // Get matches that have kicked off (picks are visible) and have a result
  const kickedOffMatches = useMemo(() => {
    return GROUP_MATCHES.filter(m => hasMatchStarted(m.kickoff)).sort(
      (a, b) => new Date(b.kickoff) - new Date(a.kickoff)
    );
  }, []);

  function renderUserPicks(userId) {
    const picks = userPicks[userId];
    if (!picks && loadingPicks) {
      return <p className="text-[10px] text-text-muted text-center py-3">Loading picks...</p>;
    }
    if (!picks) return null;

    const visibleMatches = kickedOffMatches.filter(m => picks[m.id]);

    if (visibleMatches.length === 0) {
      return <p className="text-[10px] text-text-muted text-center py-3">No visible picks yet</p>;
    }

    return (
      <div className="space-y-1 pt-2">
        {visibleMatches.map(m => {
          const pick = picks[m.id];
          const result = results?.[m.id];
          const matchOdds = odds?.[m.id];
          const correct = result && pick.pick === result.result;
          const wrong = result && pick.pick !== result.result;

          const pickedTeam = pick.pick === 'home' ? m.home
            : pick.pick === 'away' ? m.away
            : 'Draw';
          const pickedShort = pick.pick === 'home' ? SHORT_NAMES[m.home]
            : pick.pick === 'away' ? SHORT_NAMES[m.away]
            : 'DRAW';
          const pickedFlag = pick.pick === 'home' ? FLAGS[m.home]
            : pick.pick === 'away' ? FLAGS[m.away]
            : '🤝';

          const oddsValue = matchOdds ? (
            pick.pick === 'home' ? matchOdds.home_odds
            : pick.pick === 'draw' ? matchOdds.draw_odds
            : matchOdds.away_odds
          ) : null;

          const payout = correct && oddsValue ? (pick.wager || 1) * oddsValue : 0;

          return (
            <div
              key={m.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] ${
                correct ? 'bg-green-50/60' : wrong ? 'bg-red-50/40' : 'bg-surface-secondary'
              }`}
            >
              <span className="text-sm">{pickedFlag}</span>
              <span className="font-semibold text-text-primary">{pickedShort}</span>
              <span className="text-text-muted">
                {FLAGS[m.home]} {SHORT_NAMES[m.home]} vs {SHORT_NAMES[m.away]} {FLAGS[m.away]}
              </span>
              <span className="flex-1" />
              {result && (
                <span className={`font-bold font-mono ${correct ? 'text-brand-green' : 'text-red-400'}`}>
                  {correct ? `+${payout.toFixed(1)}` : '0'}
                </span>
              )}
              {!result && (
                <span className="text-text-muted font-mono">⏳</span>
              )}
            </div>
          );
        })}

        {/* Show count of hidden (not yet kicked off) picks */}
        {(() => {
          const totalPicks = Object.keys(picks).length;
          const visibleCount = visibleMatches.length;
          const hidden = totalPicks - visibleCount;
          if (hidden > 0) {
            return (
              <p className="text-[9px] text-text-muted text-center pt-1">
                🔒 {hidden} pick{hidden !== 1 ? 's' : ''} hidden until kickoff
              </p>
            );
          }
          return null;
        })()}
      </div>
    );
  }

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
            const isExpanded = expandedUser === user.user_id;
            const rankColors = {
              1: 'text-amber-500',
              2: 'text-gray-400',
              3: 'text-amber-700',
            };

            return (
              <div
                key={user.user_id}
                className={`rounded-xl border transition-all ${
                  isMe
                    ? 'bg-brand-green-bg border-brand-green/30'
                    : rank === 1
                    ? 'bg-amber-50/50 border-amber-200/50'
                    : 'bg-white border-border'
                }`}
              >
                {/* Main row — tappable */}
                <button
                  onClick={() => handleToggleUser(user.user_id)}
                  className="w-full flex items-center gap-3 px-4 py-3"
                >
                  {/* Rank */}
                  <span className={`text-lg font-bold w-7 text-center font-mono ${
                    rankColors[rank] || 'text-text-muted'
                  }`}>
                    {rank}
                  </span>

                  {/* Name and stats */}
                  <div className="flex-1 min-w-0 text-left">
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

                  {/* Expand indicator */}
                  <span className={`text-text-muted text-[10px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded picks */}
                {isExpanded && (
                  <div className="px-4 pb-3 border-t border-border/50">
                    {renderUserPicks(user.user_id)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
