#!/usr/bin/env node

/**
 * Deployment preparation script
 * Prepares the repository for DigitalOcean deployment
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Agent CRM for DigitalOcean Deployment\n');

async function runCommand(command, description) {
  console.log(`⏳ ${description}...`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ ${description} failed: ${error.message}`);
        reject(error);
      } else {
        console.log(`✅ ${description} completed`);
        if (stdout.trim()) console.log(`   ${stdout.trim()}`);
        resolve(stdout);
      }
    });
  });
}

async function checkGitStatus() {
  try {
    const status = await runCommand('git status --porcelain', 'Checking git status');
    if (status.trim()) {
      console.log('\n📋 Uncommitted changes found:');
      console.log(status);
      return false;
    }
    return true;
  } catch (error) {
    console.log('❌ Git not initialized or error checking status');
    return false;
  }
}

async function main() {
  try {
    // Step 1: Run pre-deployment validation
    console.log('📋 Step 1: Running pre-deployment validation...');
    await runCommand('npm run pre-deploy-check', 'Pre-deployment validation');

    // Step 2: Check git status
    console.log('\n📋 Step 2: Checking git repository...');
    const gitClean = await checkGitStatus();
    
    if (!gitClean) {
      console.log('\n🔧 Staging all changes for commit...');
      await runCommand('git add .', 'Staging changes');
      
      console.log('💾 Committing changes...');
      await runCommand('git commit -m "Prepare for DigitalOcean deployment - Add deployment configurations"', 'Committing changes');
    }

    // Step 3: Check if we're on main branch
    console.log('\n📋 Step 3: Checking git branch...');
    const branch = await runCommand('git branch --show-current', 'Getting current branch');
    if (branch.trim() !== 'main') {
      console.log(`⚠️  Currently on branch: ${branch.trim()}`);
      console.log('   Switching to main branch...');
      try {
        await runCommand('git checkout main', 'Switching to main branch');
      } catch (error) {
        console.log('   Creating main branch...');
        await runCommand('git checkout -b main', 'Creating main branch');
      }
    }

    // Step 4: Check remote repository
    console.log('\n📋 Step 4: Checking remote repository...');
    try {
      const remote = await runCommand('git remote get-url origin', 'Getting remote URL');
      console.log(`   Remote repository: ${remote.trim()}`);
    } catch (error) {
      console.log('⚠️  No remote repository configured!');
      console.log('   You need to create a GitHub repository and add it as remote:');
      console.log('   1. Create a new repository on GitHub');
      console.log('   2. Run: git remote add origin https://github.com/username/agent-crm.git');
      console.log('   3. Run this script again');
      return;
    }

    // Step 5: Push to remote
    console.log('\n📋 Step 5: Pushing to remote repository...');
    await runCommand('git push origin main', 'Pushing to remote');

    // Step 6: Display deployment instructions
    console.log('\n🎉 Repository is ready for deployment!\n');
    
    console.log('='.repeat(60));
    console.log('🚀 NEXT STEPS: Deploy to DigitalOcean');
    console.log('='.repeat(60));
    
    console.log('\n1. 🌐 Go to DigitalOcean Apps:');
    console.log('   https://cloud.digitalocean.com/apps\n');
    
    console.log('2. 📦 Create New App:');
    console.log('   - Click "Create App"');
    console.log('   - Select "GitHub" as source');
    console.log('   - Choose your agent-crm repository');
    console.log('   - Select "main" branch\n');
    
    console.log('3. ⚙️  Configure App:');
    console.log('   - Use the included .do/app.yaml configuration');
    console.log('   - Or manually configure:');
    console.log('     • Build Command: npm ci && npx prisma generate && npm run build');
    console.log('     • Run Command: npx prisma migrate deploy && npm start');
    console.log('     • Port: 3000\n');
    
    console.log('4. 🗄️  Add Database:');
    console.log('   - Add PostgreSQL database');
    console.log('   - Name: crm-db');
    console.log('   - Plan: Basic ($7/month) or higher\n');
    
    console.log('5. 🔐 Set Environment Variables:');
    console.log('   Required variables (see .env.example):');
    console.log('   - DATABASE_URL (auto-generated)');
    console.log('   - NEXTAUTH_SECRET (generate: openssl rand -base64 32)');
    console.log('   - NEXTAUTH_URL (auto-generated)');
    console.log('   - CLERK_SECRET_KEY (from Clerk dashboard)');
    console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk dashboard)\n');
    
    console.log('6. 🚀 Deploy:');
    console.log('   - Click "Create Resources"');
    console.log('   - Wait for build and deployment (5-10 minutes)');
    console.log('   - Test health endpoint: /api/health\n');
    
    console.log('📚 For detailed instructions, see: DEPLOYMENT.md');
    console.log('💰 Estimated cost: ~$12/month (Basic) or ~$27/month (Professional)');
    console.log('\n✨ Your CRM will be live at: https://your-app-name.ondigitalocean.app');

  } catch (error) {
    console.log(`\n❌ Deployment preparation failed: ${error.message}`);
    console.log('\nPlease fix the issues above and try again.');
    process.exit(1);
  }
}

main();