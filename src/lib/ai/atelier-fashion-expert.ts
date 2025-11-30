/**
 * Atelier AI Fashion Expert Training Module
 * Advanced fashion knowledge and conversational patterns
 * Sterling Crown Philosophy: Luxury is a mindset, not just a price tag
 */

export interface FashionExpertise {
  category: string;
  confidence: number; // 0-100
  responses: {
    [query: string]: {
      answer: string;
      confidence: number;
      suggestions: string[];
      products?: string[];
      visualCues?: string[];
    };
  };
}

// Color Theory & Combinations
export const COLOR_EXPERTISE: FashionExpertise = {
  category: "Color Theory",
  confidence: 95,
  responses: {
    "navy_combinations": {
      answer: "Navy is the chameleon of menswear. Pairs beautifully with burgundy for depth, pink for modern flair, or classic white for timeless appeal. For a power move, try navy with camel or cognac accessories.",
      confidence: 98,
      suggestions: ["Try burgundy tie", "Add camel shoes", "Pink pocket square", "Silver accessories"],
      products: ["navy-suit", "burgundy-tie", "pink-pocket-square"],
      visualCues: ["Creates vertical lines", "Slimming effect", "Professional authority"]
    },
    "skin_tone_matching": {
      answer: "Your skin tone is your secret weapon. Cool undertones? Embrace charcoal, navy, and jewel tones. Warm undertones shine in earth tones, browns, and olive. The mirror test: hold silver vs gold near your face - which makes you glow?",
      confidence: 92,
      suggestions: ["Cool: Try charcoal suits", "Warm: Embrace browns", "Neutral: Lucky you - everything works"],
      visualCues: ["Check wrist veins", "Natural hair color", "Eye color harmony"]
    },
    "seasonal_colors": {
      answer: "Spring calls for lighter grays and soft blues. Summer loves linens in cream and light blue. Fall demands rich burgundies and forest greens. Winter? Time for your deepest navies and sharp charcoals.",
      confidence: 94,
      suggestions: ["Spring: Pastel ties", "Summer: Linen suits", "Fall: Burgundy accents", "Winter: Charcoal wool"],
      products: ["seasonal-collection"]
    },
    "power_color_psychology": {
      answer: "Colors speak before you do. Navy whispers confidence, charcoal commands respect, burgundy shows sophistication, and black? Pure authority. Choose based on your message, not just preference.",
      confidence: 96,
      suggestions: ["Interview: Navy", "Presentation: Charcoal", "Date: Burgundy", "Gala: Black"],
      visualCues: ["Body language alignment", "Confidence projection", "Audience perception"]
    }
  }
};

// Occasion & Dress Codes
export const OCCASION_EXPERTISE: FashionExpertise = {
  category: "Occasion Dressing",
  confidence: 93,
  responses: {
    "wedding_guest_attire": {
      answer: "Wedding guest 101: Never upstage the groom. Afternoon? Light gray or soft blue. Evening? Navy or charcoal. Beach? Linen in cream or light blue. Church? Conservative with subtle personality in your accessories.",
      confidence: 97,
      suggestions: ["Afternoon: Light suits", "Evening: Dark suits", "Beach: Linen blend", "Avoid: White, black"],
      products: ["wedding-guest-collection"],
      visualCues: ["Venue appropriate", "Time of day", "Season consideration"]
    },
    "business_casual_decoded": {
      answer: "Business casual is an art. Start with chinos or dress trousers, add a crisp shirt (no tie required), layer with a blazer for flexibility. The secret? Quality fabrics and impeccable fit elevate 'casual' to 'sophisticated'.",
      confidence: 91,
      suggestions: ["Chinos + Oxford shirt", "Blazer for meetings", "Loafers over oxfords", "Subtle patterns OK"],
      products: ["business-casual-collection"],
      visualCues: ["Office culture", "Client meetings", "Industry norms"]
    },
    "cocktail_attire": {
      answer: "Cocktail means sophisticated but not stuffy. Dark suit (navy or charcoal), crisp white or light blue shirt, silk tie with personality. The twist? Your pocket square and shoes can show flair. Think James Bond at a casino, not a mission.",
      confidence: 94,
      suggestions: ["Dark suits only", "Silk tie essential", "Pocket square adds flair", "Patent leather optional"],
      products: ["cocktail-collection"],
      visualCues: ["5-9 PM events", "Hotel bars", "Gallery openings"]
    },
    "black_tie_optional": {
      answer: "The most confusing dress code, simplified: You can wear a tuxedo (and look amazing) OR a very dark suit with formal touches. If suit: midnight blue or charcoal, white shirt, dark silk tie, black shoes. No exceptions.",
      confidence: 90,
      suggestions: ["Tuxedo preferred", "Midnight blue suit", "White shirt only", "Black accessories"],
      products: ["formal-collection", "tuxedo-collection"]
    }
  }
};

