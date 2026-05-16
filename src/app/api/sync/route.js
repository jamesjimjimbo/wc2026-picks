import { createClient } from '@supabase/supabase-js';

// API-Football team name mapping to our team names
const TEAM_NAME_MAP = {
  'Mexico': 'Mexico', 'South Korea': 'South Korea', 'South Africa': 'South Africa',
  'Czech Republic': 'Czechia', 'Czechia': 'Czechia',
  'Canada': 'Canada', 'Bosnia And Herzegovina': 'Bosnia and Herzegovina',
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
  'Qatar': 'Qatar', 'Switzerland': 'Switzerland',
  'Brazil': 'Brazil', 'Morocco': 'Morocco', 'Haiti': 'Haiti', 'Scotland': 'Scotland',
  'USA': 'United States', 'United States': 'United States',
  'Paraguay': 'Paraguay', 'Australia': 'Australia', 'Turkey': 'Türkiye', 'Türkiye': 'Türkiye',
  'Germany': 'Germany', 'Curacao': 'Curaçao', 'Curaçao': 'Curaçao',
  'Ivory Coast': 'Ivory Coast', 'Cote D Ivoire': 'Ivory Coast', "Cote d'Ivoire": 'Ivory Coast',
  'Ecuador': 'Ecuador',
  'Netherlands': 'Netherlands', 'Japan': 'Japan', 'Sweden': 'Sweden', 'Tunisia': 'Tunisia',
  'Belgium': 'Belgium', 'Egypt': 'Egypt', 'Iran': 'Iran', 'New Zealand': 'New Zealand',
  'Spain': 'Spain', 'Cape Verde': 'Cape Verde', 'Cabo Verde': 'Cape Verde',
  'Saudi Arabia': 'Saudi Arabia', 'Uruguay': 'Uruguay',
  'France': 'France', 'Senegal': 'Senegal', 'Iraq': 'Iraq', 'Norway': 'Norway',
  'Argentina': 'Argentina', 'Algeria': 'Algeria', 'Austria': 'Austria', 'Jordan': 'Jordan',
  'Portugal': 'Portugal', 'DR Congo': 'DR Congo', 'Congo DR': 'DR Congo',
  'Uzbekistan': 'Uzbekistan', 'Colombia': 'Colombia',
  'England': 'England', 'Croatia': 'Croatia', 'Ghana': 'Ghana', 'Panama': 'Panama',
};

