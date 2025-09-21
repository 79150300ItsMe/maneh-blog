// Enhanced Worker.js for Cloudflare Workers
// Deploy this to maneh.blog domain

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Get client IP for rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // CORS headers untuk mengatasi masalah CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    };
    
    // Security headers for all responses
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: http:; frame-ancestors 'self';"
    };
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          ...corsHeaders,
          ...securityHeaders
        }
      });
    }

    // Route untuk video proxy dengan enhanced security
    if (path.startsWith('/v/')) {
      // Input validation and sanitization
      const videoId = path.substring(3).replace(/[^a-zA-Z0-9_-]/g, '');
      
      if (!videoId || videoId.length < 3 || videoId.length > 50) {
        return new Response(JSON.stringify({
          error: "Invalid video ID format",
          message: "Video ID must be 3-50 characters long and contain only alphanumeric characters, hyphens, and underscores"
        }), { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders,
            ...securityHeaders
          }
        });
      }

      // URL target dengan validation
      const targetUrl = `https://quaxy.my/v/?id=${encodeURIComponent(videoId)}`;
      
      // Validate target URL
      try {
        new URL(targetUrl);
      } catch (e) {
        return new Response(JSON.stringify({
          error: "Invalid target URL",
          message: "Unable to construct valid target URL"
        }), { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders,
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
          'X-Request-ID': crypto.randomUUID(),
          'Origin': 'https://maneh.blog',
          'Referer': 'https://maneh.blog/'
        },
        method: request.method,
        body: request.body,
        redirect: 'follow'
      });

      // Fetch dengan error handling yang lebih baik
      try {
        const response = await fetch(proxyRequest);
        
        // Validate response
        if (!response.ok) {
          return new Response(JSON.stringify({
            error: `Upstream error: ${response.status}`,
            message: "The target service returned an error",
            status: response.status
          }), { 
            status: response.status,
            headers: { 
              'Content-Type': 'application/json; charset=utf-8',
              ...corsHeaders,
              ...securityHeaders
            }
          });
        }
        
        // Enhanced response dengan CORS dan security headers
        const responseHeaders = new Headers(response.headers);
        
        // Add CORS headers to the response
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        responseHeaders.set('Access-Control-Max-Age', '86400');
        
        // Add security headers
        responseHeaders.set('X-Content-Type-Options', 'nosniff');
        responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');
        responseHeaders.set('X-XSS-Protection', '1; mode=block');
        responseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Add caching headers
        responseHeaders.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
        responseHeaders.set('X-Cache-Status', 'HIT');
        responseHeaders.set('X-Proxy-By', 'Maneh-Proxy/1.0');

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders
        });

      } catch (error) {
        console.error('Proxy error:', error);
        return new Response(JSON.stringify({
          error: "Service temporarily unavailable",
          message: error.message,
          retryAfter: 30
        }), { 
          status: 502,
          headers: { 
            'Content-Type': 'application/json; charset=utf-8',
            'Retry-After': '30',
            ...corsHeaders,
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
        version: '1.0.0',
        cors: 'enabled',
        proxy: 'active'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders,
          ...securityHeaders
        }
      });
    }

    // API endpoint untuk testing CORS
    if (path === '/api/test') {
      return new Response(JSON.stringify({
        message: 'CORS test successful',
        timestamp: new Date().toISOString(),
        origin: request.headers.get('Origin') || 'unknown',
        userAgent: request.headers.get('User-Agent') || 'unknown'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders,
          ...securityHeaders
        }
      });
    }

    // Untuk semua path lain, redirect ke blog asli dengan security headers
    return Response.redirect("https://maneh.blog/", 302, {
      headers: {
        ...corsHeaders,
        ...securityHeaders
      }
    });
    
  } catch (error) {
    console.error('Worker error:', error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    });
  }
}
  