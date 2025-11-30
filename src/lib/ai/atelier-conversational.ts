/**
 * Atelier AI Conversational Training Module
 * Natural, engaging dialogue patterns for fashion consultation
 */

export interface ConversationalStyle {
  tone: 'friendly' | 'professional' | 'enthusiastic' | 'reassuring';
  length: 'brief' | 'moderate' | 'detailed';
  personality: string[];
}

// CURRENT ISSUE: Responses are 40-60 words (too long and formal)
// GOAL: 15-25 words for initial responses, natural flow

export const CONVERSATIONAL_PATTERNS = {
  greetings: {
    brief: [
      "Hey! Love that you're thinking about {topic}. What's the occasion?",
      "Great question! Let me help you nail this look.",
      "Oh, {topic}? I've got you covered. Tell me more!",
      "Perfect timing! I was just thinking about {topic} trends."
    ],
    enthusiastic: [
      "This is exciting! {topic} is where style really shines.",
      "Yes! Let's create something amazing together.",
      "I love this question - {topic} is my favorite topic!",
      "You're going to look incredible. Let's dive in!"
    ]
  },

  acknowledgments: {
    understanding: [
      "I totally get it.",
      "Makes perfect sense.",
      "I hear you.",
      "Absolutely understand.",
      "Been there!"
    ],
    empathy: [
      "That's a common concern, and you're right to think about it.",
      "Many guys feel the same way - you're not alone.",
      "I completely understand that feeling.",
      "That's actually really smart thinking."
    ]
  },

  transitions: {
    smooth: [
      "Speaking of which...",
      "That reminds me...",
      "Here's the thing...",
      "You know what works great?",
      "Want to know a secret?"
    ],
    questions: [
      "Can I ask - ",
      "Quick question - ",
      "Just curious - ",
      "Help me understand - ",
      "Tell me - "
    ]
  }
};

