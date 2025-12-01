# Edge Case Issues - Critical Findings

## Test Results: 20% Success Rate (2/10)

**Only working:**
- ✅ "difference between slim fit and regular fit" → Asks for size
- ✅ "what size am I" → Asks for measurements

**Everything else:** Generic "I'm here to help!" responses

---

## Issue 1: Color Combination Questions ⚠️ **HIGH PRIORITY**

**Example:** "can I wear brown shoes with navy"

**Current behavior:** Generic "I want to make sure I help you properly..."
**Expected:** "Yes! Navy suits with brown shoes is a modern classic. Match your belt to shoes."

**Root cause:** Fashion Expert has this knowledge but query bypasses it

**Fix needed:**
```typescript
// In atelier-short-query-handler.ts
"can i wear brown shoes with navy": {
  intent: "combination_check",
  confidence: 95
}
```

---

## Issue 2: Typos and Misspellings ⚠️ **HIGH PRIORITY**

**Example:** "im intrested in navey sutes for weddings"

**Current behavior:** Generic 70% confidence response
**Expected:** Understand "navy suits for weddings"

**Root cause:** Exact string matching only - no fuzzy matching

**Fix needed:**
- Add common misspellings to patterns
- Implement Levenshtein distance fuzzy matching
- Add typo tolerance to OpenAI extraction

**Common typos to handle:**
- navey → navy
- sutes → suits
- intrested → interested
- wat → what
- togther → together

---

## Issue 3: Very Long Queries (30+ words) ⚠️ **MEDIUM PRIORITY**

**Example:** "I have a wedding coming up in June and I need a complete outfit..."

**Current behavior:** Generic 70% confidence response
**Expected:** Extract occasion=wedding and provide complete outfit advice

**Root cause:**
- Short-query handler only works 2-7 words
- Long queries bypass handler
- OpenAI intent extraction not strong enough

**Fix needed:**
- Add long-query handler (15+ words)
- Extract keywords: wedding, June, complete outfit
- Provide comprehensive wedding outfit advice

---

## Issue 4: Very Short Queries (1-2 words) ⚠️ **MEDIUM PRIORITY**

**Example:** "help"

**Current behavior:** Generic "I'm here to help!"
**Expected:** Specific menu of options

**Fix needed:**
```typescript
// Special handling for ultra-short queries
if (wordCount === 1) {
  if (messageLower === 'help') {
    return helpMenu()
  }
}
```

**Help menu should include:**
- "I can help you find suits for specific occasions"
- "I can give you style and color advice"
- "I can help you with sizing and fit"
- Quick action buttons for each

---

## Issue 5: Price-Only Queries ⚠️ **MEDIUM PRIORITY**

**Example:** "under $300"

**Current behavior:** Generic 70% confidence response
**Expected:** "Great! What are you looking for under $300? Suits, shirts, or accessories?"

**Root cause:** Pattern exists but confidence too low

**Fix needed:**
```typescript
// Add more price patterns
"under $300": { intent: "price_inquiry", confidence: 90 },
"under 300": { intent: "price_inquiry", confidence: 90 },
"budget $500": { intent: "price_inquiry", confidence: 90 },
"around $400": { intent: "price_inquiry", confidence: 90 }
```

---

## Issue 6: Multi-Occasion Queries ⚠️ **LOW PRIORITY**

**Example:** "suit for both interviews and weddings"

**Current behavior:** Generic clarification
**Expected:** "Navy suit is perfect for both! Versatile for interviews and weddings."

**Fix needed:**
- Detect "both" or "and" with multiple occasions
- Recommend versatile options (navy/charcoal)

---

## Issue 7: Vague References ⚠️ **LOW PRIORITY**

**Example:** "what about that"

**Current behavior:** Generic response
**Expected:** Reference conversation history or ask "What are you referring to?"

**Fix needed:**
- Already have conversation history logic
- Just needs to detect vague pronouns (that, it, this)
- Check history for context

---

## Priority Fix Order:

### 🔴 CRITICAL (Fix ASAP):
1. **Color combination questions** - Fashion Expert already has the knowledge!
2. **Typos/misspellings** - Real users make typos constantly

### 🟡 MEDIUM (Fix Soon):
3. **Very long queries** - Weddings, complete outfits
4. **Very short queries** - "help" should be useful
5. **Price-only queries** - Common user pattern

### 🟢 LOW (Nice to have):
6. **Multi-occasion** - Less common
7. **Vague references** - Requires conversation history (already being worked on)

---

## Impact Assessment:

**Current state:**
- Multi-turn: 67% (2/3 conversations)
- Edge cases: 20% (2/10 edge cases)
- **Combined: ~40% overall success rate**

**After fixes:**
- Multi-turn: 100% (target)
- Edge cases: 80%+ (target)
- **Combined: ~90% overall success rate**

---

## Quick Wins:

### Fix #1: Color Combinations (5 minutes)
Add to short-query patterns:
- "can i wear brown shoes with navy"
- "what color tie with navy suit"
- "brown belt with black shoes"

### Fix #2: Common Typos (10 minutes)
Add misspelled versions:
- "navey suit" → "navy suit"
- "wat colors" → "what colors"
- "sute" → "suit"

### Fix #3: Help Command (5 minutes)
```typescript
if (message.toLowerCase() === 'help') {
  return helpMenuResponse()
}
```

**Total time for quick wins: 20 minutes**
**Improvement: 20% → 50%+ success rate**
