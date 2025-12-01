#!/usr/bin/env node

/**
 * Compare Old System vs New Tool-Based System
 * Tests the same queries against both implementations
 */

const API_URL = process.env.API_URL || 'https://kct-ai-chat-production.up.railway.app';

// Critical test cases that are currently failing
const testCases = [
  {
    name: "Color Combination Question",
    query: "can I wear brown shoes with navy",
    expectedBehavior: "Specific answer about brown+navy (Fashion Expert knowledge)"
  },
  {
    name: "Black Suit Follow-up",
    conversation: [
      "im looking ora black suit",
      "i have a black tie event to go to",
      "the black suit i just asked about"
    ],
    expectedBehavior: "Should build on conversation, give complete outfit advice"
  },
  {
    name: "Typo Handling",
    query: "navey sute for weddings",
    expectedBehavior: "Should understand 'navy suit for weddings'"
  },
  {
    name: "Price Only Query",
    query: "under $300",
    expectedBehavior: "Should ask what they're looking for in that budget"
  },
  {
    name: "Multi-Occasion",
    query: "suit for both interviews and weddings",
    expectedBehavior: "Should recommend versatile option (navy)"
  }
];

async function testQuery(query, sessionId, systemType) {
  const response = await fetch(`${API_URL}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: query, sessionId })
  });

  if (!response.ok) {
    return { error: `HTTP ${response.status}` };
  }

  const data = await response.json();
  const res = data.response || data;

  return {
    message: res.message,
    intent: res.intent,
    confidence: res.confidence,
    isGeneric: res.message.includes("I'm here to help") ||
               res.message.includes("I want to make sure I help you properly") ||
               res.confidence < 0.6
  };
}

async function testConversation(messages, sessionId, systemType) {
  const responses = [];

  for (const msg of messages) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = await testQuery(msg, sessionId, systemType);
    responses.push({ query: msg, ...result });
  }

  return responses;
}

async function runComparison() {
  console.log('\n🔬 OLD SYSTEM vs NEW TOOL-BASED SYSTEM COMPARISON');
  console.log('='.repeat(80));
  console.log(`API: ${API_URL}`);
  console.log(`Time: ${new Date().toLocaleTimeString()}\n`);

  console.log('⚠️  NOTE: New system requires USE_TOOL_BASED_AI=true in Railway env vars');
  console.log('         Currently both tests will use OLD system unless env var is set\n');

  for (const testCase of testCases) {
    console.log('='.repeat(80));
    console.log(`📋 TEST: ${testCase.name}`);
    console.log(`🎯 Expected: ${testCase.expectedBehavior}`);
    console.log('-'.repeat(80));

    if (testCase.conversation) {
      // Multi-turn conversation test
      const sessionId = `compare-conv-${Date.now()}`;

      console.log('\n📝 Testing Conversation:');
      const results = await testConversation(testCase.conversation, sessionId);

      results.forEach((r, i) => {
        console.log(`\nTurn ${i + 1}: "${r.query}"`);
        console.log(`  Response: ${r.message.substring(0, 100)}...`);
        console.log(`  Status: ${r.isGeneric ? '❌ Generic' : '✅ Specific'}`);
        console.log(`  Confidence: ${Math.round(r.confidence * 100)}%`);
      });

      const allSpecific = results.every(r => !r.isGeneric);
      console.log(`\nResult: ${allSpecific ? '✅ PASS' : '❌ FAIL'} - ${allSpecific ? 'All turns specific' : 'Some turns generic'}`);

    } else {
      // Single query test
      const sessionId = `compare-single-${Date.now()}`;

      console.log(`\n💬 Query: "${testCase.query}"`);
      const result = await testQuery(testCase.query, sessionId);

      if (result.error) {
        console.log(`  ❌ Error: ${result.error}`);
      } else {
        console.log(`  Response: ${result.message.substring(0, 150)}...`);
        console.log(`  Status: ${result.isGeneric ? '❌ Generic' : '✅ Specific'}`);
        console.log(`  Confidence: ${Math.round(result.confidence * 100)}%`);
        console.log(`  Intent: ${result.intent}`);
        console.log(`\nResult: ${result.isGeneric ? '❌ FAIL' : '✅ PASS'}`);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPARISON COMPLETE');
  console.log('='.repeat(80));
  console.log('\nTo enable new system:');
  console.log('1. Go to Railway dashboard');
  console.log('2. Add environment variable: USE_TOOL_BASED_AI=true');
  console.log('3. Wait for redeploy');
  console.log('4. Run this test again to see difference\n');
}

runComparison().catch(console.error);
