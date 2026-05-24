'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { GROUP_MATCHES, hasMatchStarted, minutesUntilKickoff } from '@/data/matches';
import { calculateDisplayBalance, calculateAvailableBalance } from '@/lib/balance';

export default function Header({ picks, results, odds, view, setView, leagues, activeLeague, onSwitchLeague }) {
  const { profile, signOut } = useAuth();
  const [showLeaguePicker, setShowLeaguePicker] = useState(false);

  // Calculate balance
  const balance = calculateDisplayBalance(picks, results, odds);

  // Count today's matches and unpicked ones
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const todaysMatches = GROUP_MATCHES.filter(m => m.date === todayStr);
  const unpickedToday = todaysMatches.filter(m =>
    !picks[m.id] && !hasMatchStarted(m.kickoff)
  );

  const upcomingUnpicked = GROUP_MATCHES
    .filter(m => !picks[m.id] && !hasMatchStarted(m.kickoff))
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));

  const nextUnpicked = upcomingUnpicked[0];
  const nextMins = nextUnpicked ? minutesUntilKickoff(nextUnpicked.kickoff) : null;

  const totalPicked = Object.keys(picks).length;
  const totalDecided = Object.keys(results).length;
  const correctPicks = Object.entries(picks).filter(
    ([mid, p]) => results[mid] && p.pick === results[mid].result
  ).length;

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      {/* Alert banner */}
      {unpickedToday.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 alert-slide">
          <p className="text-xs text-amber-700 font-medium text-center">
            ⚡ {unpickedToday.length} match{unpickedToday.length > 1 ? 'es' : ''} today still need{unpickedToday.length === 1 ? 's' : ''} a pick
            {nextMins !== null && nextMins < 120 && nextMins > 0 && (
              <span className="text-amber-900 font-bold"> · Next locks in {nextMins}min</span>
            )}
          </p>
        </div>
      )}

      {/* Main header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-tight">
              World Cup 2026
            </h1>
            {/* League name / switcher */}
            {activeLeague && (
              <div className="relative">
                <button
                  onClick={() => leagues.length > 1 && setShowLeaguePicker(!showLeaguePicker)}
                  className={`text-[10px] text-brand-green font-semibold uppercase tracking-widest flex items-center gap-1 ${
                    leagues.length > 1 ? 'cursor-pointer hover:text-brand-green-dark' : 'cursor-default'
                  }`}
                >
                  {activeLeague.name}
                  {leagues.length > 1 && <span className="text-[8px]">▼</span>}
                </button>

                {/* League dropdown */}
                {showLeaguePicker && leagues.length > 1 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLeaguePicker(false)} />
                    <div className="absolute top-5 left-0 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                      {leagues.map(l => (
                        <button
                          key={l.id}
                          onClick={() => {
                            onSwitchLeague(l);
                            setShowLeaguePicker(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            l.id === activeLeague.id
                              ? 'bg-brand-green-bg text-brand-green-dark font-semibold'
                              : 'text-text-secondary hover:bg-surface-secondary'
                          }`}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-text-muted">Balance</p>
              <p className="text-lg font-bold text-brand-green tabular-nums">
                {balance.toFixed(1)}
              </p>
            </div>
            <button
              onClick={signOut}
              className="text-[10px] text-text-muted hover:text-text-secondary border border-border-light rounded px-2 py-1 transition-colors"
            >
              {profile?.display_name?.slice(0, 8)}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            <span className="text-[11px] text-text-secondary font-mono">
              {totalPicked}/72 picked
            </span>
          </div>
          {totalDecided > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
              <span className="text-[11px] text-text-secondary font-mono">
                {correctPicks}/{totalDecided} correct
              </span>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex bg-surface-tertiary rounded-lg p-1">
          {[
            { id: 'picks', label: 'My Picks', icon: '⚽' },
            { id: 'leaderboard', label: 'Standings', icon: '🏆' },
            { id: 'results', label: 'Results', icon: '📊' },
            { id: 'rules', label: 'Rules', icon: '📖' },
            ...(profile?.is_admin ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex-1 py-2 text-[11px] font-medium rounded-md transition-all ${
                view === tab.id
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