// Style Personality Profiles
export const STYLE_PERSONALITY: FashionExpertise = {
  category: "Personal Style Development",
  confidence: 88,
  responses: {
    "classic_gentleman": {
      answer: "You appreciate timeless elegance. Your uniform: Navy or charcoal suits, white or light blue shirts, burgundy or navy ties. Invest in quality over quantity. Your style whispers success, never shouts.",
      confidence: 92,
      suggestions: ["Navy suit foundation", "Quality over quantity", "Subtle patterns only", "Traditional accessories"],
      products: ["classic-collection"],
      visualCues: ["Clean lines", "Minimal patterns", "Traditional proportions"]
    },
    "modern_professional": {
      answer: "You blend tradition with contemporary edge. Slim-fit suits in interesting textures, spread collar shirts, knit ties, minimalist accessories. You respect the rules but aren't afraid to bend them tastefully.",
      confidence: 89,
      suggestions: ["Slim fits", "Textured fabrics", "Knit ties", "Minimalist watches"],
      products: ["modern-collection"],
      visualCues: ["Fitted silhouettes", "Contemporary colors", "Tech accessories"]
    },
    "fashion_forward": {
      answer: "You're the trendsetter. Double-breasted jackets, peak lapels, bold patterns, unexpected color combinations. Your confidence lets you pull off what others only admire in magazines.",
      confidence: 85,
      suggestions: ["Statement pieces", "Bold patterns", "Unique textures", "Designer accessories"],
      products: ["designer-collection"],
      visualCues: ["Runway inspired", "Pattern mixing", "Statement accessories"]
    },
    "understated_luxury": {
      answer: "Your philosophy: If you know, you know. Subtle excellence in fabric, cut, and detail. No logos, just impeccable tailoring. Cashmere, fine wools, perfect fits. Quality recognizes quality.",
      confidence: 91,
      suggestions: ["Premium fabrics", "Perfect tailoring", "Subtle details", "Quiet luxury"],
      products: ["luxury-collection"],
      visualCues: ["Fabric quality", "Perfect fit", "Subtle sophistication"]
    }
  }
};

// Fit & Tailoring Expertise
export const FIT_EXPERTISE: FashionExpertise = {
  category: "Fit & Tailoring",
  confidence: 96,
  responses: {
    "perfect_jacket_fit": {
      answer: "The shoulder seam should sit exactly where your shoulder ends - this can't be altered easily. Jacket should hug your chest without pulling. Bottom should cover your backside. Sleeves? Show 1/4 to 1/2 inch of shirt cuff.",
      confidence: 98,
      suggestions: ["Check shoulder seam", "No pulling at button", "Cover the assets", "Show shirt cuff"],
      visualCues: ["Natural shoulder line", "Clean chest", "Proper length", "Cuff exposure"]
    },
    "trouser_break_explained": {
      answer: "The break is where your personality shows. No break: modern, shows your shoes. Slight break: versatile, most flattering. Full break: traditional, more fabric pooling. Your height and shoe choice guide the decision.",
      confidence: 95,
      suggestions: ["No break: Modern look", "Slight: Most versatile", "Full: Traditional", "Consider shoe style"],
      visualCues: ["Shoe visibility", "Leg line", "Overall proportions"]
    },
    "body_type_solutions": {
      answer: "Every body has its perfect suit. Tall? Embrace 3-piece suits and peaked lapels. Shorter? Stick to 2-button jackets and minimal break. Athletic? Show it with slim fit. Larger? Classic fit with structured shoulders creates powerful presence.",
      confidence: 90,
      suggestions: ["Tall: 3-piece suits", "Short: 2-button only", "Athletic: Slim fit", "Larger: Structured shoulders"],
      products: ["fit-guide"],
      visualCues: ["Proportion balance", "Vertical lines", "Shoulder emphasis"]
    }
  }
};

