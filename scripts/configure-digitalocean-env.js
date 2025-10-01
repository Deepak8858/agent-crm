#!/usr/bin/env node

/**
 * DigitalOcean Environment Configuration Helper
 * Helps configure environment variables for the deployment
 */

console.log('🔧 DigitalOcean Environment Configuration');
console.log('=========================================\n');

console.log('📋 Required Environment Variables for DigitalOcean:');
console.log('');

console.log('1. NODE_ENV=production');
console.log('2. DATABASE_URL=${db.DATABASE_URL}  # Automatically provided by DO');
console.log('3. NEXTAUTH_SECRET=2zW4bfdt9NR5pBwKt21WTRmAMV8sbHcLxbZSH/zzBGg=');
console.log('4. NEXTAUTH_URL=https://lionfish-app-st3gx.ondigitalocean.app');
console.log('5. CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret');
console.log('6. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key');
console.log('7. NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in');
console.log('8. NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up');
console.log('9. NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard');
console.log('10. NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard');
console.log('');

console.log('🎯 Steps to Configure:');
console.log('1. Go to: https://cloud.digitalocean.com/apps');
console.log('2. Click your "lionfish-app-st3gx" app');
console.log('3. Go to "Settings" tab');
console.log('4. Click "App-Level Environment Variables"');
console.log('5. Add each variable above');
console.log('6. Click "Save" and redeploy');
console.log('');

console.log('⚠️  Critical: Replace Clerk keys with your actual keys from:');
console.log('   https://dashboard.clerk.com/');
console.log('');

console.log('🔍 After configuration, test with:');
console.log('   node scripts/test-new-deployment.js');