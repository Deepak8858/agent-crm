#!/usr/bin/env node

/**
 * DigitalOcean Deployment Troubleshooting Guide
 * Helps diagnose common deployment issues
 */

console.log('🔍 DigitalOcean Deployment Troubleshooting\n');
console.log('App URL: https://whale-app-ch6hu.ondigitalocean.app/\n');

console.log('='.repeat(60));
console.log('🚨 STEP-BY-STEP TROUBLESHOOTING');
console.log('='.repeat(60));

console.log('\n1. 📊 CHECK DIGITALOCEAN DASHBOARD LOGS');
console.log('   Go to: https://cloud.digitalocean.com/apps');
console.log('   → Click on your "whale-app-ch6hu" app');
console.log('   → Go to "Runtime Logs" tab');
console.log('   → Look for errors in the logs\n');

console.log('   Common error patterns to look for:');
console.log('   ❌ "Error: connect ECONNREFUSED" = Database connection failed');
console.log('   ❌ "Error: PORT is not defined" = Port configuration issue');
console.log('   ❌ "Error: Cannot find module" = Build dependency issue');
console.log('   ❌ "Prisma migrate deploy failed" = Database migration issue');
console.log('   ❌ "NEXTAUTH_SECRET not found" = Environment variable missing\n');

console.log('2. 🔧 CHECK BUILD LOGS');
console.log('   → Go to "Build Logs" tab');
console.log('   → Verify the build completed successfully');
console.log('   → Look for npm install or build errors\n');

console.log('3. 🔐 VERIFY ENVIRONMENT VARIABLES');
console.log('   → Go to "Settings" tab');
console.log('   → Check "Environment Variables" section');
console.log('   → Ensure these are set:\n');

console.log('   Required Variables:');
console.log('   ✅ DATABASE_URL (should be auto-generated)');
console.log('   ✅ NODE_ENV = production');
console.log('   ✅ NEXTAUTH_SECRET (32+ characters)');
console.log('   ✅ NEXTAUTH_URL (should be your app URL)');
console.log('   ✅ CLERK_SECRET_KEY (starts with sk_live_)');
console.log('   ✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (starts with pk_live_)\n');

console.log('4. 🗄️  CHECK DATABASE CONNECTION');
console.log('   → Go to "Database" tab');
console.log('   → Verify PostgreSQL database is running');
console.log('   → Check if DATABASE_URL is properly linked\n');

console.log('5. ⚙️  VERIFY APP CONFIGURATION');
console.log('   → Go to "Settings" tab');
console.log('   → Check "Commands" section:');
console.log('   → Build Command: npm ci && npx prisma generate && npm run build');
console.log('   → Run Command: npx prisma migrate deploy && npm start');
console.log('   → Port: 3000\n');

console.log('='.repeat(60));
console.log('🛠️  QUICK FIXES');
console.log('='.repeat(60));

console.log('\n📋 Fix #1: Missing Environment Variables');
console.log('Add these environment variables in DigitalOcean dashboard:');
console.log('');
console.log('NODE_ENV=production');
console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64'));
console.log('NEXTAUTH_URL=https://whale-app-ch6hu.ondigitalocean.app');
console.log('');

console.log('📋 Fix #2: Update Build/Run Commands');
console.log('If using custom commands, update in Settings:');
console.log('Build: npm ci && npx prisma generate && npm run build');
console.log('Run: npx prisma migrate deploy && npm start');
console.log('');

console.log('📋 Fix #3: Redeploy Application');
console.log('After making changes:');
console.log('→ Go to "Deployments" tab');
console.log('→ Click "Create Deployment"');
console.log('→ Wait for new deployment to complete');
console.log('');

console.log('📋 Fix #4: Check Health Endpoint');
console.log('Once deployed, test:');
console.log('https://whale-app-ch6hu.ondigitalocean.app/api/health');
console.log('Should return: {"status":"healthy",...}');
console.log('');

console.log('='.repeat(60));
console.log('🆘 COMMON SOLUTIONS');
console.log('='.repeat(60));

console.log('\n🔧 Issue: "Cannot GET /"');
console.log('Solution: Next.js routing issue');
console.log('→ Check if build completed successfully');
console.log('→ Verify /dashboard redirect is working');
console.log('');

console.log('🔧 Issue: "Application Error"');
console.log('Solution: Runtime crash');
console.log('→ Check Runtime Logs for specific error');
console.log('→ Usually missing environment variables');
console.log('');

console.log('🔧 Issue: "502 Bad Gateway"');
console.log('Solution: App not starting properly');
console.log('→ Check run command configuration');
console.log('→ Verify database connection');
console.log('');

console.log('🔧 Issue: Database connection failed');
console.log('Solution: DATABASE_URL not set correctly');
console.log('→ Ensure DATABASE_URL is ${db.DATABASE_URL}');
console.log('→ Check database is running and connected');
console.log('');

console.log('='.repeat(60));
console.log('📞 NEXT STEPS');
console.log('='.repeat(60));

console.log('\n1. Check the logs first - they usually show the exact error');
console.log('2. Fix the most likely issue (environment variables)');
console.log('3. Redeploy the application');
console.log('4. Test the health endpoint');
console.log('5. If still failing, share the exact error from Runtime Logs');
console.log('');

console.log('💡 Pro Tip: The Runtime Logs will show you exactly what\'s wrong!');
console.log('   Most issues are missing environment variables or database connection.');
console.log('');

console.log('🔗 Useful Links:');
console.log('   • App Dashboard: https://cloud.digitalocean.com/apps');
console.log('   • Health Check: https://whale-app-ch6hu.ondigitalocean.app/api/health');
console.log('   • Documentation: DEPLOYMENT.md in your project');