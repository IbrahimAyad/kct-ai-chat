import { Router, Request, Response } from 'express'
import { ConversationalAI } from '../services/conversational-ai'
import { ToolBasedAI } from '../services/tool-based-ai'
import { createClient } from '@supabase/supabase-js'
import type { ChatRequest, ChatResponse, HistoryRequest, HistoryResponse, Message, ConversationContext } from '../types/chat'

const router = Router()

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Initialize AI services
const conversationalAI = new ConversationalAI()
const toolBasedAI = new ToolBasedAI()

// Feature flag to switch between old and new AI
const USE_TOOL_BASED_AI = process.env.USE_TOOL_BASED_AI === 'true'

// POST /api/chat/message - Send a message and get AI response
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, userId, context }: ChatRequest = req.body

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Message and session ID are required'
      })
    }

    // Get conversation history from database
    const { data: history } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Build conversation context
    const conversationHistory: Message[] = history?.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      intent: msg.intent,
      entities: []
    })) || []

    // Get user's shopping cart if available
    const { data: cartItems } = userId ? await supabase
      .from('cart_items')
      .select('product_id')
      .eq('user_id', userId) : { data: [] }

    const shoppingCart = cartItems?.map(item => item.product_id) || []

    const conversationContext: ConversationContext = {
      sessionId,
      userId,
      conversationHistory,
      currentIntent: context?.currentIntent ? {
        type: context.currentIntent as any,
        confidence: 0.5,
        entities: [],
        context: { conversationStage: 'discovery', mood: 'neutral' }
      } : undefined,
      extractedPreferences: context?.extractedPreferences || {},
      shoppingCart,
      activeProducts: context?.activeProducts || [],
      lastInteraction: conversationHistory[conversationHistory.length - 1]?.timestamp || new Date()
    }

    // Process message with AI (feature flag to switch between implementations)
    const aiResponse = USE_TOOL_BASED_AI
      ? await toolBasedAI.processMessage(message, conversationContext)
      : await conversationalAI.processMessage(message, conversationContext)

    // Store user message in history
    await supabase.from('chat_history').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: message,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence
    })

    // Store AI response in history
    await supabase.from('chat_history').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: aiResponse.message,
      intent: aiResponse.intent,
      product_recommendations: aiResponse.productRecommendations?.map(p => p.productId)
    })

    // Track analytics
    await supabase.from('ai_interactions').insert({
      user_id: userId,
      session_id: sessionId,
      interaction_type: 'chat',
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      resulted_in_recommendation: aiResponse.productRecommendations.length > 0
    })

    const response: ChatResponse = {
      success: true,
      response: aiResponse
    }

    return res.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to process message'
    })
  }
})

// GET /api/chat/history/:sessionId - Get conversation history
router.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params
    const limit = parseInt(req.query.limit as string) || 50

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      })
    }

    const { data: history, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true})
      .limit(limit)

    if (error) throw error

    const response: HistoryResponse = {
      success: true,
      history: history || []
    }

    return res.json(response)
  } catch (error) {
    console.error('Get chat history error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get conversation history'
    })
  }
})

// POST /api/chat/feedback - Record feedback on AI response
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { sessionId, messageId, rating, feedback } = req.body

    if (!sessionId || !messageId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and message ID are required'
      })
    }

    await supabase.from('chat_feedback').insert({
      session_id: sessionId,
      message_id: messageId,
      rating,
      feedback
    })

    return res.json({
      success: true,
      message: 'Feedback recorded successfully'
    })
  } catch (error) {
    console.error('Feedback error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to record feedback'
    })
  }
})

export default router
