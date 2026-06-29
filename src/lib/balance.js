// Centralized balance calculations for the picks tracker
//
// Group stage: correct = wager × odds, wrong = 0
// Knockout: correct = (wager × odds) - wager (net profit), wrong = -wager (lose stake)

// Total balance from all resolved picks
export function calculateTotalEarned(picks, results, odds) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    const result = results[matchId];
    if (!result || !result.result) return total;
    const matchOdds = odds[matchId];
    if (!matchOdds) return total;
    const wager = pick.wager ?? 1;

    if (pick.pick === result.result) {
      // Correct pick
      const oddsValue = pick.pick === 'home' ? matchOdds.home_odds
        : pick.pick === 'draw' ? matchOdds.draw_odds
        : matchOdds.away_odds;
      if (pick.is_knockout) {
        // Knockout: profit = (wager × odds) - wager
        return total + (wager * (oddsValue || 1)) - wager;
      } else {
        // Group: full payout = wager × odds (no deduction)
        return total + wager * (oddsValue || 1);
      }
    } else {
      // Wrong pick
      if (pick.is_knockout) {
        // Knockout: lose the wager
        return total - wager;
      }
      // Group: no penalty
      return total;
    }
  }, 0);
}

// Total points currently wagered on unresolved knockout matches
export function calculatePendingWagers(picks, results) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    if (!pick.is_knockout) return total;
    const result = results[matchId];
    if (result && result.result) return total;
    return total + (pick.wager ?? 1);
  }, 0);
}

// Available balance = total earned - pending knockout wagers
export function calculateAvailableBalance(picks, results, odds) {
  const earned = calculateTotalEarned(picks, results, odds);
  const pending = calculatePendingWagers(picks, results);
  return Math.max(0, earned - pending);
}

// Display balance (what shows in the header) = total earned
export function calculateDisplayBalance(picks, results, odds) {
  const earned = calculateTotalEarned(picks, results, odds);
  return Math.max(0, earned);
}

// Check if a user is eliminated
export function isEliminated(picks, results, odds) {
  const hasKnockoutResults = Object.entries(picks).some(
    ([matchId, pick]) => pick.is_knockout && results[matchId]?.result
  );
  if (!hasKnockoutResults) return false;
  return calculateDisplayBalance(picks, results, odds) === 0;
}
