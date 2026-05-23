// FIFA World Cup 2026 — Complete Match Data
// 72 group stage matches across 12 groups of 4

export const FLAGS = {
  "Mexico": "🇲🇽", "South Korea": "🇰🇷", "South Africa": "🇿🇦", "Czechia": "🇨🇿",
  "Canada": "🇨🇦", "Bosnia and Herzegovina": "🇧🇦", "Qatar": "🇶🇦", "Switzerland": "🇨🇭",
  "Brazil": "🇧🇷", "Morocco": "🇲🇦", "Haiti": "🇭🇹", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "United States": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Türkiye": "🇹🇷",
  "Germany": "🇩🇪", "Curaçao": "🇨🇼", "Ivory Coast": "🇨🇮", "Ecuador": "🇪🇨",
  "Netherlands": "🇳🇱", "Japan": "🇯🇵", "Sweden": "🇸🇪", "Tunisia": "🇹🇳",
  "Belgium": "🇧🇪", "Egypt": "🇪🇬", "Iran": "🇮🇷", "New Zealand": "🇳🇿",
  "Spain": "🇪🇸", "Cape Verde": "🇨🇻", "Saudi Arabia": "🇸🇦", "Uruguay": "🇺🇾",
  "France": "🇫🇷", "Senegal": "🇸🇳", "Iraq": "🇮🇶", "Norway": "🇳🇴",
  "Argentina": "🇦🇷", "Algeria": "🇩🇿", "Austria": "🇦🇹", "Jordan": "🇯🇴",
  "Portugal": "🇵🇹", "DR Congo": "🇨🇩", "Uzbekistan": "🇺🇿", "Colombia": "🇨🇴",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatia": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦",
};

export const SHORT_NAMES = {
  "Mexico": "MEX", "South Korea": "KOR", "South Africa": "RSA", "Czechia": "CZE",
  "Canada": "CAN", "Bosnia and Herzegovina": "BIH", "Qatar": "QAT", "Switzerland": "SUI",
  "Brazil": "BRA", "Morocco": "MAR", "Haiti": "HAI", "Scotland": "SCO",
  "United States": "USA", "Paraguay": "PAR", "Australia": "AUS", "Türkiye": "TUR",
  "Germany": "GER", "Curaçao": "CUW", "Ivory Coast": "CIV", "Ecuador": "ECU",
  "Netherlands": "NED", "Japan": "JPN", "Sweden": "SWE", "Tunisia": "TUN",
  "Belgium": "BEL", "Egypt": "EGY", "Iran": "IRN", "New Zealand": "NZL",
  "Spain": "ESP", "Cape Verde": "CPV", "Saudi Arabia": "KSA", "Uruguay": "URU",
  "France": "FRA", "Senegal": "SEN", "Iraq": "IRQ", "Norway": "NOR",
  "Argentina": "ARG", "Algeria": "ALG", "Austria": "AUT", "Jordan": "JOR",
  "Portugal": "POR", "DR Congo": "COD", "Uzbekistan": "UZB", "Colombia": "COL",
  "England": "ENG", "Croatia": "CRO", "Ghana": "GHA", "Panama": "PAN",
};

