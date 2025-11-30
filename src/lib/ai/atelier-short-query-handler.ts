/**
 * Atelier AI Short Query Handler
 * Intelligently interprets 2-7 word customer queries
 * Uses intent detection and context expansion
 */

export interface ShortQueryIntent {
  intent: string;
  confidence: number;
  expandedQuery: string;
  context: {
    category?: string;
    occasion?: string;
    urgency?: 'immediate' | 'planning' | 'browsing';
    priceRange?: 'budget' | 'mid' | 'luxury';
    style?: string;
  };
  suggestedFollowUps: string[];
}

// INTENT PATTERNS FOR SHORT QUERIES
export const SHORT_QUERY_PATTERNS = {
  // 2-3 WORD PATTERNS
  twoThreeWords: {
    // Product queries
    "navy suit": {
      intent: "product_specific",
      expanded: "I'm looking for a navy suit - what options do you have?",
      context: { category: "suits", style: "classic" },
      followUps: ["What's the occasion?", "What's your budget?", "Preferred fit?"]
    },
    "best suit": {
      intent: "recommendation",
      expanded: "What's the best suit you recommend for versatility?",
      context: { category: "suits", urgency: "planning" },
      followUps: ["Business or social?", "First suit?", "Color preference?"]
    },
    "wedding guest": {
      intent: "occasion",
      expanded: "What should I wear as a wedding guest?",
      context: { occasion: "wedding", urgency: "planning" },
      followUps: ["Daytime or evening?", "Beach or church?", "How formal?"]
    },
    "first suit": {
      intent: "beginner",
      expanded: "I need help choosing my first suit - where do I start?",
      context: { category: "suits", urgency: "planning", priceRange: "budget" },
      followUps: ["What's your budget?", "Main use?", "Color preference?"]
    },
    "interview tomorrow": {
      intent: "urgent",
      expanded: "I have an interview tomorrow - what should I wear?",
      context: { occasion: "business", urgency: "immediate" },
      followUps: ["Industry?", "Have a suit?", "Need full outfit?"]
    },
    "prom suit": {
      intent: "occasion",
      expanded: "I need a suit for prom - what's trendy and appropriate?",
      context: { occasion: "prom", category: "suits", style: "trendy" },
      followUps: ["Traditional or bold?", "Color preference?", "Date's outfit?"]
    },
    "tie help": {
      intent: "accessory",
      expanded: "I need help choosing the right tie",
      context: { category: "accessories" },
      followUps: ["What suit color?", "What occasion?", "Pattern preference?"]
    },
    "too expensive": {
      intent: "price_concern",
      expanded: "These prices are too high - do you have budget options?",
      context: { priceRange: "budget", urgency: "browsing" },
      followUps: ["What's your budget?", "Open to alternatives?", "Payment plans?"]
    },
    "what's trending": {
      intent: "trends",
      expanded: "What are the current fashion trends for men?",
      context: { urgency: "browsing", style: "trendy" },
      followUps: ["Formal or casual?", "Age range?", "Specific items?"]
    },
    "color match": {
      intent: "styling",
      expanded: "How do I match colors properly?",
      context: { category: "styling" },
      followUps: ["Specific colors?", "Suit or casual?", "Color blind?"]
    }
  },

  // 4-5 WORD PATTERNS
  fourFiveWords: {
    "blue suit brown shoes": {
      intent: "combination_check",
      expanded: "Can I wear brown shoes with a blue suit?",
      context: { category: "styling", style: "classic" },
      followUps: ["Navy or light blue?", "What occasion?", "Belt color?"]
    },
    "what to wear wedding": {
      intent: "occasion",
      expanded: "What should I wear to a wedding?",
      context: { occasion: "wedding", urgency: "planning" },
      followUps: ["Guest or party?", "Season?", "Venue type?"]
    },
    "need suit by friday": {
      intent: "urgent_purchase",
      expanded: "I urgently need a suit by Friday - what are my options?",
      context: { urgency: "immediate", category: "suits" },
      followUps: ["Size known?", "Color preference?", "Budget?"]
    },
    "first time suit buyer": {
      intent: "beginner",
      expanded: "I'm buying my first suit and need complete guidance",
      context: { urgency: "planning", priceRange: "budget" },
      followUps: ["Primary use?", "Budget range?", "Body type?"]
    },
    "black tie event help": {
      intent: "formal_occasion",
      expanded: "I need help understanding black tie dress code",
      context: { occasion: "formal", urgency: "planning" },
      followUps: ["Own a tuxedo?", "Rental option?", "Full outfit needed?"]
    },
    "suit doesn't fit right": {
      intent: "fit_issue",
      expanded: "My suit doesn't fit properly - what adjustments do I need?",
      context: { category: "alterations" },
      followUps: ["Where's the issue?", "Recently purchased?", "Weight change?"]
    },
    "summer wedding outfit ideas": {
      intent: "seasonal_occasion",
      expanded: "What should I wear to a summer wedding?",
      context: { occasion: "wedding", style: "seasonal" },
      followUps: ["Outdoor or indoor?", "Daytime?", "How formal?"]
    },
    "business casual confused help": {
      intent: "dress_code",
      expanded: "I'm confused about business casual - can you explain?",
      context: { occasion: "business", urgency: "planning" },
      followUps: ["Industry?", "Office culture?", "Examples needed?"]
    }
  },

  // 6-7 WORD PATTERNS
  sixSevenWords: {
    "need help choosing suit for interview": {
      intent: "occasion_specific",
      expanded: "I need help selecting the right suit for my job interview",
      context: { occasion: "business", category: "suits", urgency: "planning" },
      followUps: ["Industry?", "Company culture?", "First interview?"]
    },
    "what color tie with navy suit": {
      intent: "specific_combination",
      expanded: "What color tie works best with a navy suit?",
      context: { category: "accessories", style: "classic" },
      followUps: ["Occasion?", "Shirt color?", "Formal level?"]
    },
    "how much should I spend suit": {
      intent: "budget_guidance",
      expanded: "What's a reasonable budget for a quality suit?",
      context: { priceRange: "mid", urgency: "planning" },
      followUps: ["First suit?", "Frequency of wear?", "Career stage?"]
    },
    "can you help me find style": {
      intent: "style_discovery",
      expanded: "I want to discover my personal style - can you help?",
      context: { urgency: "browsing", style: "exploring" },
      followUps: ["Current wardrobe?", "Lifestyle?", "Style icons?"]
    },
    "best suit color for brown skin": {
      intent: "personal_recommendation",
      expanded: "What suit colors look best on brown skin tones?",
      context: { category: "suits", style: "personalized" },
      followUps: ["Warm or cool undertones?", "Occasion?", "Current wardrobe?"]
    }
  }
};