// Our match data (duplicated here for the server-side route)
const GROUP_MATCHES = [
  { id: "A1", date: "2026-06-11", home: "Mexico", away: "South Africa" },
  { id: "A2", date: "2026-06-12", home: "South Korea", away: "Czechia" },
  { id: "A3", date: "2026-06-18", home: "Czechia", away: "South Africa" },
  { id: "A4", date: "2026-06-19", home: "Mexico", away: "South Korea" },
  { id: "A5", date: "2026-06-25", home: "Czechia", away: "Mexico" },
  { id: "A6", date: "2026-06-25", home: "South Africa", away: "South Korea" },
  { id: "B1", date: "2026-06-12", home: "Canada", away: "Bosnia and Herzegovina" },
  { id: "B2", date: "2026-06-13", home: "Qatar", away: "Switzerland" },
  { id: "B3", date: "2026-06-18", home: "Switzerland", away: "Bosnia and Herzegovina" },
  { id: "B4", date: "2026-06-18", home: "Canada", away: "Qatar" },
  { id: "B5", date: "2026-06-24", home: "Switzerland", away: "Canada" },
  { id: "B6", date: "2026-06-24", home: "Bosnia and Herzegovina", away: "Qatar" },
  { id: "C1", date: "2026-06-13", home: "Brazil", away: "Morocco" },
  { id: "C2", date: "2026-06-14", home: "Haiti", away: "Scotland" },
  { id: "C3", date: "2026-06-19", home: "Scotland", away: "Morocco" },
  { id: "C4", date: "2026-06-20", home: "Brazil", away: "Haiti" },
  { id: "C5", date: "2026-06-24", home: "Scotland", away: "Brazil" },
  { id: "C6", date: "2026-06-24", home: "Morocco", away: "Haiti" },
  { id: "D1", date: "2026-06-13", home: "United States", away: "Paraguay" },
  { id: "D2", date: "2026-06-13", home: "Australia", away: "Türkiye" },
  { id: "D3", date: "2026-06-19", home: "United States", away: "Australia" },
  { id: "D4", date: "2026-06-20", home: "Türkiye", away: "Paraguay" },
  { id: "D5", date: "2026-06-26", home: "Türkiye", away: "United States" },
  { id: "D6", date: "2026-06-26", home: "Paraguay", away: "Australia" },
  { id: "E1", date: "2026-06-14", home: "Germany", away: "Curaçao" },
  { id: "E2", date: "2026-06-14", home: "Ivory Coast", away: "Ecuador" },
  { id: "E3", date: "2026-06-20", home: "Germany", away: "Ivory Coast" },
  { id: "E4", date: "2026-06-21", home: "Ecuador", away: "Curaçao" },
  { id: "E5", date: "2026-06-25", home: "Curaçao", away: "Ivory Coast" },
  { id: "E6", date: "2026-06-25", home: "Ecuador", away: "Germany" },
  { id: "F1", date: "2026-06-14", home: "Netherlands", away: "Japan" },
  { id: "F2", date: "2026-06-15", home: "Sweden", away: "Tunisia" },
  { id: "F3", date: "2026-06-20", home: "Netherlands", away: "Sweden" },
  { id: "F4", date: "2026-06-21", home: "Tunisia", away: "Japan" },
  { id: "F5", date: "2026-06-25", home: "Japan", away: "Sweden" },
  { id: "F6", date: "2026-06-25", home: "Tunisia", away: "Netherlands" },
  { id: "G1", date: "2026-06-15", home: "Belgium", away: "Egypt" },
  { id: "G2", date: "2026-06-16", home: "Iran", away: "New Zealand" },
  { id: "G3", date: "2026-06-21", home: "Belgium", away: "Iran" },
  { id: "G4", date: "2026-06-22", home: "New Zealand", away: "Egypt" },
  { id: "G5", date: "2026-06-27", home: "Egypt", away: "Iran" },
  { id: "G6", date: "2026-06-27", home: "New Zealand", away: "Belgium" },
  { id: "H1", date: "2026-06-15", home: "Spain", away: "Cape Verde" },
  { id: "H2", date: "2026-06-15", home: "Saudi Arabia", away: "Uruguay" },
  { id: "H3", date: "2026-06-21", home: "Spain", away: "Saudi Arabia" },
  { id: "H4", date: "2026-06-21", home: "Uruguay", away: "Cape Verde" },
  { id: "H5", date: "2026-06-27", home: "Cape Verde", away: "Saudi Arabia" },
  { id: "H6", date: "2026-06-27", home: "Uruguay", away: "Spain" },
  { id: "I1", date: "2026-06-16", home: "France", away: "Senegal" },
  { id: "I2", date: "2026-06-16", home: "Iraq", away: "Norway" },
  { id: "I3", date: "2026-06-22", home: "France", away: "Iraq" },
  { id: "I4", date: "2026-06-23", home: "Norway", away: "Senegal" },
  { id: "I5", date: "2026-06-26", home: "Norway", away: "France" },
  { id: "I6", date: "2026-06-26", home: "Senegal", away: "Iraq" },
  { id: "J1", date: "2026-06-17", home: "Argentina", away: "Algeria" },
  { id: "J2", date: "2026-06-17", home: "Austria", away: "Jordan" },
  { id: "J3", date: "2026-06-22", home: "Argentina", away: "Austria" },
  { id: "J4", date: "2026-06-23", home: "Jordan", away: "Algeria" },
  { id: "J5", date: "2026-06-28", home: "Algeria", away: "Austria" },
  { id: "J6", date: "2026-06-28", home: "Jordan", away: "Argentina" },
  { id: "K1", date: "2026-06-17", home: "Portugal", away: "DR Congo" },
  { id: "K2", date: "2026-06-18", home: "Uzbekistan", away: "Colombia" },
  { id: "K3", date: "2026-06-23", home: "Portugal", away: "Uzbekistan" },
  { id: "K4", date: "2026-06-24", home: "Colombia", away: "DR Congo" },
  { id: "K5", date: "2026-06-27", home: "Colombia", away: "Portugal" },
  { id: "K6", date: "2026-06-27", home: "DR Congo", away: "Uzbekistan" },
  { id: "L1", date: "2026-06-17", home: "England", away: "Croatia" },
  { id: "L2", date: "2026-06-17", home: "Ghana", away: "Panama" },
  { id: "L3", date: "2026-06-23", home: "England", away: "Ghana" },
  { id: "L4", date: "2026-06-23", home: "Panama", away: "Croatia" },
  { id: "L5", date: "2026-06-27", home: "Panama", away: "England" },
  { id: "L6", date: "2026-06-27", home: "Croatia", away: "Ghana" },
];

function normalizeTeam(name) {
  return TEAM_NAME_MAP[name] || name;
}

// Match API-Football fixture to our match by home/away team names
function findOurMatch(apiHome, apiAway) {
  const home = normalizeTeam(apiHome);
  const away = normalizeTeam(apiAway);
  return GROUP_MATCHES.find(m => m.home === home && m.away === away);
}

