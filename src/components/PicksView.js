'use client';

import { useState } from 'react';
import { GROUPS, GROUP_MATCHES, FLAGS, SHORT_NAMES, formatMatchDate } from '@/data/matches';
import MatchCard from './MatchCard';

export default function PicksView({ picks, odds, results, onPick }) {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const groupKeys = Object.keys(GROUPS);

  return (
    <div className="px-4 pb-24">
      {/* Progress */}
      <div className="text-center pt-4 pb-2">
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium mb-1">
          Group Stage Picks
        </p>
        <div className="h-1 bg-surface-tertiary rounded-full max-w-xs mx-auto">
          <div
            className="h-full bg-brand-green rounded-full transition-all duration-500"
            style={{ width: `${(Object.keys(picks).length / 72) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-text-muted mt-1 font-mono">
          {Object.keys(picks).length} / 72
        </p>
      </div>

      {groupKeys.map(g => {
        const groupMatches = GROUP_MATCHES.filter(m => m.group === g);
        const groupPicked = groupMatches.filter(m => picks[m.id]).length;
        const isExpanded = expandedGroup === g;
        const allPicked = groupPicked === 6;

        return (
          <div key={g} className="mb-2">
            {/* Group header */}
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : g)}
              className="w-full flex items-center gap-3 py-3 group"
            >
              <span className={`text-xs font-bold tracking-widest px-2.5 py-1 rounded-md ${
                allPicked
                  ? 'bg-brand-green-bg text-brand-green-dark'
                  : 'bg-surface-tertiary text-text-secondary'
              }`}>
                GROUP {g}
              </span>
              <span className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-text-muted font-mono">
                {GROUPS[g].map(t => `${FLAGS[t]}`).join(' ')}
              </span>
              <span className={`text-[10px] font-mono ${allPicked ? 'text-brand-green' : 'text-text-muted'}`}>
                {groupPicked}/6
              </span>
              <span className={`text-text-muted text-[10px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Matches */}
            {isExpanded && (
              <div className="space-y-2 pb-2">
                {groupMatches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    pick={picks[m.id]}
                    odds={odds[m.id]}
                    result={results[m.id]}
                    onPick={onPick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