// INTELLIGENT QUERY ANALYZER
export function analyzeShortQuery(query: string): ShortQueryIntent {
  const words = query.toLowerCase().trim().split(/\s+/);
  const wordCount = words.length;
  
  // Direct pattern matching
  const patterns = wordCount <= 3 ? SHORT_QUERY_PATTERNS.twoThreeWords :
                   wordCount <= 5 ? SHORT_QUERY_PATTERNS.fourFiveWords :
                   SHORT_QUERY_PATTERNS.sixSevenWords;
  
  // Check for exact matches
  for (const [pattern, data] of Object.entries(patterns)) {
    if (query.toLowerCase().includes(pattern)) {
      return {
        intent: data.intent,
        confidence: 95,
        expandedQuery: data.expanded,
        context: data.context,
        suggestedFollowUps: data.followUps
      };
    }
  }
  
  // Keyword-based intent detection
  return detectIntentByKeywords(query, words);
}

// KEYWORD-BASED INTENT DETECTION
function detectIntentByKeywords(query: string, words: string[]): ShortQueryIntent {
  const queryLower = query.toLowerCase();
  
  // Urgent keywords
  if (words.some(w => ['tomorrow', 'today', 'tonight', 'urgent', 'asap', 'quickly'].includes(w))) {
    return {
      intent: 'urgent',
      confidence: 90,
      expandedQuery: `I need immediate help with: ${query}`,
      context: { urgency: 'immediate' },
      suggestedFollowUps: ["What's the event?", "What do you have?", "Location nearby?"]
    };
  }
  
  // Price/budget keywords
  if (words.some(w => ['cheap', 'budget', 'affordable', 'expensive', 'cost', 'price', 'spend'].includes(w))) {
    return {
      intent: 'price_inquiry',
      confidence: 85,
      expandedQuery: `I have budget concerns about: ${query}`,
      context: { priceRange: 'budget', urgency: 'browsing' },
      suggestedFollowUps: ["Budget range?", "Payment plans available?", "Quality priorities?"]
    };
  }
  
  // Occasion keywords
  const occasions = {
    wedding: ['wedding', 'ceremony', 'reception'],
    business: ['interview', 'meeting', 'work', 'office', 'business'],
    prom: ['prom', 'dance', 'formal'],
    casual: ['casual', 'weekend', 'date', 'dinner'],
    party: ['party', 'event', 'celebration', 'birthday']
  };
  
  for (const [occasion, keywords] of Object.entries(occasions)) {
    if (words.some(w => keywords.includes(w))) {
      return {
        intent: 'occasion',
        confidence: 88,
        expandedQuery: `I need outfit advice for: ${query}`,
        context: { occasion, urgency: 'planning' },
        suggestedFollowUps: ["When is it?", "Dress code?", "Indoor/outdoor?"]
      };
    }
  }
  
  // Product keywords
  const products = {
    suits: ['suit', 'suits', 'tuxedo', 'tux'],
    shirts: ['shirt', 'shirts'],
    ties: ['tie', 'ties', 'bowtie'],
    shoes: ['shoes', 'shoe', 'loafers', 'oxfords'],
    accessories: ['belt', 'cufflinks', 'pocket', 'square', 'suspenders']
  };
  
  for (const [category, keywords] of Object.entries(products)) {
    if (words.some(w => keywords.includes(w))) {
      return {
        intent: 'product_inquiry',
        confidence: 85,
        expandedQuery: `Show me options for: ${query}`,
        context: { category, urgency: 'browsing' },
        suggestedFollowUps: ["Specific style?", "Color preference?", "Budget?"]
      };
    }
  }
  
  // Style/fit keywords
  if (words.some(w => ['fit', 'fits', 'size', 'sizing', 'tight', 'loose', 'big', 'small'].includes(w))) {
    return {
      intent: 'fit_help',
      confidence: 82,
      expandedQuery: `I need fit guidance for: ${query}`,
      context: { category: 'fitting' },
      suggestedFollowUps: ["Current size?", "Fit preference?", "Problem areas?"]
    };
  }
  
  // Help/advice keywords
  if (words.some(w => ['help', 'advice', 'suggest', 'recommend', 'what', 'which', 'how'].includes(w))) {
    return {
      intent: 'general_help',
      confidence: 75,
      expandedQuery: `I'm looking for advice about: ${query}`,
      context: { urgency: 'browsing' },
      suggestedFollowUps: ["Tell me more?", "Specific concerns?", "Past experience?"]
    };
  }
  
  // Default fallback
  return {
    intent: 'unclear',
    confidence: 60,
    expandedQuery: `Let me help you with: ${query}`,
    context: { urgency: 'browsing' },
    suggestedFollowUps: [
      "Looking for something specific?",
      "Shopping for an occasion?",
      "Need style advice?"
    ]
  };
}

