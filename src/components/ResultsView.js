'use client';

import { GROUP_MATCHES, FLAGS, SHORT_NAMES, formatMatchDate, formatKickoff } from '@/data/matches';

export default function ResultsView({ results, odds, picks }) {
  // Get decided matches, most recent first
  const decidedMatches = GROUP_MATCHES
    .filter(m => results[m.id])
    .sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff));

  const undecided = GROUP_MATCHES
    .filter(m => !results[m.id])
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));

  return (
    <div className="px-4 pb-24">
      <div className="text-center pt-4 pb-4">
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium mb-1">
          Results
        </p>
        <p className="text-[11px] text-text-muted">
          {decidedMatches.length} of 72 matches complete
        </p>
      </div>

      {decidedMatches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm text-text-muted">
            No results yet. The tournament starts June 11!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {decidedMatches.map(m => {
            const result = results[m.id];
            const pick = picks[m.id];
            const matchOdds = odds[m.id];
            const correct = pick && pick.pick === result.result;

            const winnerName = result.result === 'home' ? m.home
              : result.result === 'away' ? m.away
              : 'Draw';

            return (
              <div
                key={m.id}
                className={`rounded-xl border px-3 py-2.5 ${
                  correct ? 'bg-green-50/30 border-brand-green/30' :
                  pick ? 'bg-red-50/20 border-red-200/50' :
                  'bg-white border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-text-muted">
                    {formatMatchDate(m.date)} · Group {m.group}
                  </span>
                  {pick && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      correct ? 'bg-brand-green-light text-brand-green-dark' : 'bg-red-50 text-red-500'
                    }`}>
                      {correct ? '✓ CORRECT' : '✗ WRONG'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{FLAGS[m.home]}</span>
                    <span className={`text-xs font-semibold ${
                      result.result === 'home' ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {SHORT_NAMES[m.home]}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-text-primary font-mono">
                      {result.home_score ?? '-'} – {result.away_score ?? '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${
                      result.result === 'away' ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {SHORT_NAMES[m.away]}
                    </span>
                    <span className="text-lg">{FLAGS[m.away]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming */}
      {undecided.length > 0 && decidedMatches.length > 0 && (
        <div className="mt-6">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium mb-3">
            Upcoming ({undecided.length} matches)
          </p>
          <div className="space-y-1">
            {undecided.slice(0, 6).map(m => (
              <div key={m.id} className="flex items-center justify-between py-1.5 text-xs text-text-muted">
                <span>{FLAGS[m.home]} {SHORT_NAMES[m.home]} vs {SHORT_NAMES[m.away]} {FLAGS[m.away]}</span>
                <span className="font-mono text-[10px]">{formatMatchDate(m.date)}</span>
              </div>
            ))}
            {undecided.length > 6 && (
              <p className="text-[10px] text-text-muted text-center pt-1">
                +{undecided.length - 6} more matches
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
