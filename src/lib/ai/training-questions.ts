// Comprehensive AI Training Questions for KCT Atelier AI Assistant
// This file contains 100 curated training questions organized by category
// Each question includes keywords, responses, and contextual follow-ups

import type { ConversationalPattern } from './knowledge-base'

export const TRAINING_QUESTIONS: Record<string, ConversationalPattern> = {
  // ====== PRODUCT & INVENTORY QUESTIONS (1-20) ======
  'suits_general': {
    keywords: ['do you have suits', 'suits', 'suit collection'],
    response: "Yes! Full collection from casual to black tie - over 89 styles available.",
    followUpQuestion: "What's the occasion?",
    contextualResponses: {
      'casual': {
        response: "Our casual suits are perfect for business casual or social events.",
        styleDiscoveryQuestion: "Do you prefer modern slim fits or classic relaxed cuts?"
      },
      'formal': {
        response: "Formal suits from traditional to contemporary styles.",
        styleDiscoveryQuestion: "Traditional elegance or modern sophistication?"
      }
    }
  },

  'sizes_available': {
    keywords: ['what sizes available', 'sizes', 'size range'],
    response: "We carry 36-54 regular, short, and long.",
    followUpQuestion: "What's your usual size?",
    contextualResponses: {
      'unsure': {
        response: "Our size predictor AI helps find your perfect fit.",
        styleDiscoveryQuestion: "Would you like to use our AI sizing tool?"
      },
      'between': {
        response: "Between sizes? We recommend sizing up and tailoring down.",
        styleDiscoveryQuestion: "Do you prefer a fitted or relaxed look?"
      }
    }
  },

  'sales_current': {
    keywords: ['any sales right now', 'sales', 'discounts', 'deals'],
    response: "Check our bundles - save up to $98 on complete outfits.",
    followUpQuestion: "Looking for something specific?",
    contextualResponses: {
      'budget': {
        response: "Our $199 bundles offer incredible value.",
        styleDiscoveryQuestion: "Classic essentials or trendy statement pieces?"
      },
      'premium': {
        response: "Premium collections occasionally go on sale end-of-season.",
        styleDiscoveryQuestion: "Want me to notify you about premium sales?"
      }
    }
  },

  'international_shipping': {
    keywords: ['ship internationally', 'international shipping', 'ship abroad'],
    response: "We ship to most countries worldwide.",
    followUpQuestion: "Where are you located?",
    contextualResponses: {
      'canada': {
        response: "Canada shipping is fast - usually 3-5 business days.",
        styleDiscoveryQuestion: "Shopping for a specific event?"
      },
      'europe': {
        response: "European orders arrive in 7-10 days with tracking.",
        styleDiscoveryQuestion: "Need help with sizing conversions?"
      }
    }
  },

  'return_policy': {
    keywords: ['return policy', 'returns', 'exchange', 'refund'],
    response: "30-day returns, free exchanges on first order.",
    followUpQuestion: "Concerned about fit?",
    contextualResponses: {
      'fit': {
        response: "Our Size Bot AI reduces returns by 73% with accurate predictions.",
        styleDiscoveryQuestion: "Want to try our AI sizing tool?"
      },
      'quality': {
        response: "Quality guaranteed - we stand behind every piece.",
        styleDiscoveryQuestion: "Looking for investment pieces or everyday wear?"
      }
    }
  },

  'alterations_cost': {
    keywords: ['how much for alterations', 'alterations', 'tailoring cost'],
    response: "Basic alterations $15-45, complex $50-75.",
    followUpQuestion: "Need specific alterations?",
    contextualResponses: {
      'basic': {
        response: "Hem and sleeve adjustments are quick and affordable.",
        styleDiscoveryQuestion: "Do you know your exact measurements?"
      },
      'custom': {
        response: "Full custom fitting creates a bespoke look.",
        styleDiscoveryQuestion: "Worth investing in perfect fit for special occasions?"
      }
    }
  },

  'tuxedos_available': {
    keywords: ['got any tuxedos', 'tuxedos', 'black tie', 'formal wear'],
    response: "Classic and modern tuxedos, plus midnight blue options.",
    followUpQuestion: "Traditional or contemporary style?",
    contextualResponses: {
      'traditional': {
        response: "Peak lapel with satin details - timeless elegance.",
        styleDiscoveryQuestion: "Single or double-breasted preference?"
      },
      'modern': {
        response: "Slim-fit tuxedos with contemporary details.",
        styleDiscoveryQuestion: "Shawl collar or peak lapel?"
      }
    }
  },

  'price_range_suits': {
    keywords: ['price range for suits', 'suit prices', 'cost of suits'],
    response: "Suits from $395 to luxury at $1,295.",
    followUpQuestion: "What's your budget range?",
    contextualResponses: {
      'entry': {
        response: "Our $395-495 suits offer exceptional value.",
        styleDiscoveryQuestion: "First suit or adding to collection?"
      },
      'premium': {
        response: "Premium $800+ suits feature Italian fabrics.",
        styleDiscoveryQuestion: "Investment piece or statement suit?"
      }
    }
  },

  'blazers_available': {
    keywords: ['do you have blazers', 'blazers', 'sport coats'],
    response: "Over 58 blazers from casual to formal.",
    followUpQuestion: "Casual or dressy?",
    contextualResponses: {
      'casual': {
        response: "Unstructured blazers perfect for smart casual.",
        styleDiscoveryQuestion: "Cotton, linen, or wool blend?"
      },
      'formal': {
        response: "Structured blazers that pair with dress pants.",
        styleDiscoveryQuestion: "Navy versatility or statement colors?"
      }
    }
  },

  'slim_fit_options': {
    keywords: ['any slim fit suits', 'slim fit', 'fitted suits'],
    response: "Extensive slim fit collection in all colors.",
    followUpQuestion: "How slim do you like?",
    contextualResponses: {
      'very_slim': {
        response: "Super slim for fashion-forward looks.",
        styleDiscoveryQuestion: "Athletic build or naturally slim?"
      },
      'moderate': {
        response: "Modern slim balances fitted and comfortable.",
        styleDiscoveryQuestion: "Office wear or social events?"
      }
    }
  },

  // ====== SIZING QUESTIONS (21-30) ======
  'how_to_measure': {
    keywords: ['how do I measure myself', 'measure', 'measurements'],
    response: "Chest, waist, and inseam are key measurements.",
    followUpQuestion: "Have a tape measure?",
    contextualResponses: {
      'yes': {
        response: "I'll guide you through each measurement step-by-step.",
        styleDiscoveryQuestion: "Want video tutorial or text instructions?"
      },
      'no': {
        response: "Our AI can estimate from your height/weight.",
        styleDiscoveryQuestion: "Ready to try our Size Bot?"
      }
    }
  },

  'jacket_size_help': {
    keywords: ['what\'s my jacket size', 'jacket size', 'blazer size'],
    response: "Jacket size = chest measurement + 2 inches.",
    followUpQuestion: "Know your chest measurement?",
    contextualResponses: {
      'yes': {
        response: "Add 2 inches for comfort, that's your size.",
        styleDiscoveryQuestion: "Prefer fitted or relaxed?"
      },
      'no': {
        response: "Usually 6 inches more than waist size.",
        styleDiscoveryQuestion: "What's your dress shirt size?"
      }
    }
  },

  'size_by_stats': {
    keywords: ['I\'m 5\'10 180lbs what size', 'height weight size', 'size recommendation'],
    response: "Typically 40R jacket, 33-34 waist for your build.",
    followUpQuestion: "Athletic or average build?",
    contextualResponses: {
      'athletic': {
        response: "Athletic builds may need size up in chest.",
        styleDiscoveryQuestion: "Broad shoulders or narrow waist challenge?"
      },
      'average': {
        response: "40R should fit perfectly off-rack.",
        styleDiscoveryQuestion: "Any specific fit concerns?"
      }
    }
  },

  'between_sizes': {
    keywords: ['between sizes what should I do', 'between sizes', 'size up or down'],
    response: "Size up and tailor down for best fit.",
    followUpQuestion: "Which measurements are between?",
    contextualResponses: {
      'chest': {
        response: "Chest can't be let out much - definitely size up.",
        styleDiscoveryQuestion: "Planning to layer underneath?"
      },
      'length': {
        response: "Length is easily adjusted - go with chest fit.",
        styleDiscoveryQuestion: "Prefer longer or shorter jacket style?"
      }
    }
  },

  'suits_run_small': {
    keywords: ['do suits run small', 'run small', 'true to size'],
    response: "Our suits run true to size with detailed charts.",
    followUpQuestion: "Concerned about specific brand?",
    contextualResponses: {
      'yes': {
        response: "Each product has specific sizing notes.",
        styleDiscoveryQuestion: "European or American sizing preference?"
      },
      'general': {
        response: "Modern fits run slimmer than classic.",
        styleDiscoveryQuestion: "How do you like clothes to fit?"
      }
    }
  },

  // ====== STYLING & COLOR QUESTIONS (31-40) ======
  'first_suit_color': {
    keywords: ['navy or charcoal first suit', 'first suit color', 'best suit color'],
    response: "Navy - most versatile for all occasions.",
    followUpQuestion: "Main use for the suit?",
    contextualResponses: {
      'work': {
        response: "Navy works every day without looking repetitive.",
        styleDiscoveryQuestion: "Conservative or modern workplace?"
      },
      'events': {
        response: "Navy photographs beautifully at events.",
        styleDiscoveryQuestion: "Daytime or evening events mostly?"
      }
    }
  },

  'brown_shoes_navy': {
    keywords: ['brown shoes with navy', 'navy suit brown shoes', 'shoe matching'],
    response: "Brown + navy is a classic, sophisticated combination.",
    followUpQuestion: "Light or dark brown?",
    contextualResponses: {
      'light': {
        response: "Cognac brown adds modern flair to navy.",
        styleDiscoveryQuestion: "Casual elegance or sharp contrast?"
      },
      'dark': {
        response: "Dark brown is safer, more formal with navy.",
        styleDiscoveryQuestion: "Business or social occasions?"
      }
    }
  },

  'tie_with_grey': {
    keywords: ['what tie with grey suit', 'grey suit tie', 'gray suit combinations'],
    response: "Burgundy, navy, or patterns work beautifully.",
    followUpQuestion: "Formal or casual setting?",
    contextualResponses: {
      'formal': {
        response: "Solid burgundy or navy for professional elegance.",
        styleDiscoveryQuestion: "Power tie or subtle sophistication?"
      },
      'casual': {
        response: "Patterns and textures add personality.",
        styleDiscoveryQuestion: "Bold patterns or subtle textures?"
      }
    }
  },

  'black_suit_wedding': {
    keywords: ['black suit for wedding', 'black suit appropriate', 'wedding black suit'],
    response: "Black works for evening/formal weddings.",
    followUpQuestion: "Day or evening wedding?",
    contextualResponses: {
      'day': {
        response: "Consider navy or grey for daytime instead.",
        styleDiscoveryQuestion: "Want to stay darker or open to color?"
      },
      'evening': {
        response: "Black is perfect for evening elegance.",
        styleDiscoveryQuestion: "Classic black or midnight blue alternative?"
      }
    }
  },

  'summer_wedding_color': {
    keywords: ['summer wedding what color', 'summer wedding suit', 'warm weather suit'],
    response: "Light blue, tan, or light grey perfect for summer.",
    followUpQuestion: "Beach, garden, or indoor?",
    contextualResponses: {
      'beach': {
        response: "Tan or light blue complements beach settings.",
        styleDiscoveryQuestion: "Linen texture or smooth finish?"
      },
      'garden': {
        response: "Sage green or light grey for garden elegance.",
        styleDiscoveryQuestion: "Natural tones or stand out?"
      }
    }
  },

  // ====== EVENT-SPECIFIC QUESTIONS (41-50) ======
  'prom_suit_ideas': {
    keywords: ['prom suit ideas', 'prom', 'prom outfit'],
    response: "Prom 2025 trends: jewel tones and modern fits.",
    followUpQuestion: "Classic or statement style?",
    contextualResponses: {
      'classic': {
        response: "Navy or burgundy with subtle accessories.",
        styleDiscoveryQuestion: "Traditional bow tie or modern necktie?"
      },
      'statement': {
        response: "Emerald, purple, or patterned blazers trending.",
        styleDiscoveryQuestion: "All-out glamour or sophisticated edge?"
      }
    }
  },

  'graduation_outfit': {
    keywords: ['graduation outfit', 'graduation', 'commencement attire'],
    response: "Smart casual or suit depending on ceremony.",
    followUpQuestion: "Indoor or outdoor ceremony?",
    contextualResponses: {
      'indoor': {
        response: "Full suit shows respect for the occasion.",
        styleDiscoveryQuestion: "Photos forever - classic or trendy?"
      },
      'outdoor': {
        response: "Lighter fabrics and colors for comfort.",
        styleDiscoveryQuestion: "Formal tradition or relaxed celebration?"
      }
    }
  },

  'job_interview_suit': {
    keywords: ['job interview suit', 'interview attire', 'professional outfit'],
    response: "Conservative colors: navy, charcoal, or grey.",
    followUpQuestion: "What industry?",
    contextualResponses: {
      'corporate': {
        response: "Charcoal with white shirt projects authority.",
        styleDiscoveryQuestion: "Power presence or approachable professional?"
      },
      'creative': {
        response: "Navy with personality in accessories.",
        styleDiscoveryQuestion: "Safe classic or subtle creativity?"
      }
    }
  },

  'beach_wedding_attire': {
    keywords: ['beach wedding attire', 'beach wedding', 'destination wedding'],
    response: "Linen or lightweight suits in light colors.",
    followUpQuestion: "Formal or casual beach wedding?",
    contextualResponses: {
      'formal': {
        response: "Light grey or tan suit, no black shoes.",
        styleDiscoveryQuestion: "Full suit or blazer with chinos?"
      },
      'casual': {
        response: "Linen shirt with dress pants often perfect.",
        styleDiscoveryQuestion: "Barefoot elegance or leather loafers?"
      }
    }
  },

  'black_tie_help': {
    keywords: ['black tie event help', 'black tie', 'formal event'],
    response: "Tuxedo required: black or midnight blue.",
    followUpQuestion: "Traditional or modern style?",
    contextualResponses: {
      'traditional': {
        response: "Black tux, white shirt, black bow tie.",
        styleDiscoveryQuestion: "Cummerbund or vest?"
      },
      'modern': {
        response: "Slim tux with contemporary details.",
        styleDiscoveryQuestion: "Velvet lapels or satin?"
      }
    }
  },

  // ====== CARE & MAINTENANCE QUESTIONS (81-90) ======
  'how_to_store': {
    keywords: ['how to store suits', 'storage', 'suit storage'],
    response: "Breathable garment bags, cedar hangers essential.",
    followUpQuestion: "Long-term or daily storage?",
    contextualResponses: {
      'long_term': {
        response: "Add cedar blocks, ensure completely clean first.",
        styleDiscoveryQuestion: "Seasonal rotation or occasional wear?"
      },
      'daily': {
        response: "Good hangers and 24-hour rest between wears.",
        styleDiscoveryQuestion: "How many suits in rotation?"
      }
    }
  },

  'dry_clean_frequency': {
    keywords: ['dry clean how often', 'cleaning suits', 'suit maintenance'],
    response: "3-4 wears for regular use, spot clean between.",
    followUpQuestion: "How often do you wear suits?",
    contextualResponses: {
      'daily': {
        response: "Monthly cleaning for daily wear suits.",
        styleDiscoveryQuestion: "Multiple suits to rotate?"
      },
      'occasional': {
        response: "Clean after events or seasonally.",
        styleDiscoveryQuestion: "Storage between wears sorted?"
      }
    }
  },

  // ====== QUICK DECISION QUESTIONS (91-100) ======
  'need_suit_tomorrow': {
    keywords: ['need suit tomorrow', 'urgent', 'last minute', 'rush'],
    response: "In-stock suits with express alterations available.",
    followUpQuestion: "What's the occasion?",
    contextualResponses: {
      'emergency': {
        response: "We'll get you looking sharp - no stress!",
        styleDiscoveryQuestion: "Play it safe or make an impression?"
      },
      'forgot': {
        response: "Happens to everyone - we've got you covered.",
        styleDiscoveryQuestion: "Know what you want or need guidance?"
      }
    }
  },

  'under_500_options': {
    keywords: ['under $500 options', 'budget suits', 'affordable'],
    response: "Great selection $395-495, bundles save more.",
    followUpQuestion: "Complete outfit or just suit?",
    contextualResponses: {
      'complete': {
        response: "$199 bundles include everything you need.",
        styleDiscoveryQuestion: "Classic safe choices or try trends?"
      },
      'suit_only': {
        response: "$395 suits in multiple styles and colors.",
        styleDiscoveryQuestion: "Maximum versatility or specific occasion?"
      }
    }
  },

  'best_value_suit': {
    keywords: ['best value suit', 'value', 'worth it'],
    response: "Our $495 suits - perfect quality/price balance.",
    followUpQuestion: "How often will you wear it?",
    contextualResponses: {
      'often': {
        response: "Invest slightly more for durability.",
        styleDiscoveryQuestion: "Workhorse basics or style statements?"
      },
      'occasionally': {
        response: "$395 perfect for occasional wear.",
        styleDiscoveryQuestion: "One versatile suit or start collection?"
      }
    }
  },

  'most_versatile_color': {
    keywords: ['most versatile color', 'versatile suit', 'one suit only'],
    response: "Navy - works everywhere, every season.",
    followUpQuestion: "Mainly business or social?",
    contextualResponses: {
      'business': {
        response: "Navy with white/blue shirts for endless options.",
        styleDiscoveryQuestion: "Conservative or modern cut?"
      },
      'social': {
        response: "Navy lets you play with colorful accessories.",
        styleDiscoveryQuestion: "Classic styling or fashion-forward?"
      }
    }
  },

  'appointment_needed': {
    keywords: ['appointment needed', 'walk in', 'visit store'],
    response: "Walk-ins welcome, appointments get priority service.",
    followUpQuestion: "When planning to visit?",
    contextualResponses: {
      'today': {
        response: "Come anytime - we'll take care of you.",
        styleDiscoveryQuestion: "Quick purchase or full consultation?"
      },
      'weekend': {
        response: "Weekends busy - appointment ensures dedicated time.",
        styleDiscoveryQuestion: "Know what you want or exploring options?"
      }
    }
  }
}

// Function to merge training questions with existing knowledge base
export function mergeTrainingQuestions(existingPatterns: Record<string, ConversationalPattern>): Record<string, ConversationalPattern> {
  return {
    ...existingPatterns,
    ...TRAINING_QUESTIONS
  }
}

// Helper function to find best matching pattern
export function findBestMatch(message: string, patterns: Record<string, ConversationalPattern>): ConversationalPattern | null {
  const lowercaseMessage = message.toLowerCase()
  
  for (const [key, pattern] of Object.entries(patterns)) {
    for (const keyword of pattern.keywords) {
      if (lowercaseMessage.includes(keyword)) {
        return pattern
      }
    }
  }
  
  return null
}

// Analytics helper to track which questions are asked most
export function trackQuestionUsage(questionKey: string) {
  // This could be connected to analytics or database
  try {
    const usage = JSON.parse(localStorage.getItem('question_usage') || '{}');
    usage[questionKey] = (usage[questionKey] || 0) + 1;
    localStorage.setItem('question_usage', JSON.stringify(usage));
  } catch (error) {
    console.warn('Could not track question usage:', error);
  }
}
