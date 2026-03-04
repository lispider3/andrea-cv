// Vercel Serverless — Odds API Proxy
// Keeps the API key server-side, never exposed to the client.

const ODDS_API_KEY = process.env.ODDS_API_KEY || 'e67c22de5664471109480ba217a832c7';
const BASE = 'https://api.the-odds-api.com/v4';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const { sport, endpoint } = req.query;
  if (!sport || !endpoint) {
    return res.status(400).json({ error: 'sport and endpoint params required' });
  }

  // Whitelist allowed endpoints to prevent abuse
  const allowed = ['odds', 'scores', 'events'];
  if (!allowed.includes(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  // Forward allowed query params (exclude apiKey)
  const params = new URLSearchParams();
  params.set('apiKey', ODDS_API_KEY);
  for (const [k, v] of Object.entries(req.query)) {
    if (!['sport', 'endpoint', 'apiKey'].includes(k)) {
      params.set(k, v);
    }
  }

  try {
    const url = `${BASE}/sports/${sport}/${endpoint}?${params}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
