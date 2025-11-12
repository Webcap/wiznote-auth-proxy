import { NextResponse } from 'next/server';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://wiznote.app',
  'https://auth.wiznote.app',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
];

const LOCALHOST_REGEX = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i;

const BASE_ALLOW_HEADERS =
  'authorization, apikey, content-type, accept, accept-profile, content-profile, prefer, range, range-unit, x-client-info, x-profile-id, x-csrf-token, x-supabase-api-version';

const BASE_ALLOW_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';

const FALLBACK_ORIGIN = 'https://wiznote.app';

const buildAllowedOrigins = () => {
  const extraOrigins = (process.env.CORS_ADDITIONAL_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...extraOrigins]);
};

const allowedOrigins = buildAllowedOrigins();

const resolveAllowedOrigin = (origin: string | null): string => {
  if (!origin) {
    return FALLBACK_ORIGIN;
  }

  if (allowedOrigins.has(origin)) {
    return origin;
  }

  if (LOCALHOST_REGEX.test(origin)) {
    return origin;
  }

  return FALLBACK_ORIGIN;
};

const applyCorsHeaders = (headers: Headers, origin: string) => {
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', BASE_ALLOW_METHODS);
  headers.set('Access-Control-Allow-Headers', BASE_ALLOW_HEADERS);
  headers.set('Access-Control-Max-Age', '86400');
  headers.set('Vary', 'Origin');
};

export const config = {
  matcher: ['/auth/:path*', '/rest/:path*', '/storage/:path*', '/realtime/:path*'],
};

export default function middleware(request: Request) {
  const origin = resolveAllowedOrigin(request.headers.get('origin'));
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    const headers = new Headers();
    applyCorsHeaders(headers, origin);
    return new Response(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  applyCorsHeaders(response.headers, origin);

  return response;
}

