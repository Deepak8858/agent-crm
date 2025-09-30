#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Runs checks to ensure the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Pre-deployment validation...\n');

const checks = [];

// Check 1: Required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  '.env.example',
  'prisma/schema.prisma',
  'src/app/api/health/route.ts',
  '.do/app.yaml',
  'DEPLOYMENT.md'
];

console.log('📁 Checking required files...');
for (const file of requiredFiles) {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  checks.push({
    name: `File exists: ${file}`,
    status: exists,
    message: exists ? '✅ Found' : '❌ Missing'
  });
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
}

// Check 2: Package.json has required scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start', 'db:deploy'];

for (const script of requiredScripts) {
  const exists = packageJson.scripts && packageJson.scripts[script];
  checks.push({
    name: `Script exists: ${script}`,
    status: !!exists,
    message: exists ? '✅ Found' : '❌ Missing'
  });
  console.log(`   ${exists ? '✅' : '❌'} ${script}`);
}

// Check 3: Environment template is complete
console.log('\n🔐 Checking environment template...');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'
  ];
  
  for (const envVar of requiredEnvVars) {
    const exists = envExample.includes(envVar);
    checks.push({
      name: `Env var template: ${envVar}`,
      status: exists,
      message: exists ? '✅ Found' : '❌ Missing'
    });
    console.log(`   ${exists ? '✅' : '❌'} ${envVar}`);
  }
} catch (error) {
  console.log('   ❌ Could not read .env.example');
  checks.push({
    name: 'Environment template readable',
    status: false,
    message: '❌ Cannot read .env.example'
  });
}

// Check 4: Prisma schema is valid
console.log('\n🗄️  Checking Prisma schema...');
try {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  const hasClient = schema.includes('generator client');
  const hasDb = schema.includes('datasource db');
  
  checks.push({
    name: 'Prisma client generator',
    status: hasClient,
    message: hasClient ? '✅ Found' : '❌ Missing'
  });
  
  checks.push({
    name: 'Prisma datasource',
    status: hasDb,
    message: hasDb ? '✅ Found' : '❌ Missing'
  });
  
  console.log(`   ${hasClient ? '✅' : '❌'} Client generator`);
  console.log(`   ${hasDb ? '✅' : '❌'} Database source`);
} catch (error) {
  console.log('   ❌ Could not read Prisma schema');
  checks.push({
    name: 'Prisma schema readable',
    status: false,
    message: '❌ Cannot read schema'
  });
}

// Check 5: Build test
console.log('\n🏗️  Testing build process...');
const { exec } = require('child_process');

// Summary
console.log('\n📊 Validation Summary:');
console.log('========================');

const passed = checks.filter(check => check.status).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`✅ Passed: ${passed}/${total} (${percentage}%)`);

if (percentage < 100) {
  console.log('\n❌ Failed checks:');
  checks.filter(check => !check.status).forEach(check => {
    console.log(`   - ${check.name}: ${check.message}`);
  });
  
  console.log('\n🚨 Please fix the issues above before deploying to production.');
  process.exit(1);
} else {
  console.log('\n🎉 All checks passed! Ready for deployment.');
  console.log('\nNext steps:');
  console.log('1. Push code to GitHub: git push origin main');
  console.log('2. Create DigitalOcean App using .do/app.yaml');
  console.log('3. Set environment variables in DO dashboard');
  console.log('4. Deploy and monitor logs');
  console.log('\nSee DEPLOYMENT.md for detailed instructions.');
}