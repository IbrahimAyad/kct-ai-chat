// Chat API Type Definitions
export type OccasionType =
  | 'wedding'
  | 'wedding-guest'
  | 'business-formal'
  | 'business-casual'
  | 'cocktail'
  | 'black-tie'
  | 'prom'
  | 'date-night'
  | 'interview'
  | 'graduation'
  | 'holiday-party'
  | 'casual-friday'

export type IntentType =
  | 'product-search'
  | 'size-help'
  | 'style-advice'
  | 'occasion-help'
  | 'order-status'
  | 'general-question'
  | 'checkout-help'
  | 'comparison'
  | 'budget-constraint'

export type StylePersonality =
  | 'classic'
  | 'modern'
  | 'trendy'
  | 'minimalist'
  | 'bold'
  | 'vintage'
  | 'sophisticated'
  | 'casual'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
  entities?: ExtractedEntity[]
}

export interface ConversationContext {
  sessionId: string
  userId?: string
  conversationHistory: Message[]
  currentIntent?: Intent
  extractedPreferences: ExtractedPreferences
  shoppingCart: string[]
  activeProducts: string[]
  lastInteraction: Date
}

export interface Intent {
  type: IntentType
  confidence: number
  entities: ExtractedEntity[]
  context: IntentContext
}

export interface ExtractedEntity {
  type: string
  value: string
  confidence: number
}

export interface IntentContext {
  previousIntent?: IntentType
  conversationStage: 'greeting' | 'discovery' | 'consideration' | 'decision' | 'checkout'
  mood: 'positive' | 'neutral' | 'frustrated'
}

export interface ExtractedPreferences {
  occasion?: OccasionType
  budget?: BudgetRange
  colors?: string[]
  style?: StylePersonality
  urgency?: 'immediate' | 'planning' | 'browsing'
  specificItems?: string[]
}

export interface BudgetRange {
  min: number
  max: number
  preferred: number
}

export interface AIResponse {
  message: string
  intent: string
  confidence: number
  suggestedActions: Action[]
  productRecommendations: ProductSuggestion[]
  clarifyingQuestions?: string[]
  metadata?: {
    agent?: AgentInfo
    shouldHandoff?: boolean
    emotion?: string
    urgency?: string
  }
}

export interface Action {
  type: 'navigate' | 'filter' | 'add-to-cart' | 'size-guide' | 'contact-support' | 'quick-reply'
  label: string
  data: Record<string, any>
}

export interface ProductSuggestion {
  productId: string
  reason: string
  relevanceScore: number
  highlight: string
  product?: any
}

export interface AgentInfo {
  name: string
  avatar: string
  title: string
  specialty: string
}

export interface ChatHistoryItem {
  session_id: string
  user_id?: string
  role: 'user' | 'assistant'
  content: string
  intent?: string
  confidence?: number
  product_recommendations?: string[]
  created_at: string
}

export interface ChatRequest {
  message: string
  sessionId: string
  userId?: string
  context?: {
    currentIntent?: string
    extractedPreferences?: Partial<ExtractedPreferences>
    activeProducts?: string[]
  }
}

export interface ChatResponse {
  success: boolean
  response: AIResponse
}

export interface HistoryRequest {
  sessionId: string
  limit?: number
}

export interface HistoryResponse {
  success: boolean
  history: ChatHistoryItem[]
}