export const GROUPS = {
  A: ["Mexico", "South Korea", "South Africa", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

// All 72 group stage matches
// kickoff is ISO 8601 UTC — convert to local in the UI
export const GROUP_MATCHES = [
  // Group A
  { id: "A1", group: "A", date: "2026-06-11", kickoff: "2026-06-11T19:00:00Z", home: "Mexico", away: "South Africa", venue: "Mexico City", venueShort: "Estadio Azteca" },
  { id: "A2", group: "A", date: "2026-06-12", kickoff: "2026-06-12T02:00:00Z", home: "South Korea", away: "Czechia", venue: "Guadalajara", venueShort: "Estadio Akron" },
  { id: "A3", group: "A", date: "2026-06-18", kickoff: "2026-06-18T16:00:00Z", home: "Czechia", away: "South Africa", venue: "Atlanta", venueShort: "Mercedes-Benz" },
  { id: "A4", group: "A", date: "2026-06-19", kickoff: "2026-06-19T01:00:00Z", home: "Mexico", away: "South Korea", venue: "Guadalajara", venueShort: "Estadio Akron" },
  { id: "A5", group: "A", date: "2026-06-25", kickoff: "2026-06-25T01:00:00Z", home: "Czechia", away: "Mexico", venue: "Mexico City", venueShort: "Estadio Azteca" },
  { id: "A6", group: "A", date: "2026-06-25", kickoff: "2026-06-25T01:00:00Z", home: "South Africa", away: "South Korea", venue: "Monterrey", venueShort: "Estadio BBVA" },

  // Group B
  { id: "B1", group: "B", date: "2026-06-12", kickoff: "2026-06-12T19:00:00Z", home: "Canada", away: "Bosnia and Herzegovina", venue: "Toronto", venueShort: "BMO Field" },
  { id: "B2", group: "B", date: "2026-06-13", kickoff: "2026-06-13T19:00:00Z", home: "Qatar", away: "Switzerland", venue: "Santa Clara", venueShort: "Levi's Stadium" },
  { id: "B3", group: "B", date: "2026-06-18", kickoff: "2026-06-18T19:00:00Z", home: "Switzerland", away: "Bosnia and Herzegovina", venue: "Inglewood", venueShort: "SoFi Stadium" },
  { id: "B4", group: "B", date: "2026-06-18", kickoff: "2026-06-18T22:00:00Z", home: "Canada", away: "Qatar", venue: "Vancouver", venueShort: "BC Place" },
  { id: "B5", group: "B", date: "2026-06-24", kickoff: "2026-06-24T19:00:00Z", home: "Switzerland", away: "Canada", venue: "Vancouver", venueShort: "BC Place" },
  { id: "B6", group: "B", date: "2026-06-24", kickoff: "2026-06-24T19:00:00Z", home: "Bosnia and Herzegovina", away: "Qatar", venue: "Seattle", venueShort: "Lumen Field" },

  // Group C
  { id: "C1", group: "C", date: "2026-06-13", kickoff: "2026-06-13T22:00:00Z", home: "Brazil", away: "Morocco", venue: "East Rutherford", venueShort: "MetLife Stadium" },
  { id: "C2", group: "C", date: "2026-06-14", kickoff: "2026-06-14T01:00:00Z", home: "Haiti", away: "Scotland", venue: "Foxboro", venueShort: "Gillette Stadium" },
  { id: "C3", group: "C", date: "2026-06-19", kickoff: "2026-06-19T22:00:00Z", home: "Scotland", away: "Morocco", venue: "Foxboro", venueShort: "Gillette Stadium" },
  { id: "C4", group: "C", date: "2026-06-20", kickoff: "2026-06-20T00:30:00Z", home: "Brazil", away: "Haiti", venue: "Philadelphia", venueShort: "Lincoln Financial" },
  { id: "C5", group: "C", date: "2026-06-24", kickoff: "2026-06-24T22:00:00Z", home: "Scotland", away: "Brazil", venue: "Miami", venueShort: "Hard Rock Stadium" },
  { id: "C6", group: "C", date: "2026-06-24", kickoff: "2026-06-24T22:00:00Z", home: "Morocco", away: "Haiti", venue: "Atlanta", venueShort: "Mercedes-Benz" },

  // Group D
  { id: "D1", group: "D", date: "2026-06-13", kickoff: "2026-06-13T01:00:00Z", home: "United States", away: "Paraguay", venue: "Inglewood", venueShort: "SoFi Stadium" },
  { id: "D2", group: "D", date: "2026-06-13", kickoff: "2026-06-13T04:00:00Z", home: "Australia", away: "Türkiye", venue: "Vancouver", venueShort: "BC Place" },
  { id: "D3", group: "D", date: "2026-06-19", kickoff: "2026-06-19T19:00:00Z", home: "United States", away: "Australia", venue: "Seattle", venueShort: "Lumen Field" },
  { id: "D4", group: "D", date: "2026-06-20", kickoff: "2026-06-20T03:00:00Z", home: "Türkiye", away: "Paraguay", venue: "Santa Clara", venueShort: "Levi's Stadium" },
  { id: "D5", group: "D", date: "2026-06-26", kickoff: "2026-06-26T02:00:00Z", home: "Türkiye", away: "United States", venue: "Inglewood", venueShort: "SoFi Stadium" },
  { id: "D6", group: "D", date: "2026-06-26", kickoff: "2026-06-26T02:00:00Z", home: "Paraguay", away: "Australia", venue: "Santa Clara", venueShort: "Levi's Stadium" },

  // Group E
  { id: "E1", group: "E", date: "2026-06-14", kickoff: "2026-06-14T17:00:00Z", home: "Germany", away: "Curaçao", venue: "Houston", venueShort: "NRG Stadium" },
  { id: "E2", group: "E", date: "2026-06-14", kickoff: "2026-06-14T23:00:00Z", home: "Ivory Coast", away: "Ecuador", venue: "Philadelphia", venueShort: "Lincoln Financial" },
  { id: "E3", group: "E", date: "2026-06-20", kickoff: "2026-06-20T20:00:00Z", home: "Germany", away: "Ivory Coast", venue: "Toronto", venueShort: "BMO Field" },
  { id: "E4", group: "E", date: "2026-06-21", kickoff: "2026-06-21T00:00:00Z", home: "Ecuador", away: "Curaçao", venue: "Kansas City", venueShort: "Arrowhead Stadium" },
  { id: "E5", group: "E", date: "2026-06-25", kickoff: "2026-06-25T20:00:00Z", home: "Curaçao", away: "Ivory Coast", venue: "Philadelphia", venueShort: "Lincoln Financial" },
  { id: "E6", group: "E", date: "2026-06-25", kickoff: "2026-06-25T20:00:00Z", home: "Ecuador", away: "Germany", venue: "East Rutherford", venueShort: "MetLife Stadium" },

  // Group F
  { id: "F1", group: "F", date: "2026-06-14", kickoff: "2026-06-14T20:00:00Z", home: "Netherlands", away: "Japan", venue: "Dallas", venueShort: "AT&T Stadium" },
  { id: "F2", group: "F", date: "2026-06-15", kickoff: "2026-06-15T02:00:00Z", home: "Sweden", away: "Tunisia", venue: "Monterrey", venueShort: "Estadio BBVA" },
  { id: "F3", group: "F", date: "2026-06-20", kickoff: "2026-06-20T17:00:00Z", home: "Netherlands", away: "Sweden", venue: "Houston", venueShort: "NRG Stadium" },
  { id: "F4", group: "F", date: "2026-06-21", kickoff: "2026-06-21T02:00:00Z", home: "Tunisia", away: "Japan", venue: "Monterrey", venueShort: "Estadio BBVA" },
  { id: "F5", group: "F", date: "2026-06-25", kickoff: "2026-06-25T23:00:00Z", home: "Japan", away: "Sweden", venue: "Dallas", venueShort: "AT&T Stadium" },
  { id: "F6", group: "F", date: "2026-06-25", kickoff: "2026-06-25T23:00:00Z", home: "Tunisia", away: "Netherlands", venue: "Kansas City", venueShort: "Arrowhead Stadium" },

  // Group G
  { id: "G1", group: "G", date: "2026-06-15", kickoff: "2026-06-15T19:00:00Z", home: "Belgium", away: "Egypt", venue: "Seattle", venueShort: "Lumen Field" },
  { id: "G2", group: "G", date: "2026-06-16", kickoff: "2026-06-16T01:00:00Z", home: "Iran", away: "New Zealand", venue: "Inglewood", venueShort: "SoFi Stadium" },
  { id: "G3", group: "G", date: "2026-06-21", kickoff: "2026-06-21T19:00:00Z", home: "Belgium", away: "Iran", venue: "Inglewood", venueShort: "SoFi Stadium" },
  { id: "G4", group: "G", date: "2026-06-22", kickoff: "2026-06-22T01:00:00Z", home: "New Zealand", away: "Egypt", venue: "Vancouver", venueShort: "BC Place" },
  { id: "G5", group: "G", date: "2026-06-27", kickoff: "2026-06-27T03:00:00Z", home: "Egypt", away: "Iran", venue: "Seattle", venueShort: "Lumen Field" },
  { id: "G6", group: "G", date: "2026-06-27", kickoff: "2026-06-27T03:00:00Z", home: "New Zealand", away: "Belgium", venue: "Vancouver", venueShort: "BC Place" },

  // Group H
  { id: "H1", group: "H", date: "2026-06-15", kickoff: "2026-06-15T16:00:00Z", home: "Spain", away: "Cape Verde", venue: "Atlanta", venueShort: "Mercedes-Benz" },
  { id: "H2", group: "H", date: "2026-06-15", kickoff: "2026-06-15T22:00:00Z", home: "Saudi Arabia", away: "Uruguay", venue: "Miami", venueShort: "Hard Rock Stadium" },
  { id: "H3", group: "H", date: "2026-06-21", kickoff: "2026-06-21T16:00:00Z", home: "Spain", away: "Saudi Arabia", venue: "Atlanta", venueShort: "Mercedes-Benz" },
  { id: "H4", group: "H", date: "2026-06-21", kickoff: "2026-06-21T22:00:00Z", home: "Uruguay", away: "Cape Verde", venue: "Miami", venueShort: "Hard Rock Stadium" },
  { id: "H5", group: "H", date: "2026-06-27", kickoff: "2026-06-27T00:00:00Z", home: "Cape Verde", away: "Saudi Arabia", venue: "Houston", venueShort: "NRG Stadium" },
  { id: "H6", group: "H", date: "2026-06-27", kickoff: "2026-06-27T00:00:00Z", home: "Uruguay", away: "Spain", venue: "Guadalajara", venueShort: "Estadio Akron" },

  // Group I
  { id: "I1", group: "I", date: "2026-06-16", kickoff: "2026-06-16T19:00:00Z", home: "France", away: "Senegal", venue: "East Rutherford", venueShort: "MetLife Stadium" },
  { id: "I2", group: "I", date: "2026-06-16", kickoff: "2026-06-16T22:00:00Z", home: "Iraq", away: "Norway", venue: "Foxboro", venueShort: "Gillette Stadium" },
  { id: "I3", group: "I", date: "2026-06-22", kickoff: "2026-06-22T21:00:00Z", home: "France", away: "Iraq", venue: "Philadelphia", venueShort: "Lincoln Financial" },
  { id: "I4", group: "I", date: "2026-06-23", kickoff: "2026-06-23T00:00:00Z", home: "Norway", away: "Senegal", venue: "East Rutherford", venueShort: "MetLife Stadium" },
  { id: "I5", group: "I", date: "2026-06-26", kickoff: "2026-06-26T19:00:00Z", home: "Norway", away: "France", venue: "Foxboro", venueShort: "Gillette Stadium" },
  { id: "I6", group: "I", date: "2026-06-26", kickoff: "2026-06-26T19:00:00Z", home: "Senegal", away: "Iraq", venue: "Toronto", venueShort: "BMO Field" },

  // Group J
  { id: "J1", group: "J", date: "2026-06-17", kickoff: "2026-06-17T01:00:00Z", home: "Argentina", away: "Algeria", venue: "Kansas City", venueShort: "Arrowhead Stadium" },
  { id: "J2", group: "J", date: "2026-06-17", kickoff: "2026-06-17T04:00:00Z", home: "Austria", away: "Jordan", venue: "Santa Clara", venueShort: "Levi's Stadium" },
  { id: "J3", group: "J", date: "2026-06-22", kickoff: "2026-06-22T17:00:00Z", home: "Argentina", away: "Austria", venue: "Dallas", venueShort: "AT&T Stadium" },
  { id: "J4", group: "J", date: "2026-06-23", kickoff: "2026-06-23T03:00:00Z", home: "Jordan", away: "Algeria", venue: "Santa Clara", venueShort: "Levi's Stadium" },
  { id: "J5", group: "J", date: "2026-06-28", kickoff: "2026-06-28T02:00:00Z", home: "Algeria", away: "Austria", venue: "Kansas City", venueShort: "Arrowhead Stadium" },
  { id: "J6", group: "J", date: "2026-06-28", kickoff: "2026-06-28T02:00:00Z", home: "Jordan", away: "Argentina", venue: "Dallas", venueShort: "AT&T Stadium" },

  // Group K
  { id: "K1", group: "K", date: "2026-06-17", kickoff: "2026-06-17T17:00:00Z", home: "Portugal", away: "DR Congo", venue: "Houston", venueShort: "NRG Stadium" },
  { id: "K2", group: "K", date: "2026-06-18", kickoff: "2026-06-18T02:00:00Z", home: "Uzbekistan", away: "Colombia", venue: "Mexico City", venueShort: "Estadio Azteca" },
  { id: "K3", group: "K", date: "2026-06-23", kickoff: "2026-06-23T17:00:00Z", home: "Portugal", away: "Uzbekistan", venue: "Houston", venueShort: "NRG Stadium" },
  { id: "K4", group: "K", date: "2026-06-24", kickoff: "2026-06-24T02:00:00Z", home: "Colombia", away: "DR Congo", venue: "Guadalajara", venueShort: "Estadio Akron" },
  { id: "K5", group: "K", date: "2026-06-27", kickoff: "2026-06-27T23:30:00Z", home: "Colombia", away: "Portugal", venue: "Miami", venueShort: "Hard Rock Stadium" },
  { id: "K6", group: "K", date: "2026-06-27", kickoff: "2026-06-27T23:30:00Z", home: "DR Congo", away: "Uzbekistan", venue: "Atlanta", venueShort: "Mercedes-Benz" },

  // Group L
  { id: "L1", group: "L", date: "2026-06-17", kickoff: "2026-06-17T20:00:00Z", home: "England", away: "Croatia", venue: "Dallas", venueShort: "AT&T Stadium" },
  { id: "L2", group: "L", date: "2026-06-17", kickoff: "2026-06-17T23:00:00Z", home: "Ghana", away: "Panama", venue: "Toronto", venueShort: "BMO Field" },
  { id: "L3", group: "L", date: "2026-06-23", kickoff: "2026-06-23T20:00:00Z", home: "England", away: "Ghana", venue: "Foxboro", venueShort: "Gillette Stadium" },
  { id: "L4", group: "L", date: "2026-06-23", kickoff: "2026-06-23T23:00:00Z", home: "Panama", away: "Croatia", venue: "Toronto", venueShort: "BMO Field" },
  { id: "L5", group: "L", date: "2026-06-27", kickoff: "2026-06-27T21:00:00Z", home: "Panama", away: "England", venue: "East Rutherford", venueShort: "MetLife Stadium" },
  { id: "L6", group: "L", date: "2026-06-27", kickoff: "2026-06-27T21:00:00Z", home: "Croatia", away: "Ghana", venue: "Philadelphia", venueShort: "Lincoln Financial" },
];

// Knockout round structure with pre-set match slots
// Teams are TBD until groups finish — descriptions show where teams come from
export const KNOCKOUT_ROUNDS = [
  { id: "R32", name: "Round of 32", shortName: "R32" },
  { id: "R16", name: "Round of 16", shortName: "R16" },
  { id: "QF", name: "Quarter-finals", shortName: "QF" },
  { id: "SF", name: "Semi-finals", shortName: "SF" },
  { id: "3P", name: "Third place", shortName: "3rd" },
  { id: "F", name: "Final", shortName: "Final" },
];

// Knockout match slots — home/away are TBD placeholders until admin populates them
// source_home/source_away describe where the team comes from
export const KNOCKOUT_MATCH_SLOTS = [
  // Round of 32 (16 matches)
  { id: "R32-1", round: "R32", source_home: "1st Group A", source_away: "3rd Group C/D/E", matchNum: 1 },
  { id: "R32-2", round: "R32", source_home: "1st Group B", source_away: "3rd Group A/D/E", matchNum: 2 },
  { id: "R32-3", round: "R32", source_home: "1st Group C", source_away: "3rd Group A/B/F", matchNum: 3 },
  { id: "R32-4", round: "R32", source_home: "1st Group D", source_away: "3rd Group B/E/F", matchNum: 4 },
  { id: "R32-5", round: "R32", source_home: "1st Group E", source_away: "3rd Group A/B/C", matchNum: 5 },
  { id: "R32-6", round: "R32", source_home: "1st Group F", source_away: "3rd Group C/D/E", matchNum: 6 },
  { id: "R32-7", round: "R32", source_home: "2nd Group A", source_away: "2nd Group C", matchNum: 7 },
  { id: "R32-8", round: "R32", source_home: "2nd Group B", source_away: "2nd Group D", matchNum: 8 },
  { id: "R32-9", round: "R32", source_home: "1st Group G", source_away: "3rd Group I/J/K", matchNum: 9 },
  { id: "R32-10", round: "R32", source_home: "1st Group H", source_away: "3rd Group G/J/K", matchNum: 10 },
  { id: "R32-11", round: "R32", source_home: "1st Group I", source_away: "3rd Group G/H/L", matchNum: 11 },
  { id: "R32-12", round: "R32", source_home: "1st Group J", source_away: "3rd Group H/K/L", matchNum: 12 },
  { id: "R32-13", round: "R32", source_home: "1st Group K", source_away: "3rd Group G/H/I", matchNum: 13 },
  { id: "R32-14", round: "R32", source_home: "1st Group L", source_away: "3rd Group I/J/K", matchNum: 14 },
  { id: "R32-15", round: "R32", source_home: "2nd Group E", source_away: "2nd Group G", matchNum: 15 },
  { id: "R32-16", round: "R32", source_home: "2nd Group F", source_away: "2nd Group H", matchNum: 16 },

  // Round of 16 (8 matches)
  { id: "R16-1", round: "R16", source_home: "Winner R32-1", source_away: "Winner R32-2", matchNum: 1 },
  { id: "R16-2", round: "R16", source_home: "Winner R32-3", source_away: "Winner R32-4", matchNum: 2 },
  { id: "R16-3", round: "R16", source_home: "Winner R32-5", source_away: "Winner R32-6", matchNum: 3 },
  { id: "R16-4", round: "R16", source_home: "Winner R32-7", source_away: "Winner R32-8", matchNum: 4 },
  { id: "R16-5", round: "R16", source_home: "Winner R32-9", source_away: "Winner R32-10", matchNum: 5 },
  { id: "R16-6", round: "R16", source_home: "Winner R32-11", source_away: "Winner R32-12", matchNum: 6 },
  { id: "R16-7", round: "R16", source_home: "Winner R32-13", source_away: "Winner R32-14", matchNum: 7 },
  { id: "R16-8", round: "R16", source_home: "Winner R32-15", source_away: "Winner R32-16", matchNum: 8 },

  // Quarter-finals (4 matches)
  { id: "QF-1", round: "QF", source_home: "Winner R16-1", source_away: "Winner R16-2", matchNum: 1 },
  { id: "QF-2", round: "QF", source_home: "Winner R16-3", source_away: "Winner R16-4", matchNum: 2 },
  { id: "QF-3", round: "QF", source_home: "Winner R16-5", source_away: "Winner R16-6", matchNum: 3 },
  { id: "QF-4", round: "QF", source_home: "Winner R16-7", source_away: "Winner R16-8", matchNum: 4 },

  // Semi-finals (2 matches)
  { id: "SF-1", round: "SF", source_home: "Winner QF-1", source_away: "Winner QF-2", matchNum: 1 },
  { id: "SF-2", round: "SF", source_home: "Winner QF-3", source_away: "Winner QF-4", matchNum: 2 },

  // Third place
  { id: "3P-1", round: "3P", source_home: "Loser SF-1", source_away: "Loser SF-2", matchNum: 1 },

  // Final
  { id: "F-1", round: "F", source_home: "Winner SF-1", source_away: "Winner SF-2", matchNum: 1 },
];

// Helper: get all matches for a group
export function getGroupMatches(groupLetter) {
  return GROUP_MATCHES.filter(m => m.group === groupLetter);
}

// Helper: get matches by date
export function getMatchesByDate() {
  const map = {};
  GROUP_MATCHES.forEach(m => {
    if (!map[m.date]) map[m.date] = [];
    map[m.date].push(m);
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

// Helper: get today's matches
export function getTodaysMatches() {
  const today = new Date().toISOString().slice(0, 10);
  return GROUP_MATCHES.filter(m => m.date === today);
}

// Helper: format date nicely
export function formatMatchDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Helper: format kickoff to local time
export function formatKickoff(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Helper: check if match has started
export function hasMatchStarted(isoStr) {
  return new Date() >= new Date(isoStr);
}

// Helper: minutes until kickoff
export function minutesUntilKickoff(isoStr) {
  const diff = new Date(isoStr) - new Date();
  return Math.floor(diff / 60000);
}
