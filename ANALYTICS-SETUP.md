# Analytics Setup Guide

## Google Analytics 4 Setup

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new Property → Choose "Google Analytics 4"
3. Set up Data Stream for Web
4. Copy your Measurement ID (format: G-XXXXXXXXXX)

### Step 2: Update index.html
Replace `GA_MEASUREMENT_ID` in index.html with your actual Measurement ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Step 3: Google Search Console
1. Go to [Search Console](https://search.google.com/search-console/)
2. Add Property → Choose "URL prefix"
3. Enter: https://maneh.blog
4. Verify using HTML tag method or DNS

### Custom Events Tracking
Blog automatically tracks:
- ✅ Page views with article metadata
- ✅ Article engagement (25%, 50%, 75%, 100% reading)
- ✅ Reading time completion
- ✅ Category performance
- ✅ User behavior patterns

### Key Metrics to Monitor
1. **Traffic Metrics**
   - Page views
   - Unique visitors
   - Session duration
   - Bounce rate

2. **Content Performance**
   - Article engagement rate
   - Reading completion rate
   - Category popularity
   - Search traffic

3. **User Behavior**
   - Traffic sources
   - Device usage
   - Geographic distribution
   - Time on site

### Enhanced Tracking Features
- **Reading Progress**: 25%, 50%, 75%, 100% milestones
- **Article Categories**: Automatic category tracking
- **Reading Time**: Calculated based on word count
- **Engagement Events**: Scroll depth, time spent
- **Performance Metrics**: Page load times, user interactions

## Implementation Status
- [x] GA4 base code implemented
- [x] Custom event tracking
- [x] Reading progress tracking
- [x] Article engagement metrics
- [ ] **REPLACE GA_MEASUREMENT_ID with actual ID**
- [ ] Verify Search Console setup
- [ ] Test event tracking in GA4 Real-time reports

## Next Steps
1. Replace placeholder measurement ID
2. Test analytics in incognito mode
3. Verify events appear in GA4 Real-time
4. Set up custom dashboards
5. Configure goals and conversions
