/**
 * Tool-Based Conversational AI
 * Uses OpenAI Function Calling (Tools API) to intelligently route queries
 * to our specialized knowledge bases and data sources.
 */

import type { ConversationContext, AIResponse, IntentType } from '../types/chat'
import { analyzeShortQuery, generateShortQueryResponse } from '../lib/ai/atelier-short-query-handler'
import { generateAtelierResponse } from '../lib/ai/atelier-fashion-expert'

// Tool definitions for OpenAI
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'fashion_expert_lookup',
      description: 'Official KCT Menswear fashion expertise. REQUIRED for color combinations, style advice, fit guidance, and occasion recommendations. Contains 9 categories of expert knowledge.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The customer\'s fashion question (e.g., "can I wear brown shoes with navy suit", "what to wear to wedding")'
          },
          category: {
            type: 'string',
            enum: [
              'color_theory',
              'occasion_dressing',
              'fit_and_tailoring',
              'fabric_knowledge',
              'style_personalities',
              'accessories',
              'trends',
              'problem_solving',
              'cultural_expertise'
            ],
            description: 'The expertise category that best matches the question'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'short_query_database',
      description: 'Quick answers to common menswear questions. Use for simple, factual queries that have pre-built responses (2-7 word queries).',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The exact customer query to look up'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_conversation_context',
      description: 'Retrieves recent conversation history to understand what the customer previously asked about. Use when customer references "that", "the one I mentioned", or asks follow-up questions.',
      parameters: {
        type: 'object',
        properties: {
          look_back: {
            type: 'number',
            description: 'How many previous messages to retrieve (1-5)',
            default: 3
          }
        }
      }
    }
  }
]

// System prompt that enforces tool usage
const SYSTEM_PROMPT = `You are Atelier AI, the official style consultant for KCT Menswear, a luxury men's formal wear retailer specializing in suits, tuxedos, and wedding attire.

CRITICAL RULES - YOU MUST FOLLOW THESE:

1. FOR COLOR/STYLE QUESTIONS: ALWAYS call fashion_expert_lookup tool first
   - "Can I wear brown shoes with navy?" → CALL fashion_expert_lookup
   - "What colors match?" → CALL fashion_expert_lookup
   - "What to wear to wedding?" → CALL fashion_expert_lookup

2. FOR SIMPLE QUERIES: Try short_query_database first
   - "navy suit" → CALL short_query_database
   - "first suit" → CALL short_query_database

3. FOR FOLLOW-UP QUESTIONS: ALWAYS call get_conversation_context
   - "what about that" → CALL get_conversation_context first
   - "the black suit I mentioned" → CALL get_conversation_context first

4. NEVER PROVIDE YOUR OWN FASHION OPINIONS
   - You are NOT a general fashion advisor
   - You ONLY use KCT's official knowledge from the tools
   - If tools return no data, offer to connect with a stylist

5. RESPONSE FORMAT:
   - Answer the question using tool data
   - Keep responses conversational (3-5 sentences)
   - Always end with a helpful follow-up action

6. WHEN TOOLS RETURN EMPTY:
   - Don't make up an answer
   - Say: "Let me connect you with one of our style experts for personalized advice."

Your personality: Professional but approachable, confident in fashion knowledge, helpful without being pushy.

Remember: You're the intelligent interface to KCT's knowledge - route questions to the right tools, then present their answers naturally.`

