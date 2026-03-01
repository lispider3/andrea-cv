// Vercel Serverless Function — Serie A Standings via ESPN API
// No API key needed. Cached for 1 hour.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  try {
    const response = await fetch(
      'https://site.api.espn.com/apis/v2/sports/soccer/ita.1/standings'
    );
    if (!response.ok) throw new Error(`ESPN API error: ${response.status}`);

    const data = await response.json();
    const entries = data?.children?.[0]?.standings?.entries || [];

    const standings = entries.map((entry) => {
      const team = entry.team?.displayName || 'Unknown';
      const stats = {};
      (entry.stats || []).forEach((s) => {
        stats[s.name] = s.value;
      });

      // Map ESPN team names to match Odds API naming
      const nameMap = {
        'Internazionale': 'Inter',
        'Hellas Verona FC': 'Hellas Verona',
        'AC Milan': 'AC Milan',
        'SSC Napoli': 'Napoli',
        'AS Roma': 'AS Roma',
        'Juventus': 'Juventus',
      };

      return {
        name: nameMap[team] || team,
        p: Math.round(stats.gamesPlayed || 0),
        w: Math.round(stats.wins || 0),
        d: Math.round(stats.ties || 0),
        l: Math.round(stats.losses || 0),
        gf: Math.round(stats.pointsFor || 0),
        ga: Math.round(stats.pointsAgainst || 0),
        pts: Math.round(stats.points || 0),
      };
    });

    standings.sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    res.status(200).json({ standings, updated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
