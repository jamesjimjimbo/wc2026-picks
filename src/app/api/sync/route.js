import { createClient } from '@supabase/supabase-js';

// API-Football team name → our team name mapping
// These are the EXACT names the API returns (verified June 2026)
const TEAM_NAME_MAP = {
  'Mexico': 'Mexico', 'South Korea': 'South Korea', 'South Africa': 'South Africa',
  'Czech Republic': 'Czechia',
  'Canada': 'Canada', 'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Qatar': 'Qatar', 'Switzerland': 'Switzerland',
  'Brazil': 'Brazil', 'Morocco': 'Morocco', 'Haiti': 'Haiti', 'Scotland': 'Scotland',
  'USA': 'United States',
  'Paraguay': 'Paraguay', 'Australia': 'Australia', 'Türkiye': 'Türkiye',
  'Germany': 'Germany', 'Curaçao': 'Curaçao',
  'Ivory Coast': 'Ivory Coast', 'Ecuador': 'Ecuador',
  'Netherlands': 'Netherlands', 'Japan': 'Japan', 'Sweden': 'Sweden', 'Tunisia': 'Tunisia',
  'Belgium': 'Belgium', 'Egypt': 'Egypt', 'Iran': 'Iran', 'New Zealand': 'New Zealand',
  'Spain': 'Spain', 'Cape Verde Islands': 'Cape Verde',
  'Saudi Arabia': 'Saudi Arabia', 'Uruguay': 'Uruguay',
  'France': 'France', 'Senegal': 'Senegal', 'Iraq': 'Iraq', 'Norway': 'Norway',
  'Argentina': 'Argentina', 'Algeria': 'Algeria', 'Austria': 'Austria', 'Jordan': 'Jordan',
  'Portugal': 'Portugal', 'Congo DR': 'DR Congo',
  'Uzbekistan': 'Uzbekistan', 'Colombia': 'Colombia',
  'England': 'England', 'Croatia': 'Croatia', 'Ghana': 'Ghana', 'Panama': 'Panama',
};

// All 72 group stage matches
const GROUP_MATCHES = [
  { id: "A1", home: "Mexico", away: "South Africa" },
  { id: "A2", home: "South Korea", away: "Czechia" },
  { id: "A3", home: "Czechia", away: "South Africa" },
  { id: "A4", home: "Mexico", away: "South Korea" },
  { id: "A5", home: "Czechia", away: "Mexico" },
  { id: "A6", home: "South Africa", away: "South Korea" },
  { id: "B1", home: "Canada", away: "Bosnia and Herzegovina" },
  { id: "B2", home: "Qatar", away: "Switzerland" },
  { id: "B3", home: "Switzerland", away: "Bosnia and Herzegovina" },
  { id: "B4", home: "Canada", away: "Qatar" },
  { id: "B5", home: "Switzerland", away: "Canada" },
  { id: "B6", home: "Bosnia and Herzegovina", away: "Qatar" },
  { id: "C1", home: "Brazil", away: "Morocco" },
  { id: "C2", home: "Haiti", away: "Scotland" },
  { id: "C3", home: "Scotland", away: "Morocco" },
  { id: "C4", home: "Brazil", away: "Haiti" },
  { id: "C5", home: "Scotland", away: "Brazil" },
  { id: "C6", home: "Morocco", away: "Haiti" },
  { id: "D1", home: "United States", away: "Paraguay" },
  { id: "D2", home: "Australia", away: "Türkiye" },
  { id: "D3", home: "United States", away: "Australia" },
  { id: "D4", home: "Türkiye", away: "Paraguay" },
  { id: "D5", home: "Türkiye", away: "United States" },
  { id: "D6", home: "Paraguay", away: "Australia" },
  { id: "E1", home: "Germany", away: "Curaçao" },
  { id: "E2", home: "Ivory Coast", away: "Ecuador" },
  { id: "E3", home: "Germany", away: "Ivory Coast" },
  { id: "E4", home: "Ecuador", away: "Curaçao" },
  { id: "E5", home: "Curaçao", away: "Ivory Coast" },
  { id: "E6", home: "Ecuador", away: "Germany" },
  { id: "F1", home: "Netherlands", away: "Japan" },
  { id: "F2", home: "Sweden", away: "Tunisia" },
  { id: "F3", home: "Netherlands", away: "Sweden" },
  { id: "F4", home: "Tunisia", away: "Japan" },
  { id: "F5", home: "Japan", away: "Sweden" },
  { id: "F6", home: "Tunisia", away: "Netherlands" },
  { id: "G1", home: "Belgium", away: "Egypt" },
  { id: "G2", home: "Iran", away: "New Zealand" },
  { id: "G3", home: "Belgium", away: "Iran" },
  { id: "G4", home: "New Zealand", away: "Egypt" },
  { id: "G5", home: "Egypt", away: "Iran" },
  { id: "G6", home: "New Zealand", away: "Belgium" },
  { id: "H1", home: "Spain", away: "Cape Verde" },
  { id: "H2", home: "Saudi Arabia", away: "Uruguay" },
  { id: "H3", home: "Spain", away: "Saudi Arabia" },
  { id: "H4", home: "Uruguay", away: "Cape Verde" },
  { id: "H5", home: "Cape Verde", away: "Saudi Arabia" },
  { id: "H6", home: "Uruguay", away: "Spain" },
  { id: "I1", home: "France", away: "Senegal" },
  { id: "I2", home: "Iraq", away: "Norway" },
  { id: "I3", home: "France", away: "Iraq" },
  { id: "I4", home: "Norway", away: "Senegal" },
  { id: "I5", home: "Norway", away: "France" },
  { id: "I6", home: "Senegal", away: "Iraq" },
  { id: "J1", home: "Argentina", away: "Algeria" },
  { id: "J2", home: "Austria", away: "Jordan" },
  { id: "J3", home: "Argentina", away: "Austria" },
  { id: "J4", home: "Jordan", away: "Algeria" },
  { id: "J5", home: "Algeria", away: "Austria" },
  { id: "J6", home: "Jordan", away: "Argentina" },
  { id: "K1", home: "Portugal", away: "DR Congo" },
  { id: "K2", home: "Uzbekistan", away: "Colombia" },
  { id: "K3", home: "Portugal", away: "Uzbekistan" },
  { id: "K4", home: "Colombia", away: "DR Congo" },
  { id: "K5", home: "Colombia", away: "Portugal" },
  { id: "K6", home: "DR Congo", away: "Uzbekistan" },
  { id: "L1", home: "England", away: "Croatia" },
  { id: "L2", home: "Ghana", away: "Panama" },
  { id: "L3", home: "England", away: "Ghana" },
  { id: "L4", home: "Panama", away: "Croatia" },
  { id: "L5", home: "Panama", away: "England" },
  { id: "L6", home: "Croatia", away: "Ghana" },
];

