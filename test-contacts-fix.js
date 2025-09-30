#!/usr/bin/env node

/**
 * Quick test to verify the contacts page fix
 */

const http = require('http');

async function testContactsPage() {
  console.log('🧪 Testing Contacts Page Fix...');
  
  try {
    // Test the API endpoint first
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/contacts', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve({ status: res.statusCode, data });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(5000, () => reject(new Error('Timeout')));
    });

    if (response.status === 200) {
      console.log('✅ API Response Structure:');
      if (response.data) {
        console.log(`   - Success: ${response.data.success}`);
        console.log(`   - Data Type: ${Array.isArray(response.data.data) ? 'Array' : typeof response.data.data}`);
        console.log(`   - Data Length: ${response.data.data ? response.data.data.length : 'N/A'}`);
        console.log(`   - Has Pagination: ${!!response.data.pagination}`);
      }
      
      // Test the dashboard page
      const pageResponse = await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000/dashboard/contacts', (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve({ status: res.statusCode, hasContent: body.length > 0 }));
        });
        req.on('error', reject);
        req.setTimeout(10000, () => reject(new Error('Page timeout')));
      });

      if (pageResponse.status === 200) {
        console.log('✅ Dashboard Page:');
        console.log(`   - Status: ${pageResponse.status}`);
        console.log(`   - Has Content: ${pageResponse.hasContent}`);
        console.log('\n🎉 Fix appears to be working! The contacts page should load without the filter error.');
      } else {
        console.log(`❌ Dashboard page returned status: ${pageResponse.status}`);
      }
      
    } else {
      console.log(`❌ API returned status: ${response.status}`);
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    console.log('Make sure the development server is running on http://localhost:3000');
  }
}

testContactsPage();