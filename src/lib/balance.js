// Centralized balance calculations for the picks tracker

// Total points earned from correct picks (resolved matches only)
export function calculateTotalEarned(picks, results, odds) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    const result = results[matchId];
    if (!result) return total;
    const matchOdds = odds[matchId];
    if (!matchOdds) return total;
    if (pick.pick === result.result) {
      const oddsValue = pick.pick === 'home' ? matchOdds.home_odds
        : pick.pick === 'draw' ? matchOdds.draw_odds
        : matchOdds.away_odds;
      return total + (pick.wager || 1) * (oddsValue || 1);
    }
    return total;
  }, 0);
}

// Total points lost from incorrect knockout wagers (resolved knockout matches only)
export function calculateKnockoutLosses(picks, results) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    if (!pick.is_knockout) return total;
    const result = results[matchId];
    if (!result) return total;
    if (pick.pick !== result.result) {
      return total + (pick.wager || 1);
    }
    return total;
  }, 0);
}

// Total points currently wagered on unresolved knockout matches
export function calculatePendingWagers(picks, results) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    if (!pick.is_knockout) return total;
    if (results[matchId]) return total; // already resolved
    return total + (pick.wager || 1);
  }, 0);
}

// Available balance = earned - knockout losses - pending knockout wagers
export function calculateAvailableBalance(picks, results, odds) {
  const earned = calculateTotalEarned(picks, results, odds);
  const losses = calculateKnockoutLosses(picks, results);
  const pending = calculatePendingWagers(picks, results);
  return Math.max(0, earned - losses - pending);
}

// Display balance (what shows in the header) = earned - knockout losses
// This doesn't subtract pending wagers — those are "committed but not lost yet"
export function calculateDisplayBalance(picks, results, odds) {
  const earned = calculateTotalEarned(picks, results, odds);
  const losses = calculateKnockoutLosses(picks, results);
  return Math.max(0, earned - losses);
}

// Check if a user is eliminated (display balance is 0 and at least one knockout match has been played)
export function isEliminated(picks, results, odds) {
  const hasKnockoutResults = Object.entries(picks).some(
    ([matchId, pick]) => pick.is_knockout && results[matchId]
  );
  if (!hasKnockoutResults) return false;
  return calculateDisplayBalance(picks, results, odds) === 0;
}
