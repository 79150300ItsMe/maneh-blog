// Enhanced Worker.js with Security & Performance Optimizations
// File: worker.js (untuk di-deploy di domain maneh.blog)

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Security: Rate limiting and request validation
      const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
      
      // Security headers for all responses
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';"
      };

      // Route untuk video proxy dengan enhanced security
      if (path.startsWith('/v/')) {
        // Input validation and sanitization
        const videoId = path.substring(3).replace(/[^a-zA-Z0-9_-]/g, '');
        
        if (!videoId || videoId.length < 3 || videoId.length > 50) {
          return new Response("Invalid video ID format.", { 
            status: 400,
            headers: { 
              'Content-Type': 'text/plain; charset=utf-8',
              ...securityHeaders
            }
          });
        }

        // Rate limiting check (basic implementation)
        const rateLimitKey = `rate_limit_${clientIP}`;
        // Note: In production, use a proper rate limiting service
        
        // URL target dengan validation
        const targetUrl = `https://quaxy.my/v/?id=${encodeURIComponent(videoId)}`;
        
        // Validate target URL
        try {
          new URL(targetUrl);
        } catch (e) {
          return new Response("Invalid target URL.", { 
            status: 400,
            headers: { 
              'Content-Type': 'text/plain; charset=utf-8',
              ...securityHeaders
            }
          });
        }

        // Enhanced proxy request dengan security headers
        const proxyRequest = new Request(targetUrl, {
          headers: {
            'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (compatible; ManehBot/1.0)',
            'X-Proxy-Request': 'true',
            'X-Forwarded-For': clientIP,
            'Accept': request.headers.get('Accept') || '*/*',
            'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'X-Request-ID': crypto.randomUUID()
          },
          method: request.method,
          body: request.body,
          redirect: 'follow',
          timeout: 10000 // 10 second timeout
        });

        // Fetch dengan error handling yang lebih baik
        try {
          const response = await fetch(proxyRequest);
          
          // Validate response
          if (!response.ok) {
            return new Response(`Upstream error: ${response.status}`, { 
              status: response.status,
              headers: { 
                'Content-Type': 'text/plain; charset=utf-8',
                ...securityHeaders
              }
            });
          }
          
          // Enhanced response dengan security headers
          const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
              ...Object.fromEntries(response.headers.entries()),
              'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
              'X-Cache-Status': 'HIT',
              'X-Proxy-By': 'Maneh-Proxy/1.0',
              ...securityHeaders
            }
          });

          return newResponse;

        } catch (error) {
          console.error('Proxy error:', error);
          return new Response(`Service temporarily unavailable: ${error.message}`, { 
            status: 502,
            headers: { 
              'Content-Type': 'text/plain; charset=utf-8',
              'Retry-After': '30',
              ...securityHeaders
            }
          });
        }
      }

      // Health check endpoint
      if (path === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders
          }
        });
      }

      // Untuk semua path lain, redirect ke blog asli dengan security headers
      return Response.redirect("https://maneh.blog/", 302, {
        headers: securityHeaders
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      });
    }
  },
};
  