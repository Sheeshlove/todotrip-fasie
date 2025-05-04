
import { Helmet } from 'react-helmet-async';

/**
 * Security Headers Component
 * 
 * This component adds security-related meta tags and headers to the page
 * to improve the application's security posture in line with ISO 27001 standards.
 * 
 * Note: For full implementation, these headers should also be set server-side
 */
export function SecurityHeaders() {
  return (
    <Helmet>
      {/* Content Security Policy - restricts sources of content */}
      <meta
        http-equiv="Content-Security-Policy"
        content={`
          default-src 'self';
          script-src 'self' 'unsafe-inline' https://hqrqmfejinsqisnjcrls.supabase.co;
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: https: blob:;
          font-src 'self' data:;
          connect-src 'self' https://hqrqmfejinsqisnjcrls.supabase.co wss://hqrqmfejinsqisnjcrls.supabase.co;
          frame-ancestors 'none';
          form-action 'self';
          base-uri 'self';
        `}
      />

      {/* X-XSS-Protection - enables browser's XSS filtering */}
      <meta http-equiv="X-XSS-Protection" content="1; mode=block" />

      {/* X-Content-Type-Options - prevents MIME type sniffing */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />

      {/* Referrer-Policy - controls how much referrer information is sent */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Permissions Policy - controls which browser features the site can use */}
      <meta
        http-equiv="Permissions-Policy"
        content="camera=(), microphone=(), geolocation=(self), interest-cohort=()"
      />

      {/* Cache control to prevent caching of sensitive data */}
      <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, proxy-revalidate" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />

      {/* Cross Origin Resource Policy - prevents leakage across origins */}
      <meta http-equiv="Cross-Origin-Resource-Policy" content="same-origin" />

      {/* Cross Origin Embedder Policy - ensures resources are same-origin or explicitly allowed */}
      <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />

      {/* Cross Origin Opener Policy - prevents window references being shared */}
      <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
    </Helmet>
  );
}

export default SecurityHeaders;
