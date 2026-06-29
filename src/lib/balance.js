// Centralized balance calculations for the picks tracker
//
// How scoring works:
// - Every pick costs its wager amount (1pt for groups, variable for knockouts)
// - If correct: you get back wager × odds (so net profit = wager × (odds - 1))
// - If wrong: you lose the wager
// - Balance = sum of all net results across all matches

// Calculate total balance from all resolved picks
// For each resolved match:
//   correct pick: + wager × odds - wager  (you get payout minus cost)
//   wrong pick:   - wager                  (you lose your stake)
// For unresolved: no effect on balance yet (pending wagers tracked separately)
export function calculateTotalEarned(picks, results, odds) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    const result = results[matchId];
    if (!result || !result.result) return total; // not yet decided
    const matchOdds = odds[matchId];
    if (!matchOdds) return total;
    const wager = pick.wager ?? 1;

    if (pick.pick === result.result) {
      // Correct: net profit = (wager × odds) - wager
      const oddsValue = pick.pick === 'home' ? matchOdds.home_odds
        : pick.pick === 'draw' ? matchOdds.draw_odds
        : matchOdds.away_odds;
      return total + (wager * (oddsValue || 1)) - wager;
    } else {
      // Wrong: lose the wager
      return total - wager;
    }
  }, 0);
}

// Total points currently wagered on unresolved knockout matches
export function calculatePendingWagers(picks, results) {
  return Object.entries(picks).reduce((total, [matchId, pick]) => {
    if (!pick.is_knockout) return total;
    const result = results[matchId];
    if (result && result.result) return total; // already resolved
    return total + (pick.wager ?? 1);
  }, 0);
}

// Available balance = total earned - pending knockout wagers
export function calculateAvailableBalance(picks, results, odds) {
  const earned = calculateTotalEarned(picks, results, odds);
  const pending = calculatePendingWagers(picks, results);
  return Math.max(0, earned - pending);
}

// Display balance (what shows in the header) = total earned (not subtracting pending)
export function calculateDisplayBalance(picks, results, odds) {
  const earned = calculateTotalEarned(picks, results, odds);
  return Math.max(0, earned);
}

// Check if a user is eliminated (balance is 0 and at least one knockout match has been decided)
export function isEliminated(picks, results, odds) {
  const hasKnockoutResults = Object.entries(picks).some(
    ([matchId, pick]) => pick.is_knockout && results[matchId]?.result
  );
  if (!hasKnockoutResults) return false;
  return calculateDisplayBalance(picks, results, odds) === 0;
}
