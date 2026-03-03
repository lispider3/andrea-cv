// Vercel Serverless — Event ingestion endpoint
// Receives events via POST (sendBeacon), stores in Upstash Redis

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

const VALID_EVENTS = new Set([
  'pageview', 'cv_download', 'quiz_start', 'quiz_complete', 'session_end',
  'cpo_start', 'cpo_complete', 'cta_click', 'book_modal',
]);

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export default async function handler(req, res) {
  // Only accept POST from sendBeacon
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // sendBeacon sends as text/plain, parse the body
    // Get visitor IP from Vercel headers
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.headers['x-real-ip']
      || req.socket?.remoteAddress || '';

    // Server-side IP exclusion (works even in incognito)
    const excludeIps = (process.env.EXCLUDE_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (excludeIps.length && excludeIps.includes(ip)) {
      return res.status(204).end();
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { e: event, p: page, r: referrer, t: timestamp, ...extra } = body || {};

    if (!event || !VALID_EVENTS.has(event)) {
      return res.status(204).end(); // Silently reject invalid
    }

    const db = getRedis();
    const day = todayKey();
    const pipeline = db.pipeline();

    // 1. Global counter for this event type
    pipeline.incr(`total:${event}`);

    // 2. Daily counter
    pipeline.hincrby(`daily:${day}`, event, 1);

    // 3. Per-page counter (for pageviews)
    if (event === 'pageview' && page) {
      pipeline.hincrby('pages', page, 1);
    }

    // 4. Per-quiz / per-CTA breakdown
    if (extra.quiz) {
      pipeline.hincrby(`quiz:${event}`, extra.quiz, 1);
    }
    if (extra.target) {
      pipeline.hincrby('cta_targets', extra.target, 1);
    }

    // 5. Recent events log (keep last 200)
    // Parse device info from user-agent
    const ua = extra.ua || '';
    delete extra.ua;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
    let device = 'Unknown';
    if (/iPhone/i.test(ua)) device = 'iPhone';
    else if (/iPad/i.test(ua)) device = 'iPad';
    else if (/Android/i.test(ua)) {
      const m = ua.match(/Android[^;]*;\s*([^)]+)/);
      device = m ? m[1].trim().split(' Build')[0] : 'Android';
    } else if (/Macintosh/i.test(ua)) device = 'Mac';
    else if (/Windows/i.test(ua)) device = 'Windows PC';
    else if (/Linux/i.test(ua)) device = 'Linux';

    const fp = extra.fp || '';
    delete extra.fp;

    const logEntry = JSON.stringify({
      e: event, p: page, r: referrer, t: timestamp,
      ...extra, d: day, ip, mobile: isMobile, device, fp,
    });
    pipeline.lpush('recent', logEntry);
    pipeline.ltrim('recent', 0, 199);

    // 6. Track referrers
    if (referrer && event === 'pageview') {
      try {
        const host = new URL(referrer).hostname;
        if (host && !host.includes('andreaspiteri.com')) {
          pipeline.hincrby('referrers', host, 1);
        }
      } catch {}
    }

    await pipeline.exec();
    return res.status(204).end();
  } catch (err) {
    // Never let analytics break — always return 204
    console.error('Track error:', err.message);
    return res.status(204).end();
  }
}
