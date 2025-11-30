// KCT AI Chat Training Runner
// Tests the deployed Railway API with realistic conversation scenarios
// Runs weekly via GitHub Actions or manually for testing

const https = require('https');
const http = require('http');

// Configuration from environment or defaults
const CHAT_API_URL = process.env.CHAT_API_URL || 'http://localhost:3002';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 25;
const SCENARIO_COUNT = parseInt(process.env.SCENARIO_COUNT) || 25;
const REQUEST_DELAY = 200; // ms between requests
const BATCH_DELAY = 2000; // ms between batches

console.log('\n🚀 KCT AI CHAT TRAINING SYSTEM');
console.log('='.repeat(70));
console.log(`API Endpoint: ${CHAT_API_URL}`);
console.log(`Batch Size: ${BATCH_SIZE}`);
console.log(`Scenarios per Category: ${SCENARIO_COUNT}`);
console.log('='.repeat(70) + '\n');

class TrainingRunner {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      totalTests: 0,
      successful: 0,
      failed: 0,
      totalResponseTime: 0,
      categoryResults: new Map()
    };
  }

  async makeRequest(endpoint, method = 'POST', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(CHAT_API_URL + endpoint);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const lib = url.protocol === 'https:' ? https : http;
      const startTime = Date.now();

      const req = lib.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          try {
            const parsed = JSON.parse(responseData);
            resolve({
              statusCode: res.statusCode,
              data: parsed,
              responseTime
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              data: responseData,
              responseTime
            });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testConversation(category, scenarioIndex) {
    const sessionId = `training_${category.id}_${scenarioIndex}_${Date.now()}`;
    const messages = this.getMessagesForCategory(category.id);

    try {
      let successfulExchanges = 0;
      let totalResponseTime = 0;

      // Send each message in the conversation
      for (let i = 0; i < Math.min(2, messages.length); i++) {
        const response = await this.makeRequest('/api/chat/message', 'POST', {
          message: messages[i],
          sessionId: sessionId,
          context: {
            category: category.name,
            training: true
          }
        });

        totalResponseTime += response.responseTime;

        if (response.statusCode === 200 && response.data.success) {
          successfulExchanges++;
        }

        await this.sleep(100); // Small delay between messages
      }

      return {
        success: successfulExchanges > 0,
        exchanges: successfulExchanges,
        avgResponseTime: totalResponseTime / successfulExchanges,
        sessionId
      };

    } catch (error) {
      return {
        success: false,
        exchanges: 0,
        error: error.message
      };
    }
  }

  async runCategory(category) {
    console.log(`\n📁 Testing ${category.name} (${SCENARIO_COUNT} scenarios)...`);

    const categoryResult = {
      total: SCENARIO_COUNT,
      successful: 0,
      failed: 0,
      totalResponseTime: 0
    };

    // Process in batches
    for (let batchStart = 0; batchStart < SCENARIO_COUNT; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, SCENARIO_COUNT);
      const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;

      console.log(`   📦 Batch ${batchNum}: Testing scenarios ${batchStart + 1}-${batchEnd}...`);

      for (let i = batchStart; i < batchEnd; i++) {
        const result = await this.testConversation(category, i + 1);

        if (result.success) {
          categoryResult.successful++;
          categoryResult.totalResponseTime += result.avgResponseTime || 0;
        } else {
          categoryResult.failed++;
          if (result.error) {
            console.log(`     ⚠️ Scenario ${i + 1} failed: ${result.error}`);
          }
        }

        await this.sleep(REQUEST_DELAY);
      }

      // Pause between batches
      if (batchEnd < SCENARIO_COUNT) {
        await this.sleep(BATCH_DELAY);
      }
    }

    const successRate = ((categoryResult.successful / categoryResult.total) * 100).toFixed(1);
    const avgResponseTime = categoryResult.successful > 0
      ? (categoryResult.totalResponseTime / categoryResult.successful).toFixed(0)
      : 0;

    console.log(`   ✓ Completed: ${categoryResult.successful}/${categoryResult.total} successful (${successRate}%)`);
    console.log(`   ✓ Avg response time: ${avgResponseTime}ms`);

    this.results.categoryResults.set(category.name, categoryResult);
    this.results.totalTests += categoryResult.total;
    this.results.successful += categoryResult.successful;
    this.results.failed += categoryResult.failed;
    this.results.totalResponseTime += categoryResult.totalResponseTime;
  }

  async runAllTests() {
    const categories = [
      { id: 'wedding', name: 'Wedding Planning' },
      { id: 'career', name: 'Professional/Career' },
      { id: 'style', name: 'Style Advice' },
      { id: 'sizing', name: 'Sizing & Fit' },
      { id: 'budget', name: 'Budget Concerns' }
    ];

    console.log(`🎯 Testing ${categories.length} categories with ${SCENARIO_COUNT} scenarios each\n`);

    for (const category of categories) {
      await this.runCategory(category);
    }

    this.printReport();
  }

  printReport() {
    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const successRate = ((this.results.successful / this.results.totalTests) * 100).toFixed(1);
    const avgResponseTime = this.results.successful > 0
      ? (this.results.totalResponseTime / this.results.successful).toFixed(0)
      : 0;

    console.log('\n\n' + '='.repeat(70));
    console.log('📊 TRAINING COMPLETE - FINAL REPORT');
    console.log('='.repeat(70) + '\n');

    console.log('📈 OVERALL STATISTICS:');
    console.log(`   Total Scenarios Tested: ${this.results.totalTests}`);
    console.log(`   Total Conversations: ${this.results.successful}`);
    console.log(`   Successful: ${this.results.successful}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Overall Success Rate: ${successRate}%`);
    console.log(`   Avg Response Time: ${avgResponseTime}ms`);
    console.log(`   Total Training Time: ${totalTime} seconds\n`);

    console.log('🏆 CATEGORY PERFORMANCE:');
    console.log('-'.repeat(70));
    console.log('Category               | Success Rate | Avg Response Time');
    console.log('-'.repeat(70));

    this.results.categoryResults.forEach((stats, name) => {
      const categorySuccessRate = ((stats.successful / stats.total) * 100).toFixed(1);
      const categoryAvgTime = stats.successful > 0
        ? (stats.totalResponseTime / stats.successful).toFixed(0)
        : 0;

      console.log(
        `${name.padEnd(22)} | ${(categorySuccessRate + '%').padEnd(12)} | ${categoryAvgTime}ms`
      );
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ TRAINING COMPLETE!');
    console.log(`📊 Success Rate: ${successRate}% | Avg Response: ${avgResponseTime}ms`);
    console.log(`⏱️  Duration: ${totalTime} seconds`);
    console.log('='.repeat(70) + '\n');
  }

  getMessagesForCategory(categoryId) {
    const messageMap = {
      'wedding': [
        'I need a suit for my wedding in October',
        'What color would work best for an outdoor ceremony?'
      ],
      'career': [
        'I need professional attire for job interviews',
        'What would work for a tech company environment?'
      ],
      'style': [
        'I want to update my style for the new year',
        'What would you recommend for someone in their 30s?'
      ],
      'sizing': [
        'I\'m not sure about my suit size',
        'How should a jacket fit in the shoulders?'
      ],
      'budget': [
        'I need a suit but I\'m on a tight budget',
        'What\'s the best value option you have?'
      ]
    };

    return messageMap[categoryId] || [
      'I need help with menswear',
      'What would you recommend?'
    ];
  }
}

// Run the training
async function main() {
  const trainer = new TrainingRunner();

  console.log('⏰ Training Start Time:', new Date().toLocaleTimeString());
  console.log('-'.repeat(70));

  try {
    await trainer.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Training failed:', error.message);
    process.exit(1);
  }
}

main();
