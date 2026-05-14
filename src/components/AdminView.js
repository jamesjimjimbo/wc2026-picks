'use client';

import { useState, useEffect } from 'react';
import { GROUPS, GROUP_MATCHES, FLAGS, SHORT_NAMES, formatMatchDate } from '@/data/matches';
import { useAuth } from './AuthProvider';

export default function AdminView({ results, odds, onSaveResult, onSaveOdds }) {
  const { profile, supabase } = useAuth();
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState('results'); // results | leagues
  const [allLeagues, setAllLeagues] = useState([]);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [newLeagueCode, setNewLeagueCode] = useState('');
  const [leagueError, setLeagueError] = useState('');
  const [leagueSuccess, setLeagueSuccess] = useState('');
  const [leagueMembers, setLeagueMembers] = useState({}); // { leagueId: [members] }

  const isAdmin = profile?.is_admin || unlocked;

  // Load leagues when admin tab is shown
  useEffect(() => {
    if (isAdmin && adminTab === 'leagues' && supabase) {
      loadLeagues();
    }
  }, [isAdmin, adminTab]);

  async function loadLeagues() {
    const { data } = await supabase
      .from('leagues')
      .select('*, league_members(user_id, profiles(display_name))')
      .order('created_at', { ascending: true });
    if (data) {
      setAllLeagues(data);
    }
  }

  function generateCode() {
    // Generate a readable 6-char code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async function handleCreateLeague(e) {
    e.preventDefault();
    setLeagueError('');
    setLeagueSuccess('');

    if (!newLeagueName.trim()) {
      setLeagueError('League name is required');
      return;
    }

    const code = newLeagueCode.trim().toUpperCase() || generateCode();

    const { data, error } = await supabase.from('leagues').insert({
      name: newLeagueName.trim(),
      invite_code: code,
      created_by: profile.id,
    }).select().single();

    if (error) {
      if (error.message.includes('unique') || error.message.includes('duplicate')) {
        setLeagueError('That invite code is already taken. Try another.');
      } else {
        setLeagueError(error.message);
      }
      return;
    }

    // Auto-join yourself to the league
    await supabase.from('league_members').insert({
      league_id: data.id,
      user_id: profile.id,
    });

    setLeagueSuccess(`League "${data.name}" created! Invite code: ${data.invite_code}`);
    setNewLeagueName('');
    setNewLeagueCode('');
    loadLeagues();
  }

  if (!isAdmin) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-3xl mb-3">⚙️</p>
        <p className="text-sm text-text-secondary mb-4">Admin access required</p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && password === 'wc2026admin') setUnlocked(true); }}
          placeholder="Admin password"
          className="px-3 py-2 bg-surface-secondary border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
        <p className="text-[10px] text-text-muted mt-2">Hint: wc2026admin</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      <div className="text-center pt-4 pb-2">
        <p className="text-[10px] text-accent-red uppercase tracking-widest font-bold mb-1">
          Admin Panel
        </p>
      </div>

      {/* Admin sub-tabs */}
      <div className="flex bg-surface-tertiary rounded-lg p-1 mb-4">
        <button
          onClick={() => setAdminTab('results')}
          className={`flex-1 py-2 text-[11px] font-medium rounded-md transition-all ${
            adminTab === 'results'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-muted'
          }`}
        >
          Results & Odds
        </button>
        <button
          onClick={() => setAdminTab('leagues')}
          className={`flex-1 py-2 text-[11px] font-medium rounded-md transition-all ${
            adminTab === 'leagues'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-muted'
          }`}
        >
          Leagues
        </button>
      </div>

      {/* LEAGUES TAB */}
      {adminTab === 'leagues' && (
        <div>
          {/* Create league form */}
          <div className="bg-surface-secondary rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-text-primary mb-3">Create New League</p>
            <form onSubmit={handleCreateLeague} className="space-y-3">
              <input
                type="text"
                value={newLeagueName}
                onChange={e => setNewLeagueName(e.target.value)}
                placeholder="League name (e.g. Kieve Boys)"
                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
              <input
                type="text"
                value={newLeagueCode}
                onChange={e => setNewLeagueCode(e.target.value.toUpperCase())}
                placeholder="Custom invite code (optional, auto-generated if blank)"
                maxLength={20}
                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />

              {leagueError && (
                <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2">
                  {leagueError}
                </div>
              )}
              {leagueSuccess && (
                <div className="bg-green-50 text-green-700 text-xs rounded-lg px-3 py-2">
                  {leagueSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
              >
                Create League
              </button>
            </form>
          </div>

          {/* Existing leagues */}
          <div className="space-y-3">
            {allLeagues.map(league => (
              <div key={league.id} className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-text-primary">{league.name}</p>
                  <span className="text-[10px] font-mono bg-surface-tertiary text-text-secondary px-2 py-1 rounded font-bold tracking-wider">
                    {league.invite_code}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mb-2">
                  {league.league_members?.length || 0} member{(league.league_members?.length || 0) !== 1 ? 's' : ''}
                </p>
                {league.league_members && league.league_members.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {league.league_members.map((m, i) => (
                      <span key={i} className="text-[10px] bg-surface-secondary text-text-secondary px-2 py-0.5 rounded-full">
                        {m.profiles?.display_name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {allLeagues.length === 0 && (
              <p className="text-center text-xs text-text-muted py-8">
                No leagues yet. Create one above!
              </p>
            )}
          </div>
        </div>
      )}

      {/* RESULTS TAB */}
      {adminTab === 'results' && (
        <div>
          {Object.entries(GROUPS).map(([g, teams]) => {
            const groupMatches = GROUP_MATCHES.filter(m => m.group === g);
            return (
              <div key={g} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-text-muted bg-surface-tertiary px-2 py-0.5 rounded">
                    GROUP {g}
                  </span>
                  <span className="flex-1 h-px bg-border" />
                </div>

                <div className="space-y-2">
                  {groupMatches.map(m => {
                    const result = results[m.id];
                    const matchOdds = odds[m.id];

                    return (
                      <div key={m.id} className="bg-white rounded-lg border border-border p-3">
                        <div className="text-[9px] text-text-muted mb-2">
                          {formatMatchDate(m.date)} · {m.venueShort}
                        </div>

                        {/* Odds inputs */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 flex items-center gap-1">
                            <span className="text-sm">{FLAGS[m.home]}</span>
                            <span className="text-[10px] font-bold">{SHORT_NAMES[m.home]}</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="H odds"
                            defaultValue={matchOdds?.home_odds || ''}
                            onBlur={e => {
                              const v = parseFloat(e.target.value);
                              if (v > 0) onSaveOdds(m.id, 'home_odds', v);
                            }}
                            className="w-16 text-center text-xs bg-surface-secondary border border-border rounded px-1 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="D odds"
                            defaultValue={matchOdds?.draw_odds || ''}
                            onBlur={e => {
                              const v = parseFloat(e.target.value);
                              if (v > 0) onSaveOdds(m.id, 'draw_odds', v);
                            }}
                            className="w-16 text-center text-xs bg-surface-secondary border border-border rounded px-1 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="A odds"
                            defaultValue={matchOdds?.away_odds || ''}
                            onBlur={e => {
                              const v = parseFloat(e.target.value);
                              if (v > 0) onSaveOdds(m.id, 'away_odds', v);
                            }}
                            className="w-16 text-center text-xs bg-surface-secondary border border-border rounded px-1 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                          />
                          <div className="flex-1 flex items-center justify-end gap-1">
                            <span className="text-[10px] font-bold">{SHORT_NAMES[m.away]}</span>
                            <span className="text-sm">{FLAGS[m.away]}</span>
                          </div>
                        </div>

                        {/* Result buttons */}
                        <div className="flex gap-1">
                          {['home', 'draw', 'away'].map(r => (
                            <button
                              key={r}
                              onClick={() => onSaveResult(m.id, r === result?.result ? null : r)}
                              className={`flex-1 py-1.5 text-[10px] font-bold tracking-wider rounded-md transition-all ${
                                result?.result === r
                                  ? 'bg-brand-green text-white'
                                  : 'bg-surface-tertiary text-text-muted hover:bg-surface-secondary'
                              }`}
                            >
                              {r === 'home' ? SHORT_NAMES[m.home] :
                               r === 'away' ? SHORT_NAMES[m.away] : 'DRAW'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