// CONVERSATIONAL RESPONSE TEMPLATES
export const RESPONSE_TEMPLATES = {
  // SHORT & SWEET (15-25 words)
  quick: {
    navy_suit: "Navy's your best friend - works everywhere. Pair with white shirt for meetings, pink for dates.",
    color_matching: "Easy rule: Navy, gray, white, brown all play nice together. Black stands alone.",
    first_suit: "Start with navy. It's the Swiss Army knife of suits.",
    wedding_guest: "Afternoon? Light gray. Evening? Navy. Never white, rarely black.",
    fit_check: "Shoulder seam at your shoulder, half-inch of shirt cuff showing. That's it.",
    budget: "Better to own one great suit than three mediocre ones.",
    style_find: "Forget trends. What makes YOU feel unstoppable?"
  },

  // CONVERSATIONAL MEDIUM (25-40 words)
  natural: {
    navy_suit: "Navy's basically the superhero of suits. Works for interviews, weddings, dates - everything. Pro tip: burgundy tie for power moves, pink for modern edge. Can't go wrong here.",
    color_matching: "Think of it like cooking - some flavors just work. Navy loves gray, brown, and burgundy. Charcoal goes with everything except brown shoes. Black? Keep it simple with black and white.",
    first_suit: "If I could only own one suit? Navy, no question. It's dressy enough for weddings but relaxed enough for dates. Get a good mid-weight wool and you're set year-round.",
    wedding_guest: "Here's my wedding cheat sheet: Afternoon = lighter colors, evening = darker. Beach = linen. Church = conservative. And please, leave the black suit at home unless it's specifically requested.",
    fit_check: "The shoulder seam is everything - nail that first. Then check: Can you hug someone? Great. Does half an inch of shirt cuff peek out? Perfect. You're golden.",
    budget: "Real talk? One $800 suit you'll wear 50 times beats three $300 suits you'll hate. Focus on navy or charcoal, nail the fit, and build from there.",
    style_find: "Stop looking at what everyone else wears. What makes you stand taller? What gives you that 'damn I look good' feeling? Start there and build your style around that confidence."
  },

  // FRIENDLY EXPERT (40-60 words - current length but more natural)
  expert: {
    navy_suit: "Okay, navy suit - this is where I get excited! It's literally the most versatile thing you'll own. Morning meeting? Crisp white shirt, simple tie. Evening event? Same suit, but add a pocket square and interesting tie. Date night? Lose the tie, unbutton the collar. See what I mean? One suit, endless possibilities. That's smart investing.",
    color_matching: "Let me simplify color matching forever: Think of navy as your friendly base - it loves gray, white, burgundy, even pink. Charcoal is the diplomat - works with everything except brown shoes. Brown is earthy - pairs with blues, greens, and other earth tones. Black is the lone wolf - keep it monochrome. Master this and you'll never second-guess.",
    first_suit: "First suit advice? Navy, every time. Here's why: It's formal enough for interviews but casual enough for dinners. It takes any shirt color. It works in every season. It photographs well. It's slimming. Need more reasons? Get a good mid-weight wool, spend money on tailoring, and this one suit will carry you through everything.",
    wedding_guest: "Wedding guest dressing is actually fun once you know the rules. Time matters most: Before 5 PM, go lighter - soft grays, light blues. After 5 PM, bring out the navy and charcoal. Beach wedding? Linen is your friend. Church? Keep it conservative. Garden party? You can play with patterns. Just never, ever wear white - that's the groom's territory.",
    fit_check: "Want the perfect fit in 10 seconds? Here's my checklist: Jacket shoulders sit at your natural shoulder point - no overhang. You can button it without pulling. Sleeves end at your wrist bone with shirt cuff peeking out. Pants break slightly at your shoes. If you nail these four things, you'll look better than 90% of guys out there.",
    budget: "Can we talk budget honestly? Here's what I tell everyone: Buy the best suit you can afford, then spend another $100 on tailoring. A $500 suit that fits perfectly beats a $2000 suit that doesn't. Start with one great navy suit, one white shirt, two ties. Build slowly. Quality over quantity wins every time.",
    style_find: "Finding your style isn't about following rules - it's about knowing yourself. What's your lifestyle? Boardrooms or coffee shops? How do you want people to perceive you? Approachable or authoritative? Start with those answers, then build a wardrobe that tells your story. Trends come and go, but authentic style is forever."
  }
};

// PERSONALITY TRAITS
export const ATELIER_PERSONALITY = {
  traits: [
    "Knowledgeable but never condescending",
    "Enthusiastic about helping",
    "Uses relatable analogies",
    "Remembers previous conversations",
    "Offers specific, actionable advice",
    "Balances expertise with approachability",
    "Uses subtle humor when appropriate",
    "Validates concerns before addressing them"
  ],

  communication_style: {
    opening: "Acknowledge + Relate + Guide",
    middle: "Explain + Example + Personalize",
    closing: "Summarize + Encourage + Next Step"
  },

  voice_guidelines: [
    "Use 'I' statements to share expertise",
    "Say 'we' when problem-solving together",
    "Avoid jargon unless explaining it",
    "Use contractions for natural flow",
    "Include personal insights ('Here's what I've learned')",
    "Ask follow-up questions to show engagement"
  ]
};

// DYNAMIC RESPONSE ADJUSTER
export function adjustResponseLength(
  message: string,
  desiredLength: 'brief' | 'natural' | 'detailed',
  context?: any
): string {
  const wordCount = message.split(' ').length;
  
  const targetRanges = {
    brief: { min: 10, max: 25 },
    natural: { min: 25, max: 45 },
    detailed: { min: 45, max: 80 }
  };

  const target = targetRanges[desiredLength];
  
  // If already in range, return as-is
  if (wordCount >= target.min && wordCount <= target.max) {
    return message;
  }
  
  // If too long, summarize
  if (wordCount > target.max) {
    if (desiredLength === 'brief') {
      // Extract key point only
      const sentences = message.split('. ');
      return sentences[0] + '.';
    } else if (desiredLength === 'natural') {
      // Keep first two sentences
      const sentences = message.split('. ');
      return sentences.slice(0, 2).join('. ') + '.';
    }
  }
  
  // If too short, add context
  if (wordCount < target.min && desiredLength === 'detailed') {
    return message + " Want me to elaborate on any part of this?";
  }
  
  return message;
}

