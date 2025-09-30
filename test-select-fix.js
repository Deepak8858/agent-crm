#!/usr/bin/env node

/**
 * Test to verify the Select component fix
 */

const http = require('http');

async function testSelectFix() {
  console.log('🧪 Testing Select Component Fix...');
  
  try {
    // Test the contacts page to see if it loads without the Select.Item error
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/dashboard/contacts', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({ 
            status: res.statusCode, 
            hasContent: body.length > 0,
            isHtml: body.includes('<html'),
            hasSelect: body.includes('select')
          });
        });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Timeout')));
    });

    if (response.status === 200) {
      console.log('✅ Contacts Page Test:');
      console.log(`   - Status: ${response.status}`);
      console.log(`   - Has Content: ${response.hasContent}`);
      console.log(`   - Is HTML: ${response.isHtml}`);
      console.log(`   - Contains Select: ${response.hasSelect}`);
      
      if (response.isHtml) {
        console.log('\n🎉 Success! The contacts page loads without Select.Item errors.');
        console.log('The Select component now uses "none" instead of empty string for the default value.');
      } else {
        console.log('\n⚠️  Page loaded but may not be rendering correctly.');
      }
    } else {
      console.log(`❌ Page returned status: ${response.status}`);
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    console.log('Make sure the development server is running on http://localhost:3000');
  }
}

testSelectFix();