import type {
  ConversationContext,
  AIResponse,
  Intent,
  IntentType,
  Action,
  ProductSuggestion,
  ExtractedEntity
} from '../types/chat'

interface ConversationState {
  stage: 'greeting' | 'discovery' | 'consideration' | 'decision' | 'checkout'
  mood: 'positive' | 'neutral' | 'frustrated'
  topicHistory: string[]
  productContext: string[]
}

export class ConversationalAI {
  private openaiApiKey: string
  private conversationStates: Map<string, ConversationState> = new Map()
  private knowledgeApiUrl: string

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
    this.knowledgeApiUrl = process.env.KNOWLEDGE_API_URL || 'https://kct-knowledge-api-2-production.up.railway.app'
  }

  async processMessage(message: string, context: ConversationContext): Promise<AIResponse> {
    try {
      // Get conversation state
      const state = this.getConversationState(context.sessionId)

      // Extract intent and entities from the message
      const intent = await this.extractIntent(message, context, state)

      // Update context with extracted information
      const updatedContext = this.updateContext(context, intent)

      // Generate appropriate response based on intent
      const response = await this.generateResponse(message, intent, updatedContext, state)

      // Get product recommendations if relevant
      const productRecommendations = await this.getProductRecommendations(intent, updatedContext)

      // Generate suggested actions
      const suggestedActions = this.generateActions(intent, state, productRecommendations.length > 0)

      // Update conversation state
      this.updateConversationState(context.sessionId, intent, response)

      return {
        message: response.message || '',
        intent: response.intent || 'general-inquiry',
        confidence: response.confidence || 0.5,
        suggestedActions,
        productRecommendations,
        clarifyingQuestions: response.clarifyingQuestions,
        metadata: response.metadata
      }
    } catch (error) {
      console.error('Conversational AI error:', error)
      return this.getFallbackResponse()
    }
  }

  private getConversationState(sessionId: string): ConversationState {
    if (!this.conversationStates.has(sessionId)) {
      this.conversationStates.set(sessionId, {
        stage: 'greeting',
        mood: 'neutral',
        topicHistory: [],
        productContext: []
      })
    }
    return this.conversationStates.get(sessionId)!
  }

  private async extractIntent(
    message: string,
    context: ConversationContext,
    state: ConversationState
  ): Promise<Intent> {
    const prompt = `
    You are analyzing a customer message in a luxury menswear store chat.

    Customer message: "${message}"

    Conversation history (last 3 messages):
    ${context.conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

    Current conversation stage: ${state.stage}
    Topics discussed: ${state.topicHistory.join(', ')}

    Extract the customer's intent and key entities. Respond in JSON format:
    {
      "intent_type": "product-search|size-help|style-advice|occasion-help|order-status|general-question|checkout-help|comparison|budget-constraint",
      "confidence": 0.0-1.0,
      "entities": [
        {
          "type": "category|color|occasion|size|budget|brand|style",
          "value": "extracted value",
          "confidence": 0.0-1.0
        }
      ],
      "context": {
        "urgency": "immediate|planning|browsing",
        "sentiment": "positive|neutral|frustrated"
      }
    }
    `

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'You are an AI assistant that extracts intent from customer messages.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) throw new Error('OpenAI API error')

      const data = await response.json() as any
      const result = JSON.parse(data.choices[0].message.content)

      return {
        type: result.intent_type as IntentType,
        confidence: result.confidence,
        entities: result.entities,
        context: {
          previousIntent: context.currentIntent?.type,
          conversationStage: state.stage,
          mood: result.context.sentiment || state.mood
        }
      }
    } catch (error) {
      console.error('Intent extraction error:', error)
      return {
        type: 'general-question',
        confidence: 0.5,
        entities: [],
        context: {
          conversationStage: state.stage,
          mood: state.mood
        }
      }
    }
  }

  private updateContext(context: ConversationContext, intent: Intent): ConversationContext {
    const updatedPreferences = { ...context.extractedPreferences }

    // Update preferences based on entities
    intent.entities.forEach(entity => {
      switch (entity.type) {
        case 'occasion':
          updatedPreferences.occasion = entity.value as any
          break
        case 'budget':
          const budgetValue = parseInt(entity.value)
          if (!isNaN(budgetValue)) {
            updatedPreferences.budget = {
              min: budgetValue * 0.7,
              max: budgetValue * 1.3,
              preferred: budgetValue
            }
          }
          break
        case 'color':
          if (!updatedPreferences.colors) updatedPreferences.colors = []
          updatedPreferences.colors.push(entity.value)
          break
        case 'style':
          updatedPreferences.style = entity.value as any
          break
      }
    })

    return {
      ...context,
      currentIntent: intent,
      extractedPreferences: updatedPreferences
    }
  }

  private async generateResponse(
    message: string,
    intent: Intent,
    context: ConversationContext,
    state: ConversationState
  ): Promise<Partial<AIResponse>> {
    const systemPrompt = `
    You are Atelier AI, a sophisticated personal shopping assistant for KCT Menswear, a luxury men's formal wear store.

    Your personality:
    - Professional yet friendly
    - Knowledgeable about men's fashion
    - Helpful without being pushy
    - Concise but informative

    Current context:
    - Customer intent: ${intent.type}
    - Conversation stage: ${state.stage}
    - Customer mood: ${intent.context.mood}
    - Extracted preferences: ${JSON.stringify(context.extractedPreferences)}
    `

    const userPrompt = `
    Customer message: "${message}"
    Intent: ${intent.type}
    Entities: ${JSON.stringify(intent.entities)}

    Generate an appropriate response that:
    1. Addresses their ${intent.type} intent
    2. Is appropriate for the ${state.stage} stage
    3. Maintains a ${intent.context.mood === 'frustrated' ? 'empathetic and helpful' : 'professional and engaging'} tone
    4. Guides them towards finding the perfect outfit
    5. Is concise (2-3 sentences max)
    `

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            ...context.conversationHistory.slice(-5).map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content
            })),
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      })

      if (!response.ok) throw new Error('OpenAI API error')

      const data = await response.json() as any
      const aiMessage = data.choices[0].message.content

      return {
        message: aiMessage,
        intent: intent.type,
        confidence: intent.confidence
      }
    } catch (error) {
      console.error('Response generation error:', error)
      return this.getIntentBasedFallback(intent.type)
    }
  }

  private async getProductRecommendations(
    intent: Intent,
    context: ConversationContext
  ): Promise<ProductSuggestion[]> {
    // Only get recommendations for relevant intents
    if (!['product-search', 'style-advice', 'occasion-help', 'comparison'].includes(intent.type)) {
      return []
    }

    try {
      // Call Knowledge API for recommendations
      const response = await fetch(`${this.knowledgeApiUrl}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          occasion: context.extractedPreferences.occasion,
          budget: context.extractedPreferences.budget,
          style: context.extractedPreferences.style,
          colors: context.extractedPreferences.colors
        })
      })

      if (!response.ok) return []

      const data = await response.json() as any

      // Transform Knowledge API response to ProductSuggestions
      if (data.data && Array.isArray(data.data)) {
        return data.data.slice(0, 3).map((item: any) => ({
          productId: item.id || item.productId,
          reason: `Perfect for ${context.extractedPreferences.occasion || 'your needs'}`,
          relevanceScore: 0.8,
          highlight: item.name || item.title
        }))
      }

      return []
    } catch (error) {
      console.error('Product recommendation error:', error)
      return []
    }
  }

  private generateActions(
    intent: Intent,
    state: ConversationState,
    hasProducts: boolean
  ): Action[] {
    const actions: Action[] = []

    switch (intent.type) {
      case 'product-search':
        if (hasProducts) {
          actions.push({
            type: 'navigate',
            label: 'View All Results',
            data: { url: '/products' }
          })
        }
        actions.push({
          type: 'filter',
          label: 'Refine Search',
          data: { showFilters: true }
        })
        break

      case 'size-help':
        actions.push({
          type: 'size-guide',
          label: 'Open Size Guide',
          data: {}
        })
        break

      case 'occasion-help':
        actions.push({
          type: 'navigate',
          label: 'Browse Occasion Outfits',
          data: { url: '/occasions' }
        })
        break
    }

    // Always add contact support for frustrated customers
    if (state.mood === 'frustrated') {
      actions.push({
        type: 'contact-support',
        label: 'Speak to a Stylist',
        data: { priority: 'high' }
      })
    }

    return actions
  }

  private updateConversationState(
    sessionId: string,
    intent: Intent,
    response: Partial<AIResponse>
  ): void {
    const state = this.conversationStates.get(sessionId)!

    // Update stage based on intent
    if (['product-search', 'style-advice', 'occasion-help'].includes(intent.type)) {
      state.stage = 'discovery'
    } else if (['comparison', 'size-help'].includes(intent.type)) {
      state.stage = 'consideration'
    } else if (intent.type === 'checkout-help') {
      state.stage = 'checkout'
    }

    // Update mood
    state.mood = intent.context.mood as any

    // Add to topic history
    if (!state.topicHistory.includes(intent.type)) {
      state.topicHistory.push(intent.type)
    }

    this.conversationStates.set(sessionId, state)
  }

  private getFallbackResponse(): AIResponse {
    return {
      message: "I'd be happy to help you find the perfect outfit. What occasion are you shopping for?",
      intent: 'general-question',
      confidence: 0.3,
      suggestedActions: [
        {
          type: 'quick-reply',
          label: 'Wedding',
          data: { reply: 'I need a suit for a wedding' }
        },
        {
          type: 'quick-reply',
          label: 'Business',
          data: { reply: 'I need business attire' }
        },
        {
          type: 'quick-reply',
          label: 'Browse All',
          data: { reply: 'Show me all options' }
        }
      ],
      productRecommendations: []
    }
  }

  private getIntentBasedFallback(intent: IntentType): Partial<AIResponse> {
    const fallbacks: Record<IntentType, string> = {
      'product-search': "I'd be happy to help you find what you're looking for. Could you tell me more about the occasion or style you have in mind?",
      'size-help': "I can help you find the perfect fit. Would you like to use our size guide?",
      'style-advice': "I'd love to help you put together the perfect outfit. What's the occasion you're dressing for?",
      'occasion-help': "Let me help you find the ideal outfit for your event. Could you share more details about the occasion?",
      'order-status': "For order inquiries, please check your order confirmation email or contact our customer service team.",
      'general-question': "I'm here to help! Feel free to ask about our products, sizing, or styling advice.",
      'checkout-help': "I can assist with your purchase. Are you having trouble with the checkout process?",
      'comparison': "I'd be happy to help you compare options. Which items are you considering?",
      'budget-constraint': "Let me help you find great options within your budget. What's your price range?"
    }

    return {
      message: fallbacks[intent],
      intent,
      confidence: 0.7
    }
  }
}