export async function GET(request) {
  // Verify this is called with the right secret (cron job or admin)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Allow if it's a Vercel cron (has the right header) or has our secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Also allow if called from admin panel with API key
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (key !== cronSecret && !url.searchParams.has('admin')) {
      // For now, allow all requests during development
      // In production, uncomment: return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const API_KEY = process.env.API_FOOTBALL_KEY;
  if (!API_KEY) {
    return Response.json({ error: 'API_FOOTBALL_KEY not configured' }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results = { odds_updated: 0, results_updated: 0, errors: [], fixtures_checked: 0 };

  try {
    // Fetch all WC2026 fixtures from API-Football
    const fixturesRes = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      { headers: { 'x-apisports-key': API_KEY } }
    );
    const fixturesData = await fixturesRes.json();

    if (fixturesData.errors && Object.keys(fixturesData.errors).length > 0) {
      return Response.json({
        error: 'API-Football error',
        details: fixturesData.errors,
        hint: 'You may need a paid plan for the 2026 season'
      }, { status: 400 });
    }

    const fixtures = fixturesData.response || [];
    results.fixtures_checked = fixtures.length;

    for (const fixture of fixtures) {
      const homeTeam = fixture.teams?.home?.name;
      const awayTeam = fixture.teams?.away?.name;
      const ourMatch = findOurMatch(homeTeam, awayTeam);

      if (!ourMatch) continue; // Not a group stage match we track, or name mismatch

      const matchId = ourMatch.id;
      const status = fixture.fixture?.status?.short; // NS, 1H, HT, 2H, FT, AET, PEN

      // --- SYNC RESULTS ---
      // If the match is finished (FT, AET, PEN), update results
      if (['FT', 'AET', 'PEN'].includes(status)) {
        const homeScore = fixture.goals?.home;
        const awayScore = fixture.goals?.away;

        let result;
        if (homeScore > awayScore) result = 'home';
        else if (awayScore > homeScore) result = 'away';
        else result = 'draw';

        const { error } = await supabase.from('match_results').upsert({
          match_id: matchId,
          result,
          home_score: homeScore,
          away_score: awayScore,
        }, { onConflict: 'match_id' });

        if (error) results.errors.push({ matchId, type: 'result', error: error.message });
        else results.results_updated++;
      }
    }

    // --- SYNC ODDS ---
    // Fetch odds for upcoming matches (separate API call)
    // Get today's date and next 3 days of matches
    const today = new Date();
    const upcoming = GROUP_MATCHES.filter(m => {
      const kickoff = new Date(m.date + 'T00:00:00Z');
      const diffDays = (kickoff - today) / (1000 * 60 * 60 * 24);
      return diffDays >= -1 && diffDays <= 3; // Yesterday through 3 days ahead
    });

    if (upcoming.length > 0) {
      // Fetch odds from API-Football
      const oddsRes = await fetch(
        'https://v3.football.api-sports.io/odds?league=1&season=2026&bookmaker=8', // bookmaker 8 = Bet365
        { headers: { 'x-apisports-key': API_KEY } }
      );
      const oddsData = await oddsRes.json();

      if (oddsData.response) {
        for (const oddsFixture of oddsData.response) {
          const fixtureId = oddsFixture.fixture?.id;
          
          // Find the matching fixture to get team names
          const matchingFixture = fixtures.find(f => f.fixture?.id === fixtureId);
          if (!matchingFixture) continue;

          const homeTeam = matchingFixture.teams?.home?.name;
          const awayTeam = matchingFixture.teams?.away?.name;
          const ourMatch = findOurMatch(homeTeam, awayTeam);
          if (!ourMatch) continue;

          // Find the Match Winner market (bet id 1)
          const bookmakers = oddsFixture.bookmakers || [];
          for (const bookie of bookmakers) {
            const matchWinner = bookie.bets?.find(b => b.id === 1 || b.name === 'Match Winner');
            if (!matchWinner) continue;

            const values = matchWinner.values || [];
            const homeOdds = parseFloat(values.find(v => v.value === 'Home')?.odd || 0);
            const drawOdds = parseFloat(values.find(v => v.value === 'Draw')?.odd || 0);
            const awayOdds = parseFloat(values.find(v => v.value === 'Away')?.odd || 0);

            if (homeOdds > 0 && drawOdds > 0 && awayOdds > 0) {
              const { error } = await supabase.from('match_odds').upsert({
                match_id: ourMatch.id,
                home_odds: homeOdds,
                draw_odds: drawOdds,
                away_odds: awayOdds,
                source: bookie.name || 'API-Football',
              }, { onConflict: 'match_id' });

              if (error) results.errors.push({ matchId: ourMatch.id, type: 'odds', error: error.message });
              else results.odds_updated++;
            }
            break; // Only need one bookmaker per match
          }
        }
      }
    }

  } catch (e) {
    results.errors.push({ type: 'general', error: e.message });
  }

  return Response.json(results);
}