// Fabric & Seasonality
export const FABRIC_EXPERTISE: FashionExpertise = {
  category: "Fabric Knowledge",
  confidence: 91,
  responses: {
    "year_round_fabrics": {
      answer: "Mid-weight wool (9-11 oz) is your year-round hero. Breathes in summer, insulates in winter. Add tropical wool for summer, flannel for winter. The secret? Layer smartly rather than buying separate seasonal wardrobes.",
      confidence: 93,
      suggestions: ["Mid-weight wool", "Tropical for summer", "Flannel for winter", "Layer smartly"],
      products: ["year-round-collection"],
      visualCues: ["Fabric weight", "Breathability", "Drape quality"]
    },
    "luxury_fabric_guide": {
      answer: "Super 120s wool: daily warrior. Super 150s: special occasions with beautiful drape. Cashmere blend: ultimate luxury. Linen: summer elegance that embraces wrinkles. Each tells a different story.",
      confidence: 89,
      suggestions: ["Super 120s daily", "150s special events", "Cashmere for luxury", "Linen for summer"],
      visualCues: ["Fabric sheen", "Drape quality", "Wrinkle resistance"]
    },
    "pattern_mixing_mastery": {
      answer: "Pattern mixing rule: vary the scale. Thin pinstripe suit? Wide-spaced dot tie. Check shirt? Solid tie or different-scale pattern. The key: one pattern dominates, others support. Start with two patterns max.",
      confidence: 87,
      suggestions: ["Vary pattern scale", "One dominates", "Start with two max", "Solid anchor piece"],
      visualCues: ["Scale variation", "Color harmony", "Visual balance"]
    }
  }
};

// Trending & Fashion Forward
export const TREND_EXPERTISE: FashionExpertise = {
  category: "Current Trends",
  confidence: 86,
  responses: {
    "2025_trends": {
      answer: "2025 is about relaxed luxury. Wider lapels are back, trousers have more room, double-breasted is having a moment. Colors? Rich burgundies, forest greens, and surprise: brown is the new black.",
      confidence: 84,
      suggestions: ["Wider lapels", "Relaxed trousers", "Double-breasted", "Earth tones"],
      products: ["trending-now"],
      visualCues: ["Contemporary cuts", "Rich colors", "Textured fabrics"]
    },
    "sustainable_style": {
      answer: "Sustainable doesn't mean sacrificing style. Invest in timeless pieces, choose natural fibers, maintain properly. One perfect suit worn 100 times beats 10 mediocre ones. Quality is the ultimate sustainability.",
      confidence: 88,
      suggestions: ["Buy less, buy better", "Natural fibers", "Proper maintenance", "Timeless styles"],
      visualCues: ["Classic designs", "Quality construction", "Versatile pieces"]
    },
    "vintage_inspiration": {
      answer: "The best dressed men steal from every era. 1920s: peaked lapels. 1950s: narrow ties. 1960s: slim suits. 1970s: wide lapels. Mix eras thoughtfully - one vintage element in a modern outfit.",
      confidence: 83,
      suggestions: ["One vintage element", "Modern foundation", "Era-appropriate", "Subtle references"],
      visualCues: ["Period details", "Modern interpretation", "Balanced styling"]
    }
  }
};

// Accessory Mastery
export const ACCESSORY_EXPERTISE: FashionExpertise = {
  category: "Accessories",
  confidence: 92,
  responses: {
    "pocket_square_rules": {
      answer: "Never match your pocket square exactly to your tie - they should complement, not twin. White linen: always right. Patterned: pick up one color from your tie. The puff fold? Effortlessly elegant for any occasion.",
      confidence: 96,
      suggestions: ["Never exact match", "White always works", "Complement colors", "Master the puff"],
      products: ["pocket-squares"],
      visualCues: ["Color echo", "Texture contrast", "Fold precision"]
    },
    "shoe_suit_pairing": {
      answer: "Black shoes: formal suits only. Brown shoes: everything except black suits. Burgundy: power move with navy or gray. The rule: darker suits need darker shoes. Your belt must match your shoes - no exceptions.",
      confidence: 94,
      suggestions: ["Black for formal", "Brown versatile", "Belt must match", "Darker with darker"],
      products: ["dress-shoes"],
      visualCues: ["Color harmony", "Formality match", "Leather coordination"]
    },
    "watch_selection": {
      answer: "Your watch speaks volumes. Dress watch: thin, leather strap, under the cuff. Sport watch: only with casual outfits. Smart watch: modern offices yes, formal events never. The size should never overpower your wrist.",
      confidence: 90,
      suggestions: ["Dress: thin profile", "Sport: casual only", "Size proportional", "Match metals"],
      visualCues: ["Wrist proportion", "Formality level", "Metal matching"]
    },
    "tie_width_science": {
      answer: "Tie width should match your lapel width - it's that simple. Skinny tie? Skinny lapel. Standard 3.5 inch tie? Standard lapel. The proportion creates visual harmony. Your body type doesn't change this rule.",
      confidence: 95,
      suggestions: ["Match lapel width", "Standard: 3.5 inches", "Skinny: 2.5 inches", "Proportion matters"],
      visualCues: ["Lapel harmony", "Visual balance", "Body proportion"]
    }
  }
};

