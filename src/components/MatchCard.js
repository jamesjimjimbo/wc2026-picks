'use client';

import { useState } from 'react';
import { FLAGS, SHORT_NAMES, formatKickoff, formatMatchDate, hasMatchStarted } from '@/data/matches';

export default function MatchCard({ match, pick, odds, result, onPick, isKnockout, balance, onWagerChange }) {
  const [animating, setAnimating] = useState(false);
  const [wagerInput, setWagerInput] = useState(null);
  const isLocked = hasMatchStarted(match.kickoff) || !!result;
  const correct = result && pick?.pick === result.result;
  const wrong = result && pick && pick.pick !== result.result;

  function handlePick(choice) {
    if (isLocked) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 250);
    onPick(match.id, choice, isKnockout);
  }

  const homeOdds = odds?.home_odds;
  const drawOdds = odds?.draw_odds;
  const awayOdds = odds?.away_odds;

  const wager = pick?.wager ?? 1;
  const payout = correct ? (
    pick.pick === 'home' ? homeOdds :
    pick.pick === 'draw' ? drawOdds :
    awayOdds
  ) : 0;

  const selectedOdds = pick?.pick === 'home' ? homeOdds :
    pick?.pick === 'draw' ? drawOdds :
    pick?.pick === 'away' ? awayOdds : null;
  const potentialPayout = selectedOdds ? (wager * selectedOdds) : 0;

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
          {correct ? `✓ +${(payout * wager).toFixed(1)} PTS` : `✗ -${wager.toFixed(1)} PTS`}
        </div>
      )}

      <div className="px-3 py-3">
        {/* Meta line */}
        <div className="text-center mb-2">
          <span className="text-[10px] text-text-muted">
{match.venueShort && match.venueShort !== 'TBD' ? `${new Date(match.kickoff).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${formatKickoff(match.kickoff)} · ${match.venueShort}` : 'Date TBD'}
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
              {SHORT_NAMES[match.home] || match.home}
            </span>
            {homeOdds > 0 && (
              <span className="text-[10px] text-text-muted font-mono">{homeOdds.toFixed(2)}</span>
            )}
          </button>

          {/* Draw — hidden for knockout matches */}
          {!isKnockout && (
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
              {drawOdds > 0 && (
                <span className="block text-[10px] text-text-muted font-mono mt-0.5">{drawOdds.toFixed(2)}</span>
              )}
            </button>
          )}

          {/* VS divider for knockouts */}
          {isKnockout && (
            <div className="px-2">
              <span className="text-[10px] font-bold text-text-muted">VS</span>
            </div>
          )}

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
              {SHORT_NAMES[match.away] || match.away}
            </span>
            {awayOdds > 0 && (
              <span className="text-[10px] text-text-muted font-mono">{awayOdds.toFixed(2)}</span>
            )}
          </button>
        </div>

        {/* Wager section */}
        <div className={`mt-2 pt-2 border-t border-border/50 flex items-center justify-between ${
          !pick ? 'opacity-40' : ''
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-text-muted uppercase tracking-wider font-medium">Wager</span>
            {isKnockout && !isLocked && pick ? (
              (() => {
                const maxWager = Math.round(((balance || 0) + wager) * 10) / 10;

                return (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={maxWager}
                      value={wagerInput !== null ? wagerInput : wager}
                      onChange={(e) => {
                        setWagerInput(e.target.value);
                      }}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(maxWager, Math.round(val * 10) / 10));
                        setWagerInput(null);
                        if (onWagerChange) onWagerChange(match.id, clamped);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur();
                        }
                      }}
                      className="w-14 text-center text-sm font-bold font-mono text-text-primary bg-surface-secondary border border-border rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                    />
                    <span className="text-[9px] text-text-muted">
                      / {maxWager.toFixed(1)} avail
                    </span>
                  </div>
                );
              })()
            ) : (
              <span className="text-xs font-bold font-mono text-text-muted">
                {wager.toFixed(0)} pt{wager !== 1 ? 's' : ''}
                {!isKnockout && <span className="text-[8px] ml-1 text-text-muted/50">FIXED</span>}
              </span>
            )}
          </div>
          {pick && selectedOdds && !result && (
            <span className="text-[10px] text-text-muted">
              Potential: <span className="font-mono font-semibold text-brand-green">{potentialPayout.toFixed(1)}</span> pts
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
