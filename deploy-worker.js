#!/usr/bin/env node

/**
 * Deploy script for Maneh Blog Cloudflare Worker
 * This script helps deploy the worker to Cloudflare
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Maneh Blog Worker Deploy Script');
console.log('=====================================');

// Check if worker.js exists
const workerPath = path.join(__dirname, 'worker.js');
if (!fs.existsSync(workerPath)) {
  console.error('❌ worker.js not found!');
  process.exit(1);
}

// Check if wrangler.toml exists
const wranglerPath = path.join(__dirname, 'wrangler.toml');
if (!fs.existsSync(wranglerPath)) {
  console.error('❌ wrangler.toml not found!');
  process.exit(1);
}

console.log('✅ Files found:');
console.log('  - worker.js');
console.log('  - wrangler.toml');

console.log('\n📋 Deployment Instructions:');
console.log('1. Install Wrangler CLI:');
console.log('   npm install -g wrangler');
console.log('   # or');
console.log('   yarn global add wrangler');

console.log('\n2. Login to Cloudflare:');
console.log('   wrangler login');

console.log('\n3. Deploy the worker:');
console.log('   wrangler deploy');

console.log('\n4. Test the worker:');
console.log('   curl https://maneh.blog/health');
console.log('   curl https://maneh.blog/api/test');
console.log('   curl https://maneh.blog/v/wvirljcebcp7');

console.log('\n🔧 Worker Features:');
console.log('  ✅ CORS enabled for all requests');
console.log('  ✅ Video proxy at /v/{videoId}');
console.log('  ✅ Health check at /health');
console.log('  ✅ CORS test at /api/test');
console.log('  ✅ Security headers included');
console.log('  ✅ Error handling with JSON responses');

console.log('\n🌐 Expected URLs after deployment:');
console.log('  - https://maneh.blog/health');
console.log('  - https://maneh.blog/api/test');
console.log('  - https://maneh.blog/v/wvirljcebcp7');

console.log('\n⚠️  Important Notes:');
console.log('  - Make sure your domain maneh.blog is configured in Cloudflare');
console.log('  - The worker will proxy requests to quaxy.my');
console.log('  - CORS is enabled to fix the cross-origin issues');
console.log('  - All responses include proper security headers');

console.log('\n🎯 Ready to deploy!');
