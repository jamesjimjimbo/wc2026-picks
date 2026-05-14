'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import AuthForm from '@/components/AuthForm';
import JoinLeague from '@/components/JoinLeague';
import Header from '@/components/Header';
import PicksView from '@/components/PicksView';
import LeaderboardView from '@/components/LeaderboardView';
import ResultsView from '@/components/ResultsView';
import AdminView from '@/components/AdminView';

function AppContent() {
  const { user, profile, loading, supabase } = useAuth();
  const [view, setView] = useState('picks');

  // League state
  const [leagues, setLeagues] = useState([]);       // leagues user belongs to
  const [activeLeague, setActiveLeague] = useState(null);
  const [leagueMembers, setLeagueMembers] = useState([]); // members of active league
  const [leaguesLoaded, setLeaguesLoaded] = useState(false);

  // Game state
  const [picks, setPicks] = useState({});
  const [results, setResults] = useState({});
  const [odds, setOdds] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load leagues when user is ready
  useEffect(() => {
    if (!user || !supabase) return;
    loadLeagues();
  }, [user, supabase]);

  // Load game data once we have an active league
  useEffect(() => {
    if (!user || !supabase || !activeLeague) return;
    loadGameData();
    loadLeagueMembers(activeLeague.id);
  }, [user, supabase, activeLeague]);

  async function loadLeagues() {
    if (!supabase) return;

    try {
      // Get leagues the user belongs to
      const { data: memberships, error } = await supabase
        .from('league_members')
        .select('league_id, leagues(id, name, invite_code, created_by)')
        .eq('user_id', user.id);

      if (error) console.error('League load error:', error);

      if (memberships && memberships.length > 0) {
        const userLeagues = memberships
          .map(m => m.leagues)
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));
        setLeagues(userLeagues);
        setActiveLeague(userLeagues[0]);
      }
    } catch (e) {
      console.error('League load exception:', e);
    }

    setLeaguesLoaded(true);
  }

  async function loadLeagueMembers(leagueId) {
    if (!supabase) return;
    const { data } = await supabase
      .from('league_members')
      .select('user_id, profiles(display_name)')
      .eq('league_id', leagueId);
    if (data) setLeagueMembers(data);
  }

  async function loadGameData() {
    if (!supabase) return;

    // Load user's picks (global — same across all leagues)
    const { data: picksData } = await supabase
      .from('picks')
      .select('*')
      .eq('user_id', user.id);

    if (picksData) {
      const picksMap = {};
      picksData.forEach(p => {
        picksMap[p.match_id] = { pick: p.pick, wager: p.wager, is_knockout: p.is_knockout };
      });
      setPicks(picksMap);
    }

    // Load results (global)
    const { data: resultsData } = await supabase
      .from('match_results')
      .select('*');

    if (resultsData) {
      const resultsMap = {};
      resultsData.forEach(r => { resultsMap[r.match_id] = r; });
      setResults(resultsMap);
    }

    // Load odds (global)
    const { data: oddsData } = await supabase
      .from('match_odds')
      .select('*');

    if (oddsData) {
      const oddsMap = {};
      oddsData.forEach(o => { oddsMap[o.match_id] = o; });
      setOdds(oddsMap);
    }

    // Load leaderboard (global view — filtered per-league in the component)
    await loadLeaderboard();

    setDataLoaded(true);
  }

  async function loadLeaderboard() {
    if (!supabase) return;
    const { data } = await supabase.from('leaderboard').select('*');
    if (data) setLeaderboard(data);
  }

  // Handle joining a league from the JoinLeague screen
  function handleLeagueJoined(result) {
    // result is { league_id, league_name } from the RPC
    const newLeague = { id: result.league_id, name: result.league_name };
    setLeagues(prev => [...prev, newLeague]);
    setActiveLeague(newLeague);
    setLeaguesLoaded(true);
  }

  // Switch active league
  function handleSwitchLeague(league) {
    setActiveLeague(league);
    loadLeagueMembers(league.id);
    // Switch to leaderboard to see the new league's standings
    setView('leaderboard');
  }

  // Handle pick (global — shared across leagues)
  const handlePick = useCallback(async (matchId, choice) => {
    if (!user || !supabase) return;

    const existing = picks[matchId];

    if (existing?.pick === choice) {
      await supabase.from('picks').delete().match({ user_id: user.id, match_id: matchId });
      setPicks(prev => {
        const next = { ...prev };
        delete next[matchId];
        return next;
      });
      return;
    }

    const { error } = await supabase.from('picks').upsert({
      user_id: user.id,
      match_id: matchId,
      pick: choice,
      wager: 1,
      is_knockout: false,
    }, { onConflict: 'user_id,match_id' });

    if (!error) {
      setPicks(prev => ({
        ...prev,
        [matchId]: { pick: choice, wager: 1, is_knockout: false },
      }));
    }
  }, [user, supabase, picks]);

  // Handle save result (admin)
  const handleSaveResult = useCallback(async (matchId, result) => {
    if (!supabase) return;

    if (result === null) {
      await supabase.from('match_results').delete().eq('match_id', matchId);
      setResults(prev => {
        const next = { ...prev };
        delete next[matchId];
        return next;
      });
    } else {
      await supabase.from('match_results').upsert({
        match_id: matchId,
        result,
        entered_by: user.id,
      }, { onConflict: 'match_id' });

      setResults(prev => ({
        ...prev,
        [matchId]: { match_id: matchId, result },
      }));
    }

    setTimeout(loadLeaderboard, 500);
  }, [supabase, user]);

  // Handle save odds (admin)
  const handleSaveOdds = useCallback(async (matchId, field, value) => {
    if (!supabase) return;

    const existing = odds[matchId] || { home_odds: 0, draw_odds: 0, away_odds: 0 };
    const updated = { ...existing, [field]: value, match_id: matchId };

    await supabase.from('match_odds').upsert(updated, { onConflict: 'match_id' });

    setOdds(prev => ({
      ...prev,
      [matchId]: updated,
    }));
  }, [supabase, odds]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">⚽</p>
          <p className="text-xs text-text-muted tracking-widest">LOADING...</p>
        </div>
      </div>
    );
  }

  // Auth gate
  if (!user) {
    return <AuthForm />;
  }

  // League gate — show join screen if user has no leagues
  if (leaguesLoaded && leagues.length === 0) {
    return <JoinLeague onJoined={handleLeagueJoined} />;
  }

  // Waiting for leagues to load
  if (!leaguesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">⚽</p>
          <p className="text-xs text-text-muted tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  // Waiting for game data
  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">⚽</p>
          <p className="text-xs text-text-muted tracking-widest">Loading picks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        picks={picks}
        results={results}
        odds={odds}
        view={view}
        setView={setView}
        leagues={leagues}
        activeLeague={activeLeague}
        onSwitchLeague={handleSwitchLeague}
      />

      {view === 'picks' && (
        <PicksView
          picks={picks}
          odds={odds}
          results={results}
          onPick={handlePick}
        />
      )}

      {view === 'leaderboard' && (
        <LeaderboardView
          leaderboard={leaderboard}
          currentUserId={user.id}
          leagueMembers={leagueMembers}
          activeLeague={activeLeague}
        />
      )}

      {view === 'results' && (
        <ResultsView
          results={results}
          odds={odds}
          picks={picks}
        />
      )}

      {view === 'admin' && (
        <AdminView
          results={results}
          odds={odds}
          onSaveResult={handleSaveResult}
          onSaveOdds={handleSaveOdds}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
