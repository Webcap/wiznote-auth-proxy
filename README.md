# WizNote Auth Proxy

This minimal project is ready to deploy to Vercel and expose your Supabase GoTrue
instance behind a custom domain (for example `auth.wiznote.app`).

## Deploy steps

1. Create a new Vercel project and import this directory. No build step is needed.
2. In project settings, add your custom domain and point DNS to Vercel.
3. After the domain is verified, update Supabase Authentication → URL Configuration:
   - Site URL: `https://auth.wiznote.app`
   - Redirect URLs: replace Supabase defaults with your custom domain equivalents.
4. Update `EXPO_PUBLIC_SUPABASE_URL` (and related environment variables) in the main app to the new domain.
5. Update Google OAuth authorized redirect URIs to include
   `https://auth.wiznote.app/auth/v1/callback`.

The rewrites defined in `vercel.json` proxy all `/auth/*` and `/.well-known/*`
requests to your Supabase project so existing auth flows continue to work.

