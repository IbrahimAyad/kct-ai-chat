#!/usr/bin/env node

const API_URL = process.env.API_URL || 'https://kct-ai-chat-production.up.railway.app';

const edgeCases = [
  {
    name: "Typos and Misspellings",
    query: "im intrested in navey sutes for weddings",
    expectedBehavior: "Should still understand navy suits for weddings"
  },
  {
    name: "Very Short Query",
    query: "help",
    expectedBehavior: "Should ask clarifying questions"
  },
  {
    name: "Very Long Query",
    query: "I have a wedding coming up in June and I need a complete outfit including the suit jacket pants shirt tie shoes and maybe a pocket square what do you recommend",
    expectedBehavior: "Should handle long query and extract occasion=wedding"
  },
  {
    name: "Mixed Context",
    query: "navy suit but also looking at tuxedos",
    expectedBehavior: "Should handle multiple product types"
  },
  {
    name: "Price Range Query",
    query: "under $300",
    expectedBehavior: "Should understand budget constraint"
  },
  {
    name: "Vague Reference",
    query: "what about that",
    expectedBehavior: "Should handle vague reference or ask for clarification"
  },
  {
    name: "Multi-Occasion",
    query: "suit for both interviews and weddings",
    expectedBehavior: "Should recommend versatile option like navy"
  },
  {
    name: "Comparison Question",
    query: "difference between slim fit and regular fit",
    expectedBehavior: "Should explain fit differences"
  },
  {
    name: "Color Combination",
    query: "can I wear brown shoes with navy",
    expectedBehavior: "Should give specific yes/no with styling advice"
  },
  {
    name: "Size Question Without Context",
    query: "what size am I",
    expectedBehavior: "Should ask for measurements"
  }
];

async function testEdgeCase(testCase) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🧪 Testing: ${testCase.name}`);
  console.log(`📝 Query: "${testCase.query}"`);
  console.log(`🎯 Expected: ${testCase.expectedBehavior}`);
  console.log('-'.repeat(70));

  try {
    const response = await fetch(`${API_URL}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: testCase.query,
        sessionId: `edge-${Date.now()}-${Math.random()}`
      })
    });

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      return { passed: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const res = data.response || data;

    console.log(`🤖 Response: ${res.message.substring(0, 200)}${res.message.length > 200 ? '...' : ''}`);
    console.log(`📊 Confidence: ${Math.round(res.confidence * 100)}%`);
    console.log(`🎯 Intent: ${res.intent}`);

    // Check if response is generic/unhelpful
    const isGeneric = res.message.includes("I'm here to help") ||
                     res.message.includes("I want to make sure I help you properly") ||
                     res.confidence < 0.5;

    if (isGeneric) {
      console.log(`⚠️  Warning: Generic response (might not be handling edge case well)`);
      return { passed: false, reason: 'Generic response' };
    } else {
      console.log(`✅ Specific response provided`);
      return { passed: true };
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n🧪 EDGE CASE TEST SUITE');
  console.log(`📡 API Endpoint: ${API_URL}`);
  console.log(`⏰ Start Time: ${new Date().toLocaleTimeString()}\n`);

  const results = [];

  for (const testCase of edgeCases) {
    const result = await testEdgeCase(testCase);
    results.push({ name: testCase.name, ...result });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 EDGE CASE TEST SUMMARY');
  console.log('='.repeat(70));

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;

  results.forEach(result => {
    const status = result.passed ? '✅' : '⚠️';
    console.log(`${status} ${result.name}${result.reason ? ` (${result.reason})` : ''}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log(`Overall: ${passedTests}/${totalTests} edge cases handled well (${Math.round(passedTests/totalTests*100)}%)`);
  console.log('='.repeat(70));
}

runTests().catch(console.error);
