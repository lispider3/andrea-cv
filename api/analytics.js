// Vercel Serverless — Analytics data reader (password-protected)

import { Redis } from '@upstash/redis';

let redis;
function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Password check
  const password = process.env.ANALYTICS_PASSWORD;
  const auth = req.headers.authorization?.replace('Bearer ', '');
  if (!password || auth !== password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = getRedis();

    // Build last 30 days keys
    const days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    // Fetch everything in parallel
    const pipeline = db.pipeline();

    // Totals
    pipeline.get('total:pageview');
    pipeline.get('total:cv_download');
    pipeline.get('total:quiz_start');
    pipeline.get('total:quiz_complete');
    pipeline.get('total:cpo_start');
    pipeline.get('total:cpo_complete');
    pipeline.get('total:cta_click');
    pipeline.get('total:book_modal');

    // Daily breakdown
    days.forEach(d => pipeline.hgetall(`daily:${d}`));

    // Per-page stats
    pipeline.hgetall('pages');

    // Quiz breakdown
    pipeline.hgetall('quiz:quiz_start');
    pipeline.hgetall('quiz:quiz_complete');

    // CTA targets
    pipeline.hgetall('cta_targets');

    // Referrers
    pipeline.hgetall('referrers');

    // Recent events
    pipeline.lrange('recent', 0, 49);

    const results = await pipeline.exec();

    let idx = 0;
    const totals = {
      pageviews: Number(results[idx++]) || 0,
      cv_downloads: Number(results[idx++]) || 0,
      quiz_starts: Number(results[idx++]) || 0,
      quiz_completions: Number(results[idx++]) || 0,
      cpo_starts: Number(results[idx++]) || 0,
      cpo_completions: Number(results[idx++]) || 0,
      cta_clicks: Number(results[idx++]) || 0,
      book_modals: Number(results[idx++]) || 0,
    };

    const daily = days.map(d => {
      const data = results[idx++] || {};
      return {
        date: d,
        pageviews: Number(data.pageview) || 0,
        cv_downloads: Number(data.cv_download) || 0,
        quiz_starts: Number(data.quiz_start) || 0,
        cta_clicks: Number(data.cta_click) || 0,
      };
    });

    const pages = results[idx++] || {};
    const quizStarts = results[idx++] || {};
    const quizCompletions = results[idx++] || {};
    const ctaTargets = results[idx++] || {};
    const referrers = results[idx++] || {};
    const recentRaw = results[idx++] || [];

    const recent = recentRaw.map(r => {
      try { return typeof r === 'string' ? JSON.parse(r) : r; } catch { return r; }
    });

    return res.status(200).json({
      totals,
      daily,
      pages,
      quizStarts,
      quizCompletions,
      ctaTargets,
      referrers,
      recent,
      generated: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
