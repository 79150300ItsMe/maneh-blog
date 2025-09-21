# Uptime Monitoring Setup

## UptimeRobot Configuration

### Basic Setup
1. **Create Account**: [UptimeRobot.com](https://uptimerobot.com)
2. **Add Monitor**: 
   - Type: HTTP(s)
   - URL: https://maneh.blog
   - Name: Maneh Blog Main
   - Interval: 5 minutes

### Additional Monitors
- **Main Blog**: https://maneh.blog
- **CSS Loading**: https://maneh.blog/css/style.css
- **JS Loading**: https://maneh.blog/js/script.js
- **Sample Article**: https://maneh.blog/2025/09/19/1-optimasi-chatgpt-panduan-prompts

### Alert Channels
- **Email**: Primary notification
- **Webhook**: For automated responses
- **Status Page**: Public status page

## Alternative Monitoring Services

### Pingdom (Premium)
- More detailed performance metrics
- Global monitoring locations
- Advanced alerting

### StatusCake (Free Tier)
- 10 monitors free
- Email alerts
- Basic performance tracking

### Freshping (Free)
- 50 checks/month
- Email + Slack alerts
- Simple setup

## Health Check Endpoint

Add a health check endpoint for monitoring:

```javascript
// Add to js/script.js or create separate endpoint
function healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0',
    services: {
      css: document.querySelector('link[href*="style.css"]') ? 'ok' : 'error',
      js: typeof ARTICLES !== 'undefined' ? 'ok' : 'error',
      analytics: typeof gtag !== 'undefined' ? 'ok' : 'error'
    }
  };
}

// Expose health check for monitoring
window.healthCheck = healthCheck;
```

## Monitoring Checklist
- [ ] Setup UptimeRobot account
- [ ] Add main domain monitor (5 min interval)
- [ ] Add CSS/JS resource monitors
- [ ] Configure email alerts
- [ ] Test alert system
- [ ] Add sample article URL monitor
- [ ] Create status page (optional)
- [ ] Set up webhook notifications (optional)

## Expected Response Times
- **Main Page**: < 2 seconds
- **CSS/JS**: < 1 second
- **Articles**: < 3 seconds
- **API Responses**: < 500ms

## Action Items on Downtime
1. **Immediate**: Check Cloudflare status
2. **DNS Issues**: Verify DNS propagation
3. **Server Issues**: Check hosting provider
4. **CDN Issues**: Clear Cloudflare cache
5. **SSL Issues**: Verify certificate status
