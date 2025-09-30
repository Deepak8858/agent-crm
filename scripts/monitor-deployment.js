#!/usr/bin/env node

/**
 * Monitor DigitalOcean deployment progress
 */

const https = require('https');

console.log('🔍 Monitoring DigitalOcean Deployment...\n');
console.log('App: whale-app-ch6hu.ondigitalocean.app');
console.log('Fix: TailwindCSS moved to production dependencies\n');

let attempts = 0;
const maxAttempts = 20;
const intervalMs = 30000; // 30 seconds

async function checkDeployment() {
  attempts++;
  console.log(`📍 Attempt ${attempts}/${maxAttempts} - ${new Date().toLocaleTimeString()}`);
  
  return new Promise((resolve) => {
    const req = https.get('https://whale-app-ch6hu.ondigitalocean.app/api/health', {
      timeout: 10000,
      headers: { 'User-Agent': 'Deployment-Monitor/1.0' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ SUCCESS! App is now running');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response: ${body}`);
          console.log('\n🎉 Deployment completed successfully!');
          console.log('🔗 Your app is live at: https://whale-app-ch6hu.ondigitalocean.app');
          resolve(true);
        } else {
          console.log(`   Status: ${res.statusCode} - Still deploying...`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      if (error.code === 'ENOTFOUND') {
        console.log('   🔄 DNS not ready yet - Still deploying...');
      } else {
        console.log(`   ⚠️  Error: ${error.message}`);
      }
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('   ⏳ Timeout - App may still be starting...');
      req.destroy();
      resolve(false);
    });
  });
}

async function monitor() {
  console.log('Starting monitoring... (checking every 30 seconds)\n');
  
  const success = await checkDeployment();
  if (success) return;
  
  if (attempts >= maxAttempts) {
    console.log('\n❌ Max attempts reached. Please check DigitalOcean logs.');
    console.log('Dashboard: https://cloud.digitalocean.com/apps');
    return;
  }
  
  console.log(`   ⏳ Waiting 30 seconds before next check...\n`);
  setTimeout(monitor, intervalMs);
}

console.log('⚡ Expected timeline:');
console.log('   • Build: ~2-3 minutes');
console.log('   • Deploy: ~1-2 minutes');
console.log('   • DNS propagation: ~1 minute');
console.log('   • Total: ~5-10 minutes\n');

monitor();