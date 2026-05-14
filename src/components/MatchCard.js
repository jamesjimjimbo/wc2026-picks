'use client';

import { useState } from 'react';
import { FLAGS, SHORT_NAMES, formatKickoff, hasMatchStarted } from '@/data/matches';

export default function MatchCard({ match, pick, odds, result, onPick }) {
  const [animating, setAnimating] = useState(false);
  const isLocked = hasMatchStarted(match.kickoff) || !!result;
  const correct = result && pick?.pick === result.result;
  const wrong = result && pick && pick.pick !== result.result;

  function handlePick(choice) {
    if (isLocked) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 250);
    onPick(match.id, choice);
  }

  const homeOdds = odds?.home_odds;
  const drawOdds = odds?.draw_odds;
  const awayOdds = odds?.away_odds;

  // Calculate payout if correct
  const payout = correct ? (
    pick.pick === 'home' ? homeOdds :
    pick.pick === 'draw' ? drawOdds :
    awayOdds
  ) : 0;

  return (
    <div className={`bg-white rounded-xl border transition-all ${
      correct ? 'border-brand-green bg-green-50/30' :
      wrong ? 'border-red-200 bg-red-50/20' :
      'border-border hover:border-gray-300'
    } ${animating ? 'pick-pop' : ''}`}>
      {/* Result badge */}
      {result && (
        <div className={`text-center py-1 text-[10px] font-bold tracking-wider rounded-t-xl ${
          correct ? 'bg-brand-green-light text-brand-green-dark' : 'bg-red-50 text-red-500'
        }`}>
          {correct ? `✓ +${(payout * (pick.wager || 1)).toFixed(1)} PTS` : '✗ 0 PTS'}
        </div>
      )}

      <div className="px-3 py-3">
        {/* Meta line */}
        <div className="text-center mb-2">
          <span className="text-[10px] text-text-muted">
            {formatKickoff(match.kickoff)} · {match.venueShort}
          </span>
          {isLocked && !result && (
            <span className="inline-block ml-2 text-[9px] bg-surface-tertiary text-text-muted px-1.5 py-0.5 rounded">
              🔒 LOCKED
            </span>
          )}
        </div>

        {/* Match row */}
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <button
            onClick={() => handlePick('home')}
            disabled={isLocked}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
              pick?.pick === 'home'
                ? 'bg-brand-green-bg border-2 border-brand-green'
                : 'border-2 border-transparent hover:bg-surface-secondary'
            } ${isLocked ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
          >
            <span className="text-2xl">{FLAGS[match.home] || '🏳️'}</span>
            <span className="text-[11px] font-bold text-text-primary tracking-wide">
              {SHORT_NAMES[match.home]}
            </span>
            {homeOdds && (
              <span className="text-[10px] text-text-muted font-mono">{homeOdds.toFixed(2)}</span>
            )}
          </button>

          {/* Draw */}
          <button
            onClick={() => handlePick('draw')}
            disabled={isLocked}
            className={`px-3 py-2 rounded-lg transition-all ${
              pick?.pick === 'draw'
                ? 'bg-amber-50 border-2 border-accent-amber'
                : 'border-2 border-transparent hover:bg-surface-secondary'
            } ${isLocked ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
          >
            <span className="block text-[10px] font-bold text-text-muted tracking-wider">DRAW</span>
            {drawOdds && (
              <span className="block text-[10px] text-text-muted font-mono mt-0.5">{drawOdds.toFixed(2)}</span>
            )}
          </button>

          {/* Away team */}
          <button
            onClick={() => handlePick('away')}
            disabled={isLocked}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
              pick?.pick === 'away'
                ? 'bg-brand-green-bg border-2 border-brand-green'
                : 'border-2 border-transparent hover:bg-surface-secondary'
            } ${isLocked ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
          >
            <span className="text-2xl">{FLAGS[match.away] || '🏳️'}</span>
            <span className="text-[11px] font-bold text-text-primary tracking-wide">
              {SHORT_NAMES[match.away]}
            </span>
            {awayOdds && (
              <span className="text-[10px] text-text-muted font-mono">{awayOdds.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