// CONVERSATION FLOW MANAGER
export class ConversationFlow {
  private messageCount: number = 0;
  private lastTopic: string = '';
  private userMood: 'excited' | 'confused' | 'neutral' | 'frustrated' = 'neutral';
  
  getResponseStyle(): ConversationalStyle {
    // First message: brief and friendly
    if (this.messageCount === 0) {
      return {
        tone: 'friendly',
        length: 'brief',
        personality: ['welcoming', 'enthusiastic']
      };
    }
    
    // Follow-up: natural and helpful
    if (this.messageCount < 3) {
      return {
        tone: 'professional',
        length: 'moderate',
        personality: ['knowledgeable', 'supportive']
      };
    }
    
    // Deep dive: detailed and expert
    return {
      tone: 'enthusiastic',
      length: 'detailed',
      personality: ['expert', 'passionate']
    };
  }

  trackMessage() {
    this.messageCount++;
  }

  reset() {
    this.messageCount = 0;
    this.lastTopic = '';
    this.userMood = 'neutral';
  }
}

// NATURAL LANGUAGE ENHANCER
export function makeNatural(response: string): string {
  // Add conversational markers
  const markers = {
    formal: [
      "It is important to note that",
      "One should consider",
      "It would be advisable to",
      "The recommendation is"
    ],
    natural: [
      "Here's the thing -",
      "I'd suggest",
      "You might want to",
      "My advice?"
    ]
  };

  // Replace formal phrases with natural ones
  let natural = response;
  markers.formal.forEach((formal, i) => {
    natural = natural.replace(new RegExp(formal, 'gi'), markers.natural[i]);
  });

  // Add personality touches
  const personalityTouches = [
    { pattern: /^([A-Z])/g, replacement: "So, $1" }, // Add "So," to beginning occasionally
    { pattern: /\. ([A-Z])/g, replacement: ". Actually, $1" }, // Add transitions
  ];

  // Randomly apply some touches (not all)
  if (Math.random() > 0.5) {
    natural = natural.replace(personalityTouches[0].pattern, personalityTouches[0].replacement);
  }

  return natural;
}

// RESPONSE BUILDER
export function buildConversationalResponse(
  topic: string,
  style: ConversationalStyle,
  context?: any
): string {
  // Get base response
  let response = '';
  
  // Check if we have a template
  const templates = style.length === 'brief' ? RESPONSE_TEMPLATES.quick :
                   style.length === 'moderate' ? RESPONSE_TEMPLATES.natural :
                   RESPONSE_TEMPLATES.expert;
  
  // Find matching template
  const topicKey = topic.toLowerCase().replace(/[^a-z]/g, '_');
  if (templates[topicKey as keyof typeof templates]) {
    response = templates[topicKey as keyof typeof templates];
  }
  
  // Add personality based on tone
  if (style.tone === 'friendly') {
    response = CONVERSATIONAL_PATTERNS.greetings.brief[0].replace('{topic}', topic) + ' ' + response;
  } else if (style.tone === 'enthusiastic') {
    response = CONVERSATIONAL_PATTERNS.greetings.enthusiastic[0].replace('{topic}', topic) + ' ' + response;
  }
  
  // Make it natural
  response = makeNatural(response);
  
  // Adjust length if needed
  response = adjustResponseLength(response, style.length === 'brief' ? 'brief' : 
                                           style.length === 'moderate' ? 'natural' : 
                                           'detailed');
  
  return response;
}

// EXPORT CONVERSATIONAL MODULE
export const CONVERSATIONAL_AI = {
  patterns: CONVERSATIONAL_PATTERNS,
  templates: RESPONSE_TEMPLATES,
  personality: ATELIER_PERSONALITY,
  flow: ConversationFlow,
  makeNatural,
  adjustResponseLength,
  buildConversationalResponse
};