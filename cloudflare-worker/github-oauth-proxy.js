/**
 * GitHub OAuth Proxy for MifosLaunchpad
 *
 * Deploy this as a Cloudflare Worker to handle GitHub OAuth Device Flow
 * from static sites (GitHub Pages) that can't make cross-origin requests.
 *
 * Deployment:
 * 1. Go to https://dash.cloudflare.com/
 * 2. Click "Workers & Pages" → "Create application" → "Create Worker"
 * 3. Name it "github-oauth-proxy" and click "Deploy"
 * 4. Click "Edit code" and paste this entire file
 * 5. Click "Save and Deploy"
 * 6. Note your worker URL (e.g., https://github-oauth-proxy.YOUR-SUBDOMAIN.workers.dev)
 * 7. Update CORS_PROXY_URL in your app's github-oauth.ts
 */

const ALLOWED_ORIGINS = [
  'https://therajanmaurya.github.io',
  'https://openmf.github.io',
  'http://localhost:3000',
  'http://localhost:3001',
];

const GITHUB_ENDPOINTS = [
  'https://github.com/login/device/code',
  'https://github.com/login/oauth/access_token',
];

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the target URL from the request
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // Validate target URL is a GitHub OAuth endpoint
    if (!GITHUB_ENDPOINTS.some(endpoint => targetUrl.startsWith(endpoint))) {
      return new Response('Invalid target URL', { status: 403 });
    }

    // Check origin
    const origin = request.headers.get('Origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Origin not allowed', { status: 403 });
    }

    try {
      // Forward the request to GitHub
      const body = await request.text();

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'MifosLaunchpad-OAuth-Proxy',
        },
        body: body,
      });

      const responseBody = await response.text();

      // Return response with CORS headers
      return new Response(responseBody, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
        },
      });
    }
  },
};

function handleCORS(request) {
  const origin = request.headers.get('Origin');

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Origin not allowed', { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}