export class ToolBasedAI {
  private openaiApiKey: string
  private knowledgeApiUrl: string

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
    this.knowledgeApiUrl = process.env.KNOWLEDGE_API_URL || 'https://kct-knowledge-api-2-production.up.railway.app'
  }

  async processMessage(message: string, context: ConversationContext): Promise<AIResponse> {
    try {
      console.log('🤖 Tool-based AI processing:', message)

      // Step 1: Send to ChatGPT with tools
      const chatResponse = await this.callChatGPT(message, context)

      // Step 2: Check if ChatGPT wants to use tools
      if (chatResponse.tool_calls && chatResponse.tool_calls.length > 0) {
        console.log('🔧 ChatGPT requested tools:', chatResponse.tool_calls.map((t: any) => t.function.name))

        // Execute all requested tools
        const toolResults = await this.executeTools(chatResponse.tool_calls, context)

        // Step 3: Send tool results back to ChatGPT for final response
        const finalResponse = await this.getChatGPTFinalResponse(message, chatResponse, toolResults, context)

        return this.formatResponse(finalResponse, context)
      } else {
        // ChatGPT responded directly without tools (shouldn't happen often with our prompts)
        console.log('⚠️ ChatGPT responded without tools')
        return this.formatResponse(chatResponse.content, context)
      }

    } catch (error) {
      console.error('❌ Tool-based AI error:', error)
      return this.getFallbackResponse()
    }
  }

  private async callChatGPT(message: string, context: ConversationContext) {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // Include recent conversation history
      ...context.conversationHistory.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        tools: TOOLS,
        tool_choice: 'auto', // Let ChatGPT decide when to use tools
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const data = await response.json() as any
    return data.choices[0].message
  }

  private async executeTools(toolCalls: any[], context: ConversationContext) {
    const results = []

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name
      const args = JSON.parse(toolCall.function.arguments)

      console.log(`📞 Executing tool: ${functionName}`, args)

      let result
      switch (functionName) {
        case 'fashion_expert_lookup':
          result = await this.executeFashionExpertLookup(args.query, args.category)
          break

        case 'short_query_database':
          result = await this.executeShortQueryLookup(args.query)
          break

        case 'get_conversation_context':
          result = await this.getConversationContext(context, args.look_back || 3)
          break

        default:
          result = { error: `Unknown tool: ${functionName}` }
      }

      results.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        name: functionName,
        content: JSON.stringify(result)
      })
    }

    return results
  }

  private async executeFashionExpertLookup(query: string, category?: string) {
    console.log('👔 Fashion Expert lookup:', query, category)

    const result = generateAtelierResponse(query, { category })

    return {
      answer: result.response,
      confidence: result.confidence,
      suggestions: result.suggestions,
      follow_up: result.followUp,
      source: 'KCT Fashion Expert Knowledge Base'
    }
  }

  private async executeShortQueryLookup(query: string) {
    console.log('⚡ Short query lookup:', query)

    const analyzed = analyzeShortQuery(query)

    if (analyzed.confidence >= 80) {
      const response = generateShortQueryResponse(analyzed)
      return {
        answer: response.response,
        quick_actions: response.quickActions,
        confidence: analyzed.confidence,
        source: 'KCT Quick Answers Database'
      }
    }

    return {
      answer: null,
      reason: 'No high-confidence match found',
      confidence: analyzed.confidence
    }
  }

  private async getConversationContext(context: ConversationContext, lookBack: number) {
    const recent = context.conversationHistory.slice(-lookBack)
    return {
      recent_messages: recent.map(m => ({
        role: m.role,
        content: m.content,
        intent: m.intent
      })),
      extracted_preferences: context.extractedPreferences,
      session_id: context.sessionId
    }
  }

  private async getChatGPTFinalResponse(
    originalMessage: string,
    assistantMessage: any,
    toolResults: any[],
    context: ConversationContext
  ) {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...context.conversationHistory.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: originalMessage },
      assistantMessage,
      ...toolResults
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const data = await response.json() as any
    return data.choices[0].message.content
  }

  private formatResponse(responseText: string, context: ConversationContext): AIResponse {
    // Extract intent from response (simple keyword matching for now)
    let intent: IntentType = 'general-question'

    if (responseText.toLowerCase().includes('suit') || responseText.toLowerCase().includes('product')) {
      intent = 'product-search'
    } else if (responseText.toLowerCase().includes('color') || responseText.toLowerCase().includes('style')) {
      intent = 'style-advice'
    } else if (responseText.toLowerCase().includes('wedding') || responseText.toLowerCase().includes('event')) {
      intent = 'occasion-help'
    }

    return {
      message: responseText,
      intent,
      confidence: 0.90, // High confidence since ChatGPT used our tools
      suggestedActions: [
        { type: 'navigate', label: 'Browse Collection', data: { url: '/products' } },
        { type: 'contact-support', label: 'Talk to Stylist', data: {} }
      ],
      productRecommendations: [],
      clarifyingQuestions: undefined
    }
  }

  private getFallbackResponse(): AIResponse {
    return {
      message: "I'm having trouble accessing our knowledge base right now. Let me connect you with one of our style experts who can help you immediately.",
      intent: 'general-question',
      confidence: 0.5,
      suggestedActions: [
        { type: 'contact-support', label: 'Talk to Expert', data: {} }
      ],
      productRecommendations: []
    }
  }
}