// RESPONSE GENERATOR FOR SHORT QUERIES
export function generateShortQueryResponse(intent: ShortQueryIntent): {
  response: string;
  quickActions?: string[];
  clarificationNeeded: boolean;
} {
  const responses = {
    urgent: {
      response: "I understand you need this quickly! Here's what we can do right now:",
      quickActions: ["View ready-to-ship items", "Find local store", "Express shipping options"],
      clarificationNeeded: true
    },
    product_specific: {
      response: "Great choice! Let me show you our best options:",
      quickActions: ["View all options", "Filter by size", "See similar styles"],
      clarificationNeeded: false
    },
    occasion: {
      response: "I'll help you look perfect for the occasion. First, let me understand:",
      quickActions: ["View occasion guide", "See popular choices", "Complete outfit ideas"],
      clarificationNeeded: true
    },
    price_inquiry: {
      response: "Let's find something that fits your budget perfectly:",
      quickActions: ["Budget-friendly options", "Payment plans", "Current sales"],
      clarificationNeeded: true
    },
    beginner: {
      response: "Welcome! I'll guide you through everything step by step:",
      quickActions: ["Start with basics", "Style quiz", "Beginner's guide"],
      clarificationNeeded: false
    },
    fit_help: {
      response: "Let's get your fit perfect. I need to know:",
      quickActions: ["Size guide", "Fit types explained", "Virtual consultation"],
      clarificationNeeded: true
    },
    style_discovery: {
      response: "Exciting! Let's discover your signature style together:",
      quickActions: ["Take style quiz", "Browse lookbooks", "See trending styles"],
      clarificationNeeded: false
    },
    combination_check: {
      response: "Good question! Here's what works best:",
      quickActions: ["See examples", "Color guide", "Alternative options"],
      clarificationNeeded: false
    },
    general_help: {
      response: "I'm here to help! Tell me more about what you're looking for:",
      quickActions: ["Browse categories", "Popular items", "Style consultation"],
      clarificationNeeded: true
    },
    unclear: {
      response: "I want to help you find exactly what you need. Could you tell me:",
      quickActions: ["Browse all", "Contact stylist", "FAQ"],
      clarificationNeeded: true
    }
  };
  
  const responseData = responses[intent.intent as keyof typeof responses] || responses.unclear;
  
  return {
    response: responseData.response,
    quickActions: responseData.quickActions,
    clarificationNeeded: responseData.clarificationNeeded
  };
}

