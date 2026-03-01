// Vercel Serverless — AI Match Preview Generator
// Generates a brief match preview combining ESPN head-to-head data with context

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  const { home, away } = req.query;
  if (!home || !away) {
    return res.status(400).json({ error: 'home and away params required' });
  }

  try {
    // Try ESPN head-to-head & team data
    const [standingsRes] = await Promise.all([
      fetch('https://site.api.espn.com/apis/v2/sports/soccer/ita.1/standings'),
    ]);
    const standingsData = await standingsRes.json();
    const entries = standingsData?.children?.[0]?.standings?.entries || [];

    const getTeamStats = (name) => {
      const entry = entries.find(e => {
        const dn = e.team?.displayName || '';
        return dn.includes(name) || name.includes(dn);
      });
      if (!entry) return null;
      const stats = {};
      (entry.stats || []).forEach(s => stats[s.name] = s.value);
      return {
        name: entry.team?.displayName,
        rank: Math.round(stats.rank || 0),
        points: Math.round(stats.points || 0),
        wins: Math.round(stats.wins || 0),
        draws: Math.round(stats.ties || 0),
        losses: Math.round(stats.losses || 0),
        gf: Math.round(stats.pointsFor || 0),
        ga: Math.round(stats.pointsAgainst || 0),
        played: Math.round(stats.gamesPlayed || 0),
      };
    };

    const homeStats = getTeamStats(home);
    const awayStats = getTeamStats(away);

    // Generate preview text
    const preview = generatePreview(home, away, homeStats, awayStats);

    res.status(200).json({ preview, home: homeStats, away: awayStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function generatePreview(home, away, hs, as) {
  if (!hs || !as) return `${home} host ${away} in a Serie A clash. Both sides will be looking for three points.`;

  const homeForm = hs.wins > hs.losses ? 'strong' : hs.wins === hs.losses ? 'mixed' : 'poor';
  const awayForm = as.wins > as.losses ? 'strong' : as.wins === as.losses ? 'mixed' : 'poor';
  const homeGD = hs.gf - hs.ga;
  const awayGD = as.gf - as.ga;

  const lines = [];

  // Opening
  if (Math.abs(hs.rank - as.rank) <= 3) {
    lines.push(`A pivotal Serie A clash as ${hs.rank}${ord(hs.rank)}-placed ${home} (${hs.points}pts) host ${as.rank}${ord(as.rank)}-placed ${away} (${as.points}pts).`);
  } else {
    lines.push(`${home} (${hs.rank}${ord(hs.rank)}, ${hs.points}pts) welcome ${away} (${as.rank}${ord(as.rank)}, ${as.points}pts) to their home turf.`);
  }

  // Home form
  if (homeForm === 'strong') {
    lines.push(`The hosts boast ${hs.wins} wins from ${hs.played} games with a GD of ${homeGD > 0 ? '+' : ''}${homeGD}.`);
  }

  // Away form
  if (awayForm === 'strong') {
    lines.push(`${away} arrive in confident form with ${as.wins} victories and ${as.gf} goals scored.`);
  } else if (awayForm === 'mixed') {
    lines.push(`${away} have been inconsistent, drawing ${as.draws} of their ${as.played} matches.`);
  }

  // Prediction hint
  const ptsDiff = Math.abs(hs.points - as.points);
  if (ptsDiff <= 5) {
    lines.push(`With only ${ptsDiff} points separating them, expect a tight, cagey contest.`);
  } else if (hs.points > as.points) {
    lines.push(`Home advantage and table position favor ${home}, but ${away} will look to close the gap.`);
  }

  return lines.join(' ');
}

function ord(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
