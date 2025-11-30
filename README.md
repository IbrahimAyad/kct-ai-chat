# KCT AI Chat Service

Conversational AI service for KCT Menswear - A standalone Express.js API for fashion consultation chatbot.

## 🎯 Purpose

This service provides intelligent conversational AI for KCT Menswear's customer-facing website. It handles:
- Natural language understanding
- Intent classification
- Product recommendations
- Style advice
- Size assistance
- Conversation context management

## 🏗️ Architecture

```
KCT AI Chat (this service)
  │
  ├─→ OpenAI GPT-4 (conversational AI)
  ├─→ Supabase (chat history & analytics)
  └─→ Knowledge API (product recommendations & fashion intelligence)
```

## 📋 Prerequisites

- Node.js >= 18.0.0
- Supabase account (same database as your Lovable site)
- OpenAI API key
- Access to KCT Knowledge API

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Then edit `.env` with your credentials:

```env
PORT=3002
NODE_ENV=development
OPENAI_API_KEY=sk-proj-your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
KNOWLEDGE_API_URL=https://kct-knowledge-api-2-production.up.railway.app
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3002`

### 4. Test the API

```bash
curl -X POST http://localhost:3002/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a suit for a wedding",
    "sessionId": "test-session-123"
  }'
```

## 📡 API Endpoints

### POST /api/chat/message
Send a message and get AI response

**Request:**
```json
{
  "message": "I need a suit for a wedding",
  "sessionId": "unique-session-id",
  "userId": "optional-user-id",
  "context": {
    "currentIntent": "wedding-help",
    "extractedPreferences": {
      "occasion": "wedding",
      "budget": { "min": 400, "max": 600, "preferred": 500 }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "I'd be happy to help you find the perfect wedding suit!...",
    "intent": "occasion-help",
    "confidence": 0.9,
    "suggestedActions": [...],
    "productRecommendations": [...]
  }
}
```

### GET /api/chat/history/:sessionId
Get conversation history

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "session_id": "abc123",
      "role": "user",
      "content": "I need a suit",
      "created_at": "2025-11-30T10:00:00Z"
    },
    ...
  ]
}
```

### POST /api/chat/feedback
Record feedback on AI responses

**Request:**
```json
{
  "sessionId": "abc123",
  "messageId": "msg-456",
  "rating": 5,
  "feedback": "Very helpful!"
}
```

## 🚢 Deployment to Railway

### 1. Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: KCT AI Chat Service"
```

### 2. Create GitHub Repository

```bash
# Create repo on GitHub, then:
git remote add origin https://github.com/YourUsername/kct-ai-chat.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `kct-ai-chat` repository
4. Railway will auto-detect the Node.js project

### 4. Configure Environment Variables

In Railway dashboard, add these variables:

```
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
KNOWLEDGE_API_URL=https://kct-knowledge-api-2-production.up.railway.app
NODE_ENV=production
```

### 5. Deploy

Railway will automatically deploy. Your API will be available at:
```
https://kct-ai-chat-production.up.railway.app
```

## 🔗 Connect to Lovable

From your Lovable website, call the chat API:

```typescript
// In Lovable site
const sendMessage = async (message: string, sessionId: string) => {
  const response = await fetch(
    'https://kct-ai-chat-production.up.railway.app/api/chat/message',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    }
  )

  const data = await response.json()
  return data.response
}
```

## 📊 Supabase Tables Required

The service expects these tables in your Supabase database:

### chat_history
```sql
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  intent TEXT,
  confidence FLOAT,
  product_recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session ON chat_history(session_id);
CREATE INDEX idx_chat_history_user ON chat_history(user_id);
```

### ai_interactions
```sql
CREATE TABLE ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  intent TEXT,
  confidence FLOAT,
  resulted_in_recommendation BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### chat_feedback
```sql
CREATE TABLE chat_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test with actual OpenAI
npm run test:integration
```

## 📝 Development

```bash
# Run in dev mode with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run typecheck

# Lint code
npm run lint
```

## 🔧 Configuration

### Conversation Flow
The AI manages conversation state through stages:
1. **Greeting** - Initial customer contact
2. **Discovery** - Learning preferences
3. **Consideration** - Comparing options
4. **Decision** - Final selection
5. **Checkout** - Purchase assistance

### Intent Types
- `product-search` - Looking for specific items
- `size-help` - Size and fit questions
- `style-advice` - Fashion guidance
- `occasion-help` - Event-specific recommendations
- `budget-constraint` - Price-based filtering
- `comparison` - Comparing products
- `checkout-help` - Purchase assistance

## 🤝 Integration with Knowledge API

This service connects to the Knowledge API for:
- Product recommendations
- Style intelligence
- Color combinations
- Seasonal trends
- Fashion rules validation

## 📈 Monitoring

Check health status:
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-30T10:00:00.000Z",
  "version": "1.0.0",
  "service": "kct-ai-chat"
}
```

## 💰 Cost Estimation

- **Railway**: ~$5-10/month (Hobby/Pro plan)
- **OpenAI API**: ~$0.002 per conversation (GPT-4)
- **Supabase**: Free tier (shared with Lovable site)

**Monthly estimate**: ~$15-25 for moderate traffic

## 🛡️ Security

- ✅ Helmet.js for HTTP headers
- ✅ CORS configured for specific domains
- ✅ Rate limiting (100 requests/15min per IP)
- ✅ Input validation
- ✅ Environment variables for secrets

## 📞 Support

For issues or questions:
- GitHub Issues: [Your repo URL]
- Knowledge API: https://kct-knowledge-api-2-production.up.railway.app

## 📄 License

UNLICENSED - Private use only
