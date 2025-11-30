#!/usr/bin/env node

/**
 * Test script for short-query handler integration
 * Tests common queries that were returning generic responses
 */

const API_URL = process.env.CHAT_API_URL || 'https://kct-ai-chat-production.up.railway.app';

const TEST_QUERIES = [
  { query: "black suit", expected: "specific response about black suits, not generic" },
  { query: "navy suit", expected: "specific navy suit recommendations" },
  { query: "wedding guest", expected: "specific wedding guest outfit advice" },
  { query: "what colors go well together", expected: "specific color combination advice" },
  { query: "first suit", expected: "beginner guidance with navy recommendation" },
  { query: "blue suit brown shoes", expected: "specific combination answer" }
];

async function testQuery(query) {
  console.log(`\n🧪 Testing: "${query}"`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${API_URL}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        sessionId: `test-${Date.now()}`
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle response format
    const res = data.response || data;

    console.log(`Intent: ${res.intent}`);
    console.log(`Confidence: ${(res.confidence * 100).toFixed(0)}%`);
    console.log(`Response: ${res.message.substring(0, 150)}${res.message.length > 150 ? '...' : ''}`);

    // Check if it's a generic response
    const isGeneric = res.message.includes("I'm here to help") ||
                      res.message.includes("I'd be happy to help") ||
                      res.message.includes("I want to make sure I help you properly") ||
                      res.confidence < 0.75;

    if (isGeneric) {
      console.log('❌ FAILED: Generic response detected');
      return false;
    } else {
      console.log('✅ PASSED: Specific response');
      return true;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🚀 TESTING SHORT-QUERY HANDLER INTEGRATION');
  console.log('API:', API_URL);
  console.log('═'.repeat(60));

  let passed = 0;
  let failed = 0;

  for (const test of TEST_QUERIES) {
    const result = await testQuery(test.query);
    if (result) {
      passed++;
    } else {
      failed++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESULTS:');
  console.log(`✅ Passed: ${passed}/${TEST_QUERIES.length}`);
  console.log(`❌ Failed: ${failed}/${TEST_QUERIES.length}`);
  console.log(`Success Rate: ${((passed/TEST_QUERIES.length) * 100).toFixed(0)}%`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
