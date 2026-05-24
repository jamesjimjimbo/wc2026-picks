'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { withTimeout } from '@/lib/supabase-browser';
import AuthForm from '@/components/AuthForm';
import JoinLeague from '@/components/JoinLeague';
import Header from '@/components/Header';
import PicksView from '@/components/PicksView';
import LeaderboardView from '@/components/LeaderboardView';
import ResultsView from '@/components/ResultsView';
import AdminView from '@/components/AdminView';
import RulesView from '@/components/RulesView';
import { calculateAvailableBalance } from '@/lib/balance';

function AppContent() {
  const { user, profile, loading, supabase } = useAuth();
  const [view, setView] = useState('picks');

  // League state
  const [leagues, setLeagues] = useState([]);
  const [activeLeague, setActiveLeague] = useState(null);
  const [leagueMembers, setLeagueMembers] = useState([]);
  const [leaguesLoaded, setLeaguesLoaded] = useState(false);

  // Game state
  const [picks, setPicks] = useState({});
  const [results, setResults] = useState({});
  const [odds, setOdds] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [knockoutMatches, setKnockoutMatches] = useState([]);
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
    if (!supabase || !user) return;

    try {
      // Step 1: get league IDs
      const { data: memberships } = await withTimeout(
        supabase.from('league_members').select('league_id').eq('user_id', user.id),
        5000,
        'load memberships'
      );

      if (memberships && memberships.length > 0) {
        const leagueIds = memberships.map(m => m.league_id);

        // Step 2: fetch leagues
        const { data: leaguesData } = await withTimeout(
          supabase.from('leagues').select('id, name, invite_code, created_by').in('id', leagueIds),
          5000,
          'load leagues'
        );

        if (leaguesData && leaguesData.length > 0) {
          const sorted = leaguesData.sort((a, b) => a.name.localeCompare(b.name));
          setLeagues(sorted);
          setActiveLeague(sorted[0]);
        }
      }
    } catch (e) {
      console.error('League load failed:', e.message);
    }

    setLeaguesLoaded(true);
  }

  async function loadLeagueMembers(leagueId) {
    if (!supabase) return;
    try {
      const { data } = await withTimeout(
        supabase.from('league_members').select('user_id').eq('league_id', leagueId),
        5000,
        'load league members'
      );
      if (data) setLeagueMembers(data);
    } catch (e) {
      console.error('League members load failed:', e.message);
    }
  }

  async function loadGameData() {
    if (!supabase || !user) return;

    try {
      // Run all data loads in parallel with individual timeouts
      const [picksResult, resultsResult, oddsResult, lbResult, koResult] = await Promise.allSettled([
        withTimeout(
          supabase.from('picks').select('*').eq('user_id', user.id),
          5000, 'load picks'
        ),
        withTimeout(
          supabase.from('match_results').select('*'),
          5000, 'load results'
        ),
        withTimeout(
          supabase.from('match_odds').select('*'),
          5000, 'load odds'
        ),
        withTimeout(
          supabase.from('leaderboard').select('*'),
          5000, 'load leaderboard'
        ),
        withTimeout(
          supabase.from('knockout_matches').select('*'),
          5000, 'load knockout matches'
        ),
      ]);

      // Process picks
      if (picksResult.status === 'fulfilled' && picksResult.value.data) {
        const map = {};
        picksResult.value.data.forEach(p => {
          map[p.match_id] = { pick: p.pick, wager: p.wager, is_knockout: p.is_knockout };
        });
        setPicks(map);
      }

      // Process results
      if (resultsResult.status === 'fulfilled' && resultsResult.value.data) {
        const map = {};
        resultsResult.value.data.forEach(r => { map[r.match_id] = r; });
        setResults(map);
      }

      // Process odds
      if (oddsResult.status === 'fulfilled' && oddsResult.value.data) {
        const map = {};
        oddsResult.value.data.forEach(o => { map[o.match_id] = o; });
        setOdds(map);
      }

      // Process leaderboard
      if (lbResult.status === 'fulfilled' && lbResult.value.data) {
        setLeaderboard(lbResult.value.data);
      }

      // Process knockout matches
      if (koResult.status === 'fulfilled' && koResult.value.data) {
        setKnockoutMatches(koResult.value.data);
      }
    } catch (e) {
      console.error('Game data load failed:', e.message);
    }

    setDataLoaded(true);
  }

  async function loadLeaderboard() {
    if (!supabase) return;
    try {
      const { data } = await withTimeout(
        supabase.from('leaderboard').select('*'),
        5000, 'refresh leaderboard'
      );
      if (data) setLeaderboard(data);
    } catch (e) {
      console.error('Leaderboard refresh failed:', e.message);
    }
  }

  function handleLeagueJoined(result) {
    const newLeague = { id: result.league_id, name: result.league_name };
    setLeagues(prev => [...prev, newLeague]);
    setActiveLeague(newLeague);
    setLeaguesLoaded(true);
  }

  function handleSwitchLeague(league) {
    setActiveLeague(league);
    setLeagueMembers([]); // Clear immediately so stale data doesn't show
    loadLeagueMembers(league.id);
    setView('leaderboard');
  }

  const handlePick = useCallback(async (matchId, choice, isKnockout = false) => {
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

    const wager = isKnockout ? (existing?.wager || 1) : 1;

    const { error } = await supabase.from('picks').upsert({
      user_id: user.id,
      match_id: matchId,
      pick: choice,
      wager,
      is_knockout: isKnockout,
    }, { onConflict: 'user_id,match_id' });

    if (!error) {
      setPicks(prev => ({
        ...prev,
        [matchId]: { pick: choice, wager, is_knockout: isKnockout },
      }));
    }
  }, [user, supabase, picks]);

  const handleWagerChange = useCallback(async (matchId, newWager) => {
    if (!user || !supabase) return;
    const existing = picks[matchId];
    if (!existing) return;

    const { error } = await supabase.from('picks').upsert({
      user_id: user.id,
      match_id: matchId,
      pick: existing.pick,
      wager: newWager,
      is_knockout: true,
    }, { onConflict: 'user_id,match_id' });

    if (!error) {
      setPicks(prev => ({
        ...prev,
        [matchId]: { ...prev[matchId], wager: newWager },
      }));
    }
  }, [user, supabase, picks]);

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

  // --- RENDER ---

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

  // Calculate available balance for knockout wagers
  const availableBalance = calculateAvailableBalance(picks, results, odds);

  if (!user) {
    return <AuthForm />;
  }

  if (leaguesLoaded && leagues.length === 0) {
    return <JoinLeague onJoined={handleLeagueJoined} />;
  }

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
          knockoutMatches={knockoutMatches}
          balance={availableBalance}
          onWagerChange={handleWagerChange}
        />
      )}

      {view === 'leaderboard' && (
        <LeaderboardView
          leaderboard={leaderboard}
          currentUserId={user.id}
          leagueMembers={leagueMembers}
          activeLeague={activeLeague}
          results={results}
          odds={odds}
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

      {view === 'rules' && (
        <RulesView onClose={() => setView('picks')} />
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
