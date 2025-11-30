# Deployment Guide

## 🚀 Deploy to Railway (Recommended)

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/IbrahimAyad/kct-ai-chat.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `kct-ai-chat`
5. Railway will auto-detect Node.js and deploy

### Step 3: Set Environment Variables

In Railway dashboard → Variables tab, add:

```
OPENAI_API_KEY=sk-proj-[your-key]
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
KNOWLEDGE_API_URL=https://kct-knowledge-api-2-production.up.railway.app
NODE_ENV=production
```

### Step 4: Deploy

Railway auto-deploys. Your API will be live at:
```
https://kct-ai-chat-production.up.railway.app
```

### Step 5: Test Deployment

```bash
curl https://kct-ai-chat-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "kct-ai-chat",
  "version": "1.0.0"
}
```

---

## 🔗 Connect to Lovable Website

### 1. Add Domain to CORS

Railway will give you a URL like:
```
https://kct-ai-chat-production.up.railway.app
```

This is already configured to accept requests from:
- `*.lovable.app` domains
- `kctmenswear.com`
- `localhost:3000`

### 2. Create Chat Service in Lovable

```typescript
// services/chat.ts in your Lovable project
export const chatService = {
  apiUrl: 'https://kct-ai-chat-production.up.railway.app',

  async sendMessage(message: string, sessionId: string, userId?: string) {
    const response = await fetch(`${this.apiUrl}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId,
        userId,
        context: {
          // Optional: Add current page context
          activeProducts: [],
          extractedPreferences: {}
        }
      })
    })

    if (!response.ok) {
      throw new Error('Chat request failed')
    }

    const data = await response.json()
    return data.response
  },

  async getHistory(sessionId: string) {
    const response = await fetch(
      `${this.apiUrl}/api/chat/history/${sessionId}`
    )
    const data = await response.json()
    return data.history
  }
}
```

### 3. Use in Lovable Component

```tsx
import { useState } from 'react'
import { chatService } from './services/chat'

export function ChatWidget() {
  const [message, setMessage] = useState('')
  const [sessionId] = useState(() => `session-${Date.now()}`)

  const handleSend = async () => {
    const response = await chatService.sendMessage(message, sessionId)

    // Display AI response
    console.log(response.message)

    // Show product recommendations
    response.productRecommendations.forEach(rec => {
      console.log('Recommended:', rec.productId, rec.reason)
    })

    // Show suggested actions
    response.suggestedActions.forEach(action => {
      console.log('Action:', action.label)
    })
  }

  return (
    <div className="chat-widget">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about suits..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
```

---

## 📊 Supabase Setup

### Required Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Chat history table
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  intent TEXT,
  confidence FLOAT,
  product_recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session ON chat_history(session_id);
CREATE INDEX idx_chat_history_user ON chat_history(user_id);
CREATE INDEX idx_chat_history_created ON chat_history(created_at DESC);

-- AI interactions analytics
CREATE TABLE ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  intent TEXT,
  confidence FLOAT,
  resulted_in_recommendation BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);

-- Chat feedback
CREATE TABLE chat_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: cart_items table (if not exists)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for GPT-4 | `sk-proj-abc123...` |
| `SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous key | `eyJhbGc...` |
| `KNOWLEDGE_API_URL` | ⚠️ Optional | Knowledge API endpoint | Default: Railway URL |
| `NODE_ENV` | ⚠️ Optional | Environment | `production` |
| `PORT` | ⚠️ Optional | Server port | Default: `3002` |

---

## 💰 Cost Breakdown

### Railway Hosting
- **Hobby**: $5/month (500 hours)
- **Pro**: $20/month (unlimited)

### OpenAI API
- **GPT-4 Turbo**: ~$0.01 per 1K tokens
- **Average conversation**: ~2K tokens = $0.02
- **1000 conversations/month**: ~$20

### Supabase
- **Free tier**: Up to 500MB database
- **Pro**: $25/month (8GB)

**Total Monthly Cost**: $25-65 depending on usage

---

## 📈 Monitoring

### Railway Dashboard
- View logs: `railway logs`
- Check metrics: Railway dashboard → Metrics tab
- View deployments: Railway dashboard → Deployments

### Health Checks
```bash
# Check if service is running
curl https://your-app.railway.app/health

# Test chat endpoint
curl -X POST https://your-app.railway.app/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"test"}'
```

### Supabase Analytics
Check these metrics in Supabase dashboard:
- Total chat messages per day
- Unique sessions
- Average conversation length
- Intent distribution
- Product recommendation click-through rate

---

## 🐛 Troubleshooting

### "OpenAI API error"
- Check `OPENAI_API_KEY` is set correctly
- Verify API key has credits
- Check OpenAI dashboard for rate limits

### "Supabase connection failed"
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check Supabase project is active
- Ensure tables are created

### "CORS error from Lovable"
- Verify Lovable domain is in CORS allowed origins
- Check browser console for exact error
- Add Lovable preview domain to CORS if needed

### "Rate limit exceeded"
- Increase rate limit in `src/server.ts`
- Or upgrade Railway plan for more resources

---

## 🔄 Updates & Maintenance

### Deploy Updates
```bash
git add .
git commit -m "Update: description"
git push origin main
```

Railway will auto-deploy within 1-2 minutes.

### View Logs
```bash
railway logs --tail
```

### Rollback Deployment
Railway dashboard → Deployments → Select previous deployment → "Redeploy"

---

## ✅ Launch Checklist

Before going live:

- [ ] All environment variables set in Railway
- [ ] Supabase tables created
- [ ] Health check returns 200
- [ ] Test chat endpoint with real message
- [ ] CORS configured for production domain
- [ ] OpenAI API key has sufficient credits
- [ ] Lovable website can connect to chat API
- [ ] Error handling tested
- [ ] Rate limiting configured appropriately

---

## 📞 Support

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Test health endpoint
4. Check Supabase connection
5. Review OpenAI API status

For questions:
- GitHub: [Your repo]
- Knowledge API: https://kct-knowledge-api-2-production.up.railway.app