function normalizeTeam(name) {
  return TEAM_NAME_MAP[name] || name;
}

function findOurMatch(apiHome, apiAway) {
  const home = normalizeTeam(apiHome);
  const away = normalizeTeam(apiAway);
  return GROUP_MATCHES.find(m => m.home === home && m.away === away);
}

export async function GET(request) {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  if (!API_KEY) {
    return Response.json({ error: 'API_FOOTBALL_KEY not configured' }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results = { odds_updated: 0, results_updated: 0, errors: [], fixtures_checked: 0, matches_mapped: 0 };

  try {
    // Fetch all WC2026 fixtures
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

    // Build fixture-to-match mapping
    const fixtureMatchMap = {};
    for (const fixture of fixtures) {
      const homeTeam = fixture.teams?.home?.name;
      const awayTeam = fixture.teams?.away?.name;
      const ourMatch = findOurMatch(homeTeam, awayTeam);
      if (ourMatch) {
        fixtureMatchMap[fixture.fixture.id] = ourMatch;
        results.matches_mapped++;
      }
    }

    // --- SYNC RESULTS ---
    for (const fixture of fixtures) {
      const ourMatch = fixtureMatchMap[fixture.fixture.id];
      if (!ourMatch) continue;

      const status = fixture.fixture?.status?.short;
      if (['FT', 'AET', 'PEN'].includes(status)) {
        const homeScore = fixture.goals?.home;
        const awayScore = fixture.goals?.away;

        let result;
        if (homeScore > awayScore) result = 'home';
        else if (awayScore > homeScore) result = 'away';
        else result = 'draw';

        const { error } = await supabase.from('match_results').upsert({
          match_id: ourMatch.id,
          result,
          home_score: homeScore,
          away_score: awayScore,
        }, { onConflict: 'match_id' });

        if (error) results.errors.push({ matchId: ourMatch.id, type: 'result', error: error.message });
        else results.results_updated++;
      }
    }

    // --- SYNC ODDS ---
    // Pull all odds in one API call (saves rate limit)
    const oddsRes = await fetch(
      'https://v3.football.api-sports.io/odds?league=1&season=2026&bookmaker=8',
      { headers: { 'x-apisports-key': API_KEY } }
    );
    const oddsData = await oddsRes.json();

    if (oddsData.response && oddsData.response.length > 0) {
      for (const oddsFixture of oddsData.response) {
        const fixtureId = oddsFixture.fixture?.id;
        const ourMatch = fixtureMatchMap[fixtureId];
        if (!ourMatch) continue;

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
          break;
        }
      }
    }

  } catch (e) {
    results.errors.push({ type: 'general', error: e.message });
  }

  return Response.json(results);
}
