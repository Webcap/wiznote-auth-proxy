import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = new Set([
  'https://wiznote.app',
  'https://auth.wiznote.app',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
]);

const ALLOW_HEADERS = [
  'authorization',
  'apikey',
  'content-type',
  'accept',
  'accept-profile',
  'content-profile',
  'prefer',
  'range',
  'range-unit',
  'x-client-info',
  'x-profile-id',
  'x-csrf-token',
  'x-supabase-api-version',
].join(', ');

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : '';

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.status(204).end();
  } else {
    res.status(403).end();
  }
}

