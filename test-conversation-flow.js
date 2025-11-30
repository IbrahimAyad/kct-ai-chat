#!/usr/bin/env node

/**
 * Multi-Turn Conversation Test
 * Tests if the AI can hold a conversation without repeating clarification questions
 */

const API_URL = process.env.API_URL || 'https://kct-ai-chat-production.up.railway.app';

// Conversation scenarios to test
const conversations = [
  {
    name: "Black Suit for Black Tie Event",
    turns: [
      { message: "im looking ora black suit", expectedKeywords: ["black suit", "occasion", "formal"] },
      { message: "i have a black tie event to go to", expectedKeywords: ["black-tie", "white shirt", "bow tie", "shoes"] },
      { message: "the black suit i just asked about", expectedKeywords: ["black suit", "perfect", "ideal", "styling", "accessories"] }
    ]
  },
  {
    name: "Navy Suit for Wedding",
    turns: [
      { message: "navy suit", expectedKeywords: ["navy", "versatile", "occasion"] },
      { message: "wedding guest", expectedKeywords: ["wedding", "daytime", "evening", "navy"] },
      { message: "what time should I wear it", expectedKeywords: ["daytime", "evening", "navy", "gray"] }
    ]
  },
  {
    name: "First Suit Purchase",
    turns: [
      { message: "first suit", expectedKeywords: ["navy", "versatile", "first"] },
      { message: "budget around 500", expectedKeywords: ["budget", "500", "navy", "options"] },
      { message: "what fit should I get", expectedKeywords: ["fit", "modern", "slim", "classic"] }
    ]
  }
];

// Test a single conversation
async function testConversation(conversation) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📱 Testing: ${conversation.name}`);
  console.log('='.repeat(70));

  const sessionId = `test-conv-${Date.now()}`;
  let conversationPassed = true;
  const results = [];

  for (let i = 0; i < conversation.turns.length; i++) {
    const turn = conversation.turns[i];
    console.log(`\n💬 Turn ${i + 1}: "${turn.message}"`);

    try {
      const response = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: turn.message,
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        console.log(`   ❌ FAIL: HTTP ${response.status}`);
        conversationPassed = false;
        results.push({ turn: i + 1, passed: false, error: `HTTP ${response.status}` });
        continue;
      }

      const data = await response.json();
      const res = data.response || data;

      // Check if response contains expected keywords
      const responseLower = res.message.toLowerCase();
      const foundKeywords = turn.expectedKeywords.filter(kw =>
        responseLower.includes(kw.toLowerCase())
      );
      const keywordMatch = foundKeywords.length > 0;

      // Check for bad patterns (repeating clarification questions)
      const isRepeatQuestion =
        (i > 0 && responseLower.includes("i want to make sure i help you properly")) ||
        (i > 0 && responseLower.includes("are you shopping for a specific occasion")) ||
        (i === 2 && responseLower.includes("what occasion")); // Should NOT ask "what occasion" on turn 3

      // Display response
      console.log(`   🤖 Response: ${res.message.substring(0, 150)}${res.message.length > 150 ? '...' : ''}`);
      console.log(`   📊 Confidence: ${Math.round(res.confidence * 100)}%`);
      console.log(`   🎯 Intent: ${res.intent}`);

      if (foundKeywords.length > 0) {
        console.log(`   ✓ Found keywords: ${foundKeywords.join(', ')}`);
      }

      if (isRepeatQuestion) {
        console.log(`   ❌ FAIL: AI is repeating clarification questions instead of progressing`);
        conversationPassed = false;
        results.push({ turn: i + 1, passed: false, error: 'Repeat clarification question' });
      } else if (!keywordMatch && i > 0) {
        // For turns after the first, we're more strict about expected content
        console.log(`   ⚠️  Warning: Expected keywords not found (${turn.expectedKeywords.join(', ')})`);
        // Don't fail on keywords alone, just warn
        results.push({ turn: i + 1, passed: true, warning: 'Keywords not found but no repeat question' });
      } else {
        console.log(`   ✅ PASS: AI is progressing conversation`);
        results.push({ turn: i + 1, passed: true });
      }

      // Add delay between turns to simulate real conversation
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log(`   ❌ FAIL: ${error.message}`);
      conversationPassed = false;
      results.push({ turn: i + 1, passed: false, error: error.message });
    }
  }

  return { passed: conversationPassed, results };
}

// Run all tests
async function runTests() {
  console.log('\n🚀 MULTI-TURN CONVERSATION TEST SUITE');
  console.log(`📡 API Endpoint: ${API_URL}`);
  console.log(`⏰ Start Time: ${new Date().toLocaleTimeString()}`);

  const allResults = [];

  for (const conversation of conversations) {
    const result = await testConversation(conversation);
    allResults.push({ name: conversation.name, ...result });
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 CONVERSATION TEST SUMMARY');
  console.log('='.repeat(70));

  const passedConversations = allResults.filter(r => r.passed).length;
  const totalConversations = allResults.length;
  const passRate = Math.round((passedConversations / totalConversations) * 100);

  allResults.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const turnsPassed = result.results.filter(t => t.passed).length;
    const totalTurns = result.results.length;
    console.log(`${status} - ${result.name} (${turnsPassed}/${totalTurns} turns)`);
  });

  console.log('\n' + '='.repeat(70));
  console.log(`Overall: ${passedConversations}/${totalConversations} conversations passed (${passRate}%)`);
  console.log('='.repeat(70));

  if (passedConversations === totalConversations) {
    console.log('\n✅ ALL CONVERSATIONS PASSED! AI can hold multi-turn conversations.');
    process.exit(0);
  } else {
    console.log('\n❌ SOME CONVERSATIONS FAILED. AI needs improvement in conversation flow.');
    process.exit(1);
  }
}

runTests().catch(console.error);
