import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import chatRoutes from './routes/chat'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Security middleware
app.use(helmet())
app.use(compression())

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'https://kctmenswear.com',
      'https://www.kctmenswear.com',
      'https://kct-menswear.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ]

    // Allow Lovable preview domains (both .lovable.app and .lovableproject.com)
    if (!origin ||
        allowedOrigins.includes(origin) ||
        origin.includes('.lovable.app') ||
        origin.includes('.lovableproject.com')) {
      callback(null, true)
    } else {
      console.warn(`⛔ CORS blocked: ${origin}`)
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

app.use('/api/', limiter)

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'kct-ai-chat'
  })
})

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'KCT AI Chat Service',
    version: '1.0.0',
    description: 'Conversational AI for KCT Menswear fashion consultation',
    endpoints: {
      health: '/health',
      chat_message: 'POST /api/chat/message',
      chat_history: 'GET /api/chat/history/:sessionId',
      chat_feedback: 'POST /api/chat/feedback'
    },
    documentation: {
      github: 'https://github.com/IbrahimAyad/kct-ai-chat',
      knowledge_api: 'https://kct-knowledge-api-2-production.up.railway.app'
    }
  })
})

// Chat routes
app.use('/api/chat', chatRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🤖 KCT AI Chat Service v1.0.0`)
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/health`)
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat/message`)
  console.log(`\n🔑 Required Environment Variables:`)
  console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - KNOWLEDGE_API_URL: ${process.env.KNOWLEDGE_API_URL || 'Using default'}`)
})

export default app
