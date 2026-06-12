'use client';

import { useState, useMemo } from 'react';
import { GROUPS, GROUP_MATCHES, KNOCKOUT_ROUNDS, KNOCKOUT_MATCH_SLOTS, FLAGS, SHORT_NAMES, hasMatchStarted } from '@/data/matches';
import MatchCard from './MatchCard';

const ROUND_PILLS = [
  { id: 'groups', label: 'Groups' },
  { id: 'R32', label: 'R32' },
  { id: 'R16', label: 'R16' },
  { id: 'QF', label: 'QF' },
  { id: 'SF', label: 'SF' },
  { id: 'F', label: 'Final' },
];

// Get the local date string for a UTC kickoff time
function localDateKey(kickoffIso) {
  const d = new Date(kickoffIso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function localDateLabel(kickoffIso) {
  return new Date(kickoffIso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

export default function PicksView({ picks, odds, results, onPick, knockoutMatches, balance, onWagerChange }) {
  const [activeRound, setActiveRound] = useState('groups');
  const [groupView, setGroupView] = useState('group'); // 'group' or 'date'
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);
  const groupKeys = Object.keys(GROUPS);

  // Count picks per round
  const groupPicks = Object.keys(picks).filter(id => id.match(/^[A-L]\d$/)).length;
  const knockoutPicks = (roundId) => {
    const slots = KNOCKOUT_MATCH_SLOTS.filter(s => s.round === roundId);
    return slots.filter(s => picks[s.id]).length;
  };

  // Group matches by LOCAL date (derived from kickoff time in user's timezone)
  const matchesByDate = useMemo(() => {
    const map = {};
    GROUP_MATCHES.forEach(m => {
      const key = localDateKey(m.kickoff);
      if (!map[key]) map[key] = { key, label: localDateLabel(m.kickoff), matches: [] };
      map[key].matches.push(m);
    });
    return Object.values(map)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map(group => ({
        ...group,
        matches: group.matches.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff)),
      }));
  }, []);

  return (
    <div className="px-4 pb-24">
      {/* Round pills */}
      <div className="flex gap-1 pt-3 pb-2 overflow-x-auto">
        {ROUND_PILLS.map(r => {
          const count = r.id === 'groups' ? groupPicks :
            r.id === 'F' ? (picks['F-1'] ? 1 : 0) + (picks['3P-1'] ? 1 : 0) :
            knockoutPicks(r.id);
          const total = r.id === 'groups' ? 72 :
            r.id === 'F' ? 2 :
            KNOCKOUT_MATCH_SLOTS.filter(s => s.round === r.id).length;

          return (
            <button
              key={r.id}
              onClick={() => setActiveRound(r.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                activeRound === r.id
                  ? 'bg-brand-green text-white'
                  : 'bg-surface-tertiary text-text-muted hover:text-text-secondary'
              }`}
            >
              {r.label}
              {count > 0 && (
                <span className={`ml-1 text-[9px] ${activeRound === r.id ? 'text-white/70' : 'text-text-muted'}`}>
                  {count}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* GROUP STAGE */}
      {activeRound === 'groups' && (
        <>
          {/* Group/Date toggle */}
          <div className="flex justify-center mb-2">
            <div className="flex bg-surface-tertiary rounded-lg p-0.5">
              <button
                onClick={() => setGroupView('group')}
                className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${
                  groupView === 'group'
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-muted'
                }`}
              >
                By Group
              </button>
              <button
                onClick={() => setGroupView('date')}
                className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${
                  groupView === 'date'
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-muted'
                }`}
              >
                By Date
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="text-center pb-2">
            <div className="h-1 bg-surface-tertiary rounded-full max-w-xs mx-auto">
              <div
                className="h-full bg-brand-green rounded-full transition-all duration-500"
                style={{ width: `${(groupPicks / 72) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1 font-mono">
              {groupPicks} / 72
            </p>
          </div>

          {/* BY GROUP VIEW */}
          {groupView === 'group' && groupKeys.map(g => {
            const groupMatches = GROUP_MATCHES.filter(m => m.group === g);
            const groupPicked = groupMatches.filter(m => picks[m.id]).length;
            const isExpanded = expandedGroup === g;
            const allPicked = groupPicked === 6;

            return (
              <div key={g} className="mb-2">
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
                        isKnockout={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* BY DATE VIEW */}
          {groupView === 'date' && matchesByDate.map(({ key, label, matches }) => {
            const datePicked = matches.filter(m => picks[m.id]).length;
            const isExpanded = expandedDate === key;
            const allPicked = datePicked === matches.length;

            return (
              <div key={key} className="mb-2">
                <button
                  onClick={() => setExpandedDate(isExpanded ? null : key)}
                  className="w-full flex items-center gap-3 py-3 group"
                >
                  <span className={`text-xs font-bold tracking-wide px-2.5 py-1 rounded-md ${
                    allPicked
                      ? 'bg-brand-green-bg text-brand-green-dark'
                      : 'bg-surface-tertiary text-text-secondary'
                  }`}>
                    {label}
                  </span>
                  <span className="flex-1 h-px bg-border" />
                  <span className="text-[10px] text-text-muted font-mono">
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </span>
                  <span className={`text-[10px] font-mono ${allPicked ? 'text-brand-green' : 'text-text-muted'}`}>
                    {datePicked}/{matches.length}
                  </span>
                  <span className={`text-text-muted text-[10px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="space-y-2 pb-2">
                    {matches.map(m => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        pick={picks[m.id]}
                        odds={odds[m.id]}
                        result={results[m.id]}
                        onPick={onPick}
                        isKnockout={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* KNOCKOUT ROUNDS */}
      {activeRound !== 'groups' && (
        <KnockoutRoundView
          roundId={activeRound}
          picks={picks}
          odds={odds}
          results={results}
          onPick={onPick}
          knockoutMatches={knockoutMatches}
          balance={balance}
          onWagerChange={onWagerChange}
        />
      )}
    </div>
  );
}

// Knockout round sub-component
function KnockoutRoundView({ roundId, picks, odds, results, onPick, knockoutMatches, balance, onWagerChange }) {
  const roundIds = roundId === 'F' ? ['3P', 'F'] : [roundId];

  return (
    <div>
      {roundIds.map(rId => {
        const info = KNOCKOUT_ROUNDS.find(r => r.id === rId);
        const slots = KNOCKOUT_MATCH_SLOTS.filter(s => s.round === rId);
        const populatedMatches = knockoutMatches?.filter(m => m.round === rId) || [];

        return (
          <div key={rId} className="mb-4">
            <div className="text-center py-3">
              <p className="text-xs font-bold text-text-primary tracking-wider">{info?.name}</p>
              <p className="text-[10px] text-text-muted">{slots.length} match{slots.length !== 1 ? 'es' : ''}</p>
            </div>

            <div className="space-y-2">
              {slots.map(slot => {
                const populated = populatedMatches.find(m => m.match_id === slot.id);

                if (populated && populated.home && populated.away) {
                  const match = {
                    id: slot.id,
                    home: populated.home,
                    away: populated.away,
                    kickoff: populated.kickoff || '2026-07-20T00:00:00Z',
                    venueShort: populated.venue || 'TBD',
                    date: populated.date || 'TBD',
                  };
                  return (
                    <MatchCard
                      key={slot.id}
                      match={match}
                      pick={picks[slot.id]}
                      odds={odds[slot.id]}
                      result={results[slot.id]}
                      onPick={onPick}
                      isKnockout={true}
                      balance={balance}
                      onWagerChange={onWagerChange}
                    />
                  );
                }

                return (
                  <div key={slot.id} className="bg-white rounded-xl border border-border border-dashed">
                    <div className="px-3 py-4">
                      <div className="text-center mb-2">
                        <span className="text-[9px] text-text-muted font-mono uppercase tracking-wider">
                          Match {slot.matchNum}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 flex flex-col items-center gap-1 py-2">
                          <span className="text-2xl opacity-30">🏳️</span>
                          <span className="text-[10px] text-text-muted font-medium">
                            {slot.source_home}
                          </span>
                        </div>
                        <div className="px-2">
                          <span className="text-[10px] font-bold text-text-muted">VS</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1 py-2">
                          <span className="text-2xl opacity-30">🏳️</span>
                          <span className="text-[10px] text-text-muted font-medium">
                            {slot.source_away}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
