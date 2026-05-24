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

  // Check if any knockout match has a result
  const hasKnockoutsStarted = useMemo(() => {
    return Object.keys(results || {}).some(id => id.startsWith('R32') || id.startsWith('R16') || id.startsWith('QF') || id.startsWith('SF') || id.startsWith('3P') || id.startsWith('F-'));
  }, [results]);

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

  // Get matches where picks should be visible (kicked off OR has a result)
  const visibleMatches = useMemo(() => {
    return GROUP_MATCHES.filter(m => hasMatchStarted(m.kickoff) || results?.[m.id]).sort(
      (a, b) => new Date(b.kickoff) - new Date(a.kickoff)
    );
  }, [results]);

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

          const payout = correct && oddsValue ? (pick.wager ?? 1) * oddsValue : 0;

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
                    {user.points === 0 && user.decided_matches > 0 && hasKnockoutsStarted ? (
                      <p className="text-xs font-bold text-red-400">ELIMINATED</p>
                    ) : (
                      <>
                        <p className={`text-xl font-bold font-mono ${
                          user.points > 0 ? 'text-brand-green' : 'text-text-muted'
                        }`}>
                          {user.points.toFixed(1)}
                        </p>
                        <p className="text-[9px] text-text-muted uppercase tracking-wider">pts</p>
                      </>
                    )}
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

      {/* Join another league */}
      <JoinAnotherLeague />
    </div>
  );
}

function JoinAnotherLeague() {
  const { supabase } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim() || !supabase) return;
    setStatus(null);
    setLoading(true);

    const { data, error } = await supabase.rpc('join_league_by_code', {
      code: code.trim().toUpperCase(),
    });

    if (error) {
      setStatus({ error: error.message.includes('Invalid') ? 'Invalid invite code' : error.message });
    } else {
      setStatus({ success: `Joined ${data.league_name}! Refresh to see it.` });
      setCode('');
    }
    setLoading(false);
  }

  if (!showForm) {
    return (
      <div className="text-center pt-6 pb-4">
        <button
          onClick={() => setShowForm(true)}
          className="text-[11px] text-text-muted hover:text-brand-green transition-colors"
        >
          + Join another league
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-surface-secondary rounded-xl p-4">
      <p className="text-xs font-bold text-text-primary mb-2">Join Another League</p>
      <form onSubmit={handleJoin} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="INVITE CODE"
          maxLength={20}
          className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm font-mono uppercase tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Join'}
        </button>
      </form>
      {status?.error && (
        <p className="text-[11px] text-red-500 mt-2">{status.error}</p>
      )}
      {status?.success && (
        <p className="text-[11px] text-brand-green mt-2">{status.success}</p>
      )}
      <button
        onClick={() => { setShowForm(false); setStatus(null); }}
        className="text-[10px] text-text-muted mt-2 hover:text-text-secondary"
      >
        Cancel
      </button>
    </div>
  );
}
