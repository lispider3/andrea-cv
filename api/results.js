// Vercel Serverless — Last 5 Juventus Results via ESPN Schedule API
// No API key needed. Cached for 1 hour.

const TEAM_ID = '111'; // Juventus ESPN ID
const LEAGUE = 'ita.1';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  try {
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${LEAGUE}/teams/${TEAM_ID}/schedule`
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
          home: homeTeam?.team?.displayName || '?',
          away: awayTeam?.team?.displayName || '?',
          hs: parseInt(homeTeam?.score?.displayValue || homeTeam?.score || '0'),
          as: parseInt(awayTeam?.score?.displayValue || awayTeam?.score || '0'),
          comp: e.season?.slug?.includes('champions') ? 'UCL' : 'Serie A',
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Fix team name mapping
    const nameMap = { 'Internazionale': 'Inter', 'Hellas Verona FC': 'Hellas Verona', 'SSC Napoli': 'Napoli' };
    completed.forEach(r => {
      r.home = nameMap[r.home] || r.home;
      r.away = nameMap[r.away] || r.away;
    });

    res.status(200).json({ results: completed, updated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
