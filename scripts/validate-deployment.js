#!/usr/bin/env node

/**
 * DigitalOcean App Platform Deployment Script
 * Automates the deployment process with configuration validation
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 DigitalOcean Deployment Validator');
console.log('====================================\n');

// Check if app.yaml exists
const appYamlPath = path.join(process.cwd(), '.do', 'app.yaml');
if (!fs.existsSync(appYamlPath)) {
  console.error('❌ Error: .do/app.yaml not found!');
  console.log('📋 Run this first: Create .do/app.yaml file');
  process.exit(1);
}

// Read and parse YAML
let config;
try {
  const yamlContent = fs.readFileSync(appYamlPath, 'utf8');
  config = yaml.load(yamlContent);
  console.log('✅ YAML configuration loaded successfully');
} catch (error) {
  console.error('❌ Error parsing YAML:', error.message);
  process.exit(1);
}

// Validation checks
const checks = [
  {
    name: 'App Name',
    check: () => config.name && config.name !== 'agent-crm',
    fix: 'Update the "name" field in .do/app.yaml'
  },
  {
    name: 'GitHub Repository',
    check: () => {
      const service = config.services?.[0];
      return service?.github?.repo && !service.github.repo.includes('your-github-username');
    },
    fix: 'Update services[0].github.repo with your actual GitHub repository'
  },
  {
    name: 'Clerk Secret Key',
    check: () => {
      const service = config.services?.[0];
      const clerkSecret = service?.envs?.find(env => env.key === 'CLERK_SECRET_KEY');
      return clerkSecret && !clerkSecret.value.includes('your_actual');
    },
    fix: 'Update CLERK_SECRET_KEY with your actual Clerk secret key'
  },
  {
    name: 'Clerk Publishable Key',
    check: () => {
      const service = config.services?.[0];
      const clerkPublic = service?.envs?.find(env => env.key === 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
      return clerkPublic && !clerkPublic.value.includes('your_actual');
    },
    fix: 'Update NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY with your actual Clerk publishable key'
  },
  {
    name: 'Database Configuration',
    check: () => config.databases?.[0]?.name === 'agent-crm-db',
    fix: 'Database configuration looks good'
  },
  {
    name: 'Health Check Endpoint',
    check: () => {
      const service = config.services?.[0];
      return service?.health_check?.http_path === '/api/health';
    },
    fix: 'Health check configuration looks good'
  }
];

console.log('🔍 Configuration Validation:\n');

const results = checks.map(check => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}: ${passed ? 'OK' : check.fix}`);
  return passed;
});

const allPassed = results.every(result => result);

console.log('\n📊 Validation Summary:');
console.log(`✅ Passed: ${results.filter(r => r).length}/${results.length}`);
console.log(`❌ Failed: ${results.filter(r => !r).length}/${results.length}`);

if (allPassed) {
  console.log('\n🎉 Configuration is ready for deployment!');
  console.log('\n📋 Next Steps:');
  console.log('1. Commit and push your changes to GitHub');
  console.log('2. Go to https://cloud.digitalocean.com/apps');
  console.log('3. Create new app and upload .do/app.yaml');
  console.log('4. Deploy and monitor the build logs');
} else {
  console.log('\n⚠️  Please fix the issues above before deploying.');
  console.log('\n📖 See DIGITALOCEAN-DEPLOY.md for detailed instructions');
}

// Cost estimation
console.log('\n💰 Estimated Monthly Cost:');
console.log('- App Instance (basic-xxs): $5/month');
console.log('- PostgreSQL Database (basic-xxs): $7/month');
console.log('- Total: ~$12/month');

console.log('\n🔗 Useful Links:');
console.log('- DigitalOcean Apps: https://cloud.digitalocean.com/apps');
console.log('- Clerk Dashboard: https://dashboard.clerk.com/');
console.log('- Documentation: ./DIGITALOCEAN-DEPLOY.md');