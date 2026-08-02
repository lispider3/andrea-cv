// Vercel Serverless — Last 5 results for any Serie A team via ESPN Schedule API
// No API key needed. Cached for 1 hour.

const LEAGUE = 'ita.1';
const NAME_MAP = { 'Internazionale': 'Inter', 'Hellas Verona FC': 'Hellas Verona', 'SSC Napoli': 'Napoli' };
const normalize = (s) => NAME_MAP[s] || s;

async function resolveTeamId(teamName) {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${LEAGUE}/teams`);
  if (!res.ok) throw new Error(`ESPN teams error: ${res.status}`);
  const data = await res.json();
  const teams = data?.sports?.[0]?.leagues?.[0]?.teams || [];
  const match = teams.find(t => {
    const dn = normalize(t.team?.displayName || '');
    return dn === teamName || dn.includes(teamName) || teamName.includes(dn);
  });
  return match?.team?.id || null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  const team = req.query.team || 'Juventus';

  try {
    const teamId = await resolveTeamId(team);
    if (!teamId) return res.status(404).json({ error: `Team not found: ${team}` });

    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${LEAGUE}/teams/${teamId}/schedule`
    );
    if (!response.ok) throw new Error(`ESPN error: ${response.status}`);

    const data = await response.json();
    const events = data.events || [];

    const completed = events
      .filter(e => {
        const comp = e.competitions?.[0];
        return comp?.status?.type?.completed === true;
      })
      .map(e => {
        const comp = e.competitions[0];
        const competitors = comp.competitors || [];
        const homeTeam = competitors.find(c => c.homeAway === 'home');
        const awayTeam = competitors.find(c => c.homeAway === 'away');

        return {
          date: e.date,
          home: normalize(homeTeam?.team?.displayName || '?'),
          away: normalize(awayTeam?.team?.displayName || '?'),
          hs: parseInt(homeTeam?.score?.displayValue || homeTeam?.score || '0'),
          as: parseInt(awayTeam?.score?.displayValue || awayTeam?.score || '0'),
          comp: e.season?.slug?.includes('champions') ? 'UCL' : 'Serie A',
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Record relative to the requested team, oldest-to-newest
    let w = 0, d = 0, l = 0;
    const normTeam = normalize(team);
    const sequence = completed.map(r => {
      const isHome = r.home === normTeam || r.home.includes(normTeam) || normTeam.includes(r.home);
      const gf = isHome ? r.hs : r.as;
      const ga = isHome ? r.as : r.hs;
      if (gf > ga) { w++; return 'W'; }
      if (gf < ga) { l++; return 'L'; }
      d++; return 'D';
    }).reverse().join('');

    res.status(200).json({
      team: normTeam,
      results: completed,
      record: { w, d, l, sequence },
      updated: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