// Problem Solving
export const PROBLEM_SOLVING: FashionExpertise = {
  category: "Common Issues",
  confidence: 94,
  responses: {
    "summer_wedding_heat": {
      answer: "Beat the heat stylishly: Tropical weight wool or linen blend, half-canvas construction for breathability, light colors reflect heat. Skip the vest, choose breathable cotton shirt. Pro tip: bring a backup shirt.",
      confidence: 92,
      suggestions: ["Tropical wool", "Light colors", "Skip the vest", "Backup shirt"],
      products: ["summer-collection"],
      visualCues: ["Fabric breathability", "Color selection", "Layer reduction"]
    },
    "budget_looking_expensive": {
      answer: "Make $500 look like $5000: Perfect fit trumps everything - budget for tailoring. Stick to classic colors. Invest in one spectacular tie. Keep everything immaculately clean and pressed. Confidence is your best accessory.",
      confidence: 93,
      suggestions: ["Tailoring budget", "Classic colors", "One great tie", "Impeccable maintenance"],
      visualCues: ["Perfect fit", "Clean lines", "Quality details"]
    },
    "travel_wrinkle_free": {
      answer: "Travel like a pro: Roll, don't fold. Dry cleaner bags between garments. Hang immediately in bathroom during shower. Pack shirts buttoned. Wrinkle-release spray is your friend. Choose wrinkle-resistant fabrics when possible.",
      confidence: 91,
      suggestions: ["Roll technique", "Garment bags", "Steam trick", "Wrinkle spray"],
      visualCues: ["Packing method", "Fabric choice", "Quick fixes"]
    },
    "last_minute_formal": {
      answer: "Emergency formal ready: Navy suit, white shirt, black shoes, white pocket square. These four pieces can handle any surprise invitation. Add a black tie for increased formality. Keep them ready, always.",
      confidence: 95,
      suggestions: ["Navy suit ready", "White shirt pressed", "Black shoes polished", "Emergency kit"],
      products: ["essential-collection"],
      visualCues: ["Clean and pressed", "Classic combination", "Versatile foundation"]
    }
  }
};

// Cultural & Regional Considerations
export const CULTURAL_EXPERTISE: FashionExpertise = {
  category: "Cultural Awareness",
  confidence: 87,
  responses: {
    "midwest_style": {
      answer: "Michigan style balances professional polish with approachable warmth. Not as formal as NYC, not as casual as LA. Quality fabrics for weather extremes. Browns and earth tones work beautifully here. Automotive executive or Great Lakes casual - we understand both.",
      confidence: 89,
      suggestions: ["Weather-appropriate", "Professional but warm", "Earth tones work", "Quality fabrics"],
      products: ["michigan-collection"],
      visualCues: ["Regional appropriateness", "Weather ready", "Professional balance"]
    },
    "international_business": {
      answer: "Global dress codes: London loves tradition, Milan embraces flair, Tokyo demands perfection, NYC means power dressing. Research your destination's business culture. When in doubt, overdress slightly - it shows respect.",
      confidence: 85,
      suggestions: ["Research destination", "Overdress slightly", "Conservative safe", "Cultural respect"],
      visualCues: ["Cultural norms", "Business expectations", "Regional preferences"]
    },
    "generational_style": {
      answer: "Every generation has its sweet spot. Millennials: slim fits, casual Friday everyday. Gen X: balanced traditional with modern. Boomers: classic cuts, quality over trends. Gen Z: breaking all rules creatively. Dress for your audience and authenticity.",
      confidence: 83,
      suggestions: ["Know your audience", "Authenticity matters", "Bridge generations", "Respect differences"],
      visualCues: ["Age appropriate", "Audience awareness", "Authentic expression"]
    }
  }
};