// CONTEXT-AWARE FOLLOW-UP BUILDER
export function buildFollowUpResponse(
  originalQuery: string,
  intent: ShortQueryIntent,
  additionalContext?: any
): string {
  // Build a complete, helpful response based on intent and context
  const intents = {
    urgent: `Since you need this urgently, here are your fastest options: Same-day pickup available for in-stock items, or express shipping for online orders. What's your deadline?`,
    
    product_specific: `Based on "${originalQuery}", I recommend our ${intent.context?.category || 'collection'}. We have several options in different fits and price points. What's most important to you?`,
    
    occasion: `For ${intent.context?.occasion || 'your event'}, you'll want to balance formality with personal style. ${intent.suggestedFollowUps[0]}`,
    
    price_inquiry: `I understand budget is important. Our ${intent.context?.category || 'items'} range from entry-level to luxury. What's your comfortable range?`,
    
    beginner: `Starting your wardrobe journey? Let's build from the essentials. A navy suit is your best first investment - versatile for interviews, weddings, and dinners. Ready to explore?`,
    
    fit_help: `Fit is everything! ${intent.suggestedFollowUps[0]} Once I know that, I can recommend specific adjustments or sizes.`,
    
    style_discovery: `Finding your style is a journey! Start with: What makes you feel confident? What's your lifestyle like? Who inspires you style-wise?`,
    
    combination_check: `${intent.expandedQuery} The answer is: ${getQuickStylingAnswer(originalQuery)}`,
    
    general_help: `I'm here to make this easy for you. ${intent.suggestedFollowUps[0]}`,
    
    unclear: `I want to make sure I help you properly. Are you shopping for a specific occasion, looking for style advice, or browsing our collections?`
  };
  
  return intents[intent.intent as keyof typeof intents] || intents.unclear;
}

// QUICK STYLING ANSWERS FOR COMMON QUESTIONS
function getQuickStylingAnswer(query: string): string {
  const queryLower = query.toLowerCase();
  
  // Color combinations
  if (queryLower.includes('blue') && queryLower.includes('brown')) {
    return "Yes! Navy/blue suits with brown shoes is a modern classic. Just match your belt to your shoes.";
  }
  if (queryLower.includes('black') && queryLower.includes('brown')) {
    return "Traditional rule: avoid brown with black. Modern take: if you're confident, dark brown can work with charcoal.";
  }
  
  // Tie questions
  if (queryLower.includes('tie') && queryLower.includes('navy')) {
    return "Burgundy, pink, or silver ties are perfect with navy. For safe: white or light blue.";
  }
  
  // Wedding specific
  if (queryLower.includes('wedding') && queryLower.includes('guest')) {
    return "Light gray for daytime, navy for evening. Never white (that's for the groom).";
  }
  
  // First suit
  if (queryLower.includes('first') && queryLower.includes('suit')) {
    return "Navy, every time. It's the Swiss Army knife of suits - works everywhere.";
  }
  
  return "Let me give you specific guidance for your situation.";
}

// EXPORT SHORT QUERY HANDLER
export const SHORT_QUERY_AI = {
  patterns: SHORT_QUERY_PATTERNS,
  analyze: analyzeShortQuery,
  generateResponse: generateShortQueryResponse,
  buildFollowUp: buildFollowUpResponse
};