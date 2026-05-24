'use client';

export default function RulesView({ onClose }) {
  return (
    <div className="px-4 pb-24">
      <div className="text-center pt-4 pb-4">
        <p className="text-3xl mb-2">⚽</p>
        <h2 className="text-lg font-bold text-text-primary">How to Play</h2>
        <p className="text-[11px] text-text-muted mt-1">World Cup 2026 Picks Tracker</p>
      </div>

      <div className="space-y-4">
        {/* The Basics */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">🎯 The Basics</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Predict the winner of every World Cup match. For each match, pick Home, Draw, or Away. 
            If you're right, you earn points based on the odds. The harder the pick, the more points you earn.
          </p>
        </div>

        {/* Group Stage */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">📋 Group Stage (72 matches)</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Every match costs 1 point automatically — you don't choose how much to wager. 
            If your pick is correct, you earn points equal to the decimal odds at kickoff.
          </p>
          <div className="mt-3 bg-white rounded-lg p-3">
            <p className="text-[11px] text-text-primary font-semibold mb-1">Example:</p>
            <p className="text-[11px] text-text-secondary">
              Brazil vs Haiti — Brazil's odds are 1.10, Draw is 8.00, Haiti is 25.00. 
              Pick Brazil and you're right? You earn 1.10 pts. Pick Haiti and they pull off the upset? 
              You earn 25.00 pts. The safe pick pays less, the bold pick pays more.
            </p>
          </div>
        </div>

        {/* Timing */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">⏰ When to Pick</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Picks lock at kickoff for each individual match — not all at once. You can make your picks 
            anytime before a match starts. Change your mind? Just tap a different outcome before kickoff.
          </p>
          <p className="text-[12px] text-text-secondary leading-relaxed mt-2">
            You don't have to pick every match right away. But don't forget — once kickoff hits, 
            that match is locked.
          </p>
        </div>

        {/* Odds */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">📊 How Odds Work</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Odds are displayed in decimal format on each match card. Everyone gets scored against the 
            same closing odds, regardless of when you made your pick. Odds are updated close to kickoff.
          </p>
          <div className="mt-3 flex gap-3">
            <div className="flex-1 bg-white rounded-lg p-2 text-center">
              <p className="text-[10px] text-text-muted">Favorite</p>
              <p className="text-sm font-bold font-mono text-text-primary">1.30</p>
              <p className="text-[9px] text-text-muted">Low risk, low reward</p>
            </div>
            <div className="flex-1 bg-white rounded-lg p-2 text-center">
              <p className="text-[10px] text-text-muted">Draw</p>
              <p className="text-sm font-bold font-mono text-text-primary">4.50</p>
              <p className="text-[9px] text-text-muted">Medium risk</p>
            </div>
            <div className="flex-1 bg-white rounded-lg p-2 text-center">
              <p className="text-[10px] text-text-muted">Underdog</p>
              <p className="text-sm font-bold font-mono text-text-primary">12.00</p>
              <p className="text-[9px] text-text-muted">High risk, big payout</p>
            </div>
          </div>
        </div>

        {/* Standings */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">🏆 Standings</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Your total points are the sum of all your correct pick payouts. Check the Standings tab to see 
            how you rank against everyone in your league. Tap any player to see their picks 
            (only visible after matches kick off).
          </p>
        </div>

        {/* Leagues */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">👥 Leagues</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            You make picks once, and they count across all your leagues. Each league has its own 
            standings. If you're in multiple leagues, use the switcher in the header to see different 
            leaderboards.
          </p>
        </div>

        {/* Knockout Rounds */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-xs font-bold text-text-primary mb-2">🏅 Knockout Rounds (coming soon)</p>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Once the group stage ends, knockout rounds begin. In knockouts, you choose how many points 
            to wager from your accumulated balance. Bigger bets, bigger potential payouts. If you 
            miss a knockout pick, 1 point is auto-bet on the favorite.
          </p>
        </div>

        {/* Quick Tips */}
        <div className="bg-brand-green-bg rounded-xl p-4">
          <p className="text-xs font-bold text-brand-green-dark mb-2">💡 Quick Tips</p>
          <div className="text-[12px] text-brand-green-dark/80 space-y-1.5">
            <p>• Picking all favorites is safe but won't win you the league</p>
            <p>• A few well-timed underdog picks can vault you to the top</p>
            <p>• Draws pay well and happen more than you'd think at a World Cup</p>
            <p>• Don't overthink it — have fun!</p>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            Got it — let's go!
          </button>
        </div>
      )}
    </div>
  );
}