// Sterling Crown Philosophy
export const STERLING_CROWN_PHILOSOPHY = {
  core_belief: "Luxury is a mindset, not just a price tag",
  principles: [
    "Every man deserves to feel exceptional",
    "Confidence comes from knowing you look your best",
    "Quality shows in details others might miss",
    "Style is personal expression within classic frameworks",
    "The right suit changes how you carry yourself",
    "Investment dressing pays dividends in confidence",
    "Timeless beats trendy, but modern updates matter"
  ],
  signature_advice: {
    "first_timer": "Start with navy, nail the fit, build from there. Rome wasn't built in a day, neither is a wardrobe.",
    "upgrade_seeker": "One exceptional piece beats three mediocre ones. Upgrade strategically.",
    "style_explorer": "Rules are guidelines. Once you know them, break them thoughtfully.",
    "investment_dresser": "Buy once, cry once. Quality compounds over time.",
    "confident_dresser": "You've earned the right to experiment. Trust your instincts."
  }
};

// Confidence Assessment Function
export function assessAtelierConfidence(): {
  overall: number;
  categories: { [key: string]: number };
  strengths: string[];
  improvements: string[];
} {
  const categories = {
    "Color Theory": COLOR_EXPERTISE.confidence,
    "Occasion Dressing": OCCASION_EXPERTISE.confidence,
    "Personal Style": STYLE_PERSONALITY.confidence,
    "Fit & Tailoring": FIT_EXPERTISE.confidence,
    "Fabric Knowledge": FABRIC_EXPERTISE.confidence,
    "Current Trends": TREND_EXPERTISE.confidence,
    "Accessories": ACCESSORY_EXPERTISE.confidence,
    "Problem Solving": PROBLEM_SOLVING.confidence,
    "Cultural Awareness": CULTURAL_EXPERTISE.confidence
  };

  const overall = Object.values(categories).reduce((a, b) => a + b, 0) / Object.keys(categories).length;

  const strengths = Object.entries(categories)
    .filter(([_, confidence]) => confidence >= 90)
    .map(([category]) => category);

  const improvements = Object.entries(categories)
    .filter(([_, confidence]) => confidence < 90)
    .map(([category]) => category);

  return {
    overall: Math.round(overall),
    categories,
    strengths,
    improvements
  };
}

// Response Generator
export function generateAtelierResponse(query: string, context?: any): {
  response: string;
  confidence: number;
  suggestions: string[];
  followUp?: string;
} {
  const queryLower = query.toLowerCase();
  
  // Search through all expertise categories
  const expertiseModules = [
    COLOR_EXPERTISE,
    OCCASION_EXPERTISE,
    STYLE_PERSONALITY,
    FIT_EXPERTISE,
    FABRIC_EXPERTISE,
    TREND_EXPERTISE,
    ACCESSORY_EXPERTISE,
    PROBLEM_SOLVING,
    CULTURAL_EXPERTISE
  ];

  for (const module of expertiseModules) {
    for (const [key, data] of Object.entries(module.responses)) {
      // Check if query matches this expertise area
      const keywords = key.split('_').join(' ');
      if (queryLower.includes(keywords) || keywords.includes(queryLower)) {
        return {
          response: `${data.answer}\n\n💡 ${STERLING_CROWN_PHILOSOPHY.core_belief}`,
          confidence: data.confidence,
          suggestions: data.suggestions,
          followUp: "Would you like me to show you some options or discuss another aspect?"
        };
      }
    }
  }

  // Default response with Sterling Crown philosophy
  return {
    response: `Let me help you with that. ${STERLING_CROWN_PHILOSOPHY.principles[Math.floor(Math.random() * STERLING_CROWN_PHILOSOPHY.principles.length)]} What specific aspect would you like to explore?`,
    confidence: 75,
    suggestions: ["Tell me more", "Show me options", "Different question", "Style consultation"],
    followUp: "What matters most to you in your wardrobe?"
  };
}

// Export all expertise modules
export const ATELIER_EXPERTISE = {
  COLOR_EXPERTISE,
  OCCASION_EXPERTISE,
  STYLE_PERSONALITY,
  FIT_EXPERTISE,
  FABRIC_EXPERTISE,
  TREND_EXPERTISE,
  ACCESSORY_EXPERTISE,
  PROBLEM_SOLVING,
  CULTURAL_EXPERTISE,
  STERLING_CROWN_PHILOSOPHY,
  assessConfidence: assessAtelierConfidence,
  generateResponse: generateAtelierResponse
};