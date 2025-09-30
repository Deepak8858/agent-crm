#!/usr/bin/env node

/**
 * Quick diagnostic test for DigitalOcean deployment
 */

const https = require('https');
const http = require('http');

console.log('🔍 Testing DigitalOcean App: whale-app-ch6hu.ondigitalocean.app\n');

async function testEndpoint(url, description) {
  console.log(`⏳ Testing ${description}...`);
  
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CRM-Diagnostic-Tool/1.0'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
        if (body.length < 500) {
          console.log(`   Body: ${body}`);
        } else {
          console.log(`   Body: ${body.substring(0, 200)}... (truncated)`);
        }
        resolve({ status: res.statusCode, body, headers: res.headers });
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      resolve({ error: error.message });
    });
    
    req.on('timeout', () => {
      console.log(`   ❌ Timeout: Request took longer than 10 seconds`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });
  });
}

async function main() {
  const baseUrl = 'https://whale-app-ch6hu.ondigitalocean.app';
  
  console.log('📍 Testing endpoints:\n');
  
  // Test main page
  const mainResult = await testEndpoint(baseUrl, 'Main page (/)');
  console.log('');
  
  // Test health endpoint
  const healthResult = await testEndpoint(`${baseUrl}/api/health`, 'Health endpoint');
  console.log('');
  
  // Test dashboard
  const dashboardResult = await testEndpoint(`${baseUrl}/dashboard`, 'Dashboard page');
  console.log('');
  
  // Analysis
  console.log('='.repeat(50));
  console.log('📊 DIAGNOSTIC RESULTS');
  console.log('='.repeat(50));
  
  if (mainResult.error) {
    console.log('❌ CRITICAL: Cannot connect to the app at all');
    console.log('   This usually means:');
    console.log('   1. App failed to deploy completely');
    console.log('   2. App is crashing on startup');
    console.log('   3. DNS/networking issue');
    console.log('');
    console.log('✅ IMMEDIATE ACTION:');
    console.log('   1. Check DigitalOcean Runtime Logs immediately');
    console.log('   2. Look for build errors in Build Logs');
    console.log('   3. Verify all environment variables are set');
  } else if (mainResult.status === 404) {
    console.log('❌ App is running but routing is broken');
    console.log('   Next.js app started but pages not found');
    console.log('');
    console.log('✅ LIKELY FIXES:');
    console.log('   1. Build failed - check Build Logs');
    console.log('   2. Static files not generated properly');
    console.log('   3. Redeploy with correct build command');
  } else if (mainResult.status >= 500) {
    console.log('❌ App is running but has runtime errors');
    console.log('   Server error - likely environment/database issue');
    console.log('');
    console.log('✅ LIKELY FIXES:');
    console.log('   1. Check DATABASE_URL environment variable');
    console.log('   2. Verify database is running and accessible');
    console.log('   3. Check NEXTAUTH_SECRET is set');
  } else if (mainResult.status >= 200 && mainResult.status < 300) {
    console.log('✅ App is running successfully!');
    console.log('   The webpage should be working now.');
  }
  
  // Health endpoint analysis
  if (healthResult.status === 200) {
    console.log('✅ Health endpoint working - backend is healthy');
  } else if (healthResult.error) {
    console.log('❌ Health endpoint unreachable - app likely down');
  } else {
    console.log(`❌ Health endpoint returned ${healthResult.status} - check implementation`);
  }
  
  console.log('');
  console.log('🔗 Next Steps:');
  console.log('1. Check DigitalOcean App Dashboard Runtime Logs');
  console.log('2. Verify environment variables are set correctly');
  console.log('3. If needed, redeploy with: Create Deployment button');
  console.log('');
  console.log('Dashboard: https://cloud.digitalocean.com/apps');
}

main().catch(console.error);