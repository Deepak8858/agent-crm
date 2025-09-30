#!/usr/bin/env node

/**
 * Test the new DigitalOcean deployment
 */

const https = require('https');

console.log('🔍 Testing New DigitalOcean Deployment...\n');
console.log('App URL: https://lionfish-app-st3gx.ondigitalocean.app/\n');

async function testEndpoint(url, description) {
  console.log(`⏳ Testing ${description}...`);
  
  return new Promise((resolve) => {
    const req = https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CRM-Test-Tool/1.0'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
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
  const baseUrl = 'https://lionfish-app-st3gx.ondigitalocean.app';
  
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
  console.log('📊 DEPLOYMENT STATUS');
  console.log('='.repeat(50));
  
  if (mainResult.status === 200 || healthResult.status === 200) {
    console.log('🎉 SUCCESS! Your CRM is now LIVE!');
    console.log('');
    console.log('✅ Working URLs:');
    if (mainResult.status === 200) console.log(`   • Main: ${baseUrl}`);
    if (healthResult.status === 200) console.log(`   • Health: ${baseUrl}/api/health`);
    if (dashboardResult.status === 200) console.log(`   • Dashboard: ${baseUrl}/dashboard`);
    console.log('');
    console.log('🔗 Access your CRM at: ' + baseUrl);
  } else if (mainResult.error || healthResult.error) {
    console.log('❌ App appears to be down or still deploying');
    console.log('   Check DigitalOcean logs for build/runtime status');
  } else {
    console.log('⚠️  App is running but may have configuration issues');
    console.log(`   Main page status: ${mainResult.status}`);
    console.log(`   Health endpoint status: ${healthResult.status}`);
  }
  
  console.log('');
  console.log('🔗 DigitalOcean Dashboard: https://cloud.digitalocean.com/apps');
}

main().catch(console.error);