# ⚡ Quick Start Guide

Get your KCT AI Chat Service running in 5 minutes!

## 1️⃣ Install Dependencies (1 min)

```bash
cd /Users/ibrahim/Desktop/kct-ai-chat
npm install
```

## 2️⃣ Configure Environment (2 min)

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
PORT=3002
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
KNOWLEDGE_API_URL=https://kct-knowledge-api-2-production.up.railway.app
```

**Where to get these:**
- **OpenAI Key**: https://platform.openai.com/api-keys
- **Supabase**: https://supabase.com/dashboard → Your project → Settings → API

## 3️⃣ Test Locally (1 min)

```bash
npm run dev
```

You should see:
```
🤖 KCT AI Chat Service v1.0.0
🚀 Server running on port 3002
📋 Health check: http://localhost:3002/health
```

## 4️⃣ Test the API (1 min)

Open a new terminal and run:

```bash
curl -X POST http://localhost:3002/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a suit for a wedding",
    "sessionId": "test-123"
  }'
```

You should get an AI response! 🎉

---

## 🚀 Deploy to Railway (5 min)

### 1. Create GitHub Repo

```bash
# Create a new repo on GitHub (https://github.com/new)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/kct-ai-chat.git
git push -u origin main
```

### 2. Deploy on Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `kct-ai-chat`
4. Railway deploys automatically!

### 3. Add Environment Variables

In Railway dashboard → Variables tab:

```
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
KNOWLEDGE_API_URL=https://kct-knowledge-api-2-production.up.railway.app
NODE_ENV=production
```

### 4. Get Your API URL

Railway gives you a URL like:
```
https://kct-ai-chat-production.up.railway.app
```

Test it:
```bash
curl https://kct-ai-chat-production.up.railway.app/health
```

---

## 🔗 Connect to Lovable (2 min)

In your Lovable project, create a chat service:

```typescript
// services/chat.ts
export async function sendChatMessage(message: string, sessionId: string) {
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

Use it in a component:

```tsx
const [sessionId] = useState(() => `session-${Date.now()}`)

const handleSend = async (message: string) => {
  const response = await sendChatMessage(message, sessionId)
  console.log('AI:', response.message)
  console.log('Products:', response.productRecommendations)
}
```

---

## ✅ You're Done!

Your AI chat is now:
- ✅ Running locally
- ✅ Deployed to Railway
- ✅ Ready to connect to Lovable

---

## 📋 Checklist

- [ ] `npm install` completed
- [ ] `.env` file created with all keys
- [ ] Local server running (`npm run dev`)
- [ ] Test API call successful
- [ ] GitHub repo created
- [ ] Deployed to Railway
- [ ] Environment variables set in Railway
- [ ] Production URL tested
- [ ] Connected to Lovable website

---

## 🆘 Common Issues

**"OpenAI API error"**
→ Check your `OPENAI_API_KEY` in `.env`

**"Supabase connection failed"**
→ Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**"Module not found"**
→ Run `npm install` again

**"Port already in use"**
→ Change `PORT=3002` to `PORT=3003` in `.env`

---

## 📚 Next Steps

- Read `README.md` for detailed documentation
- See `DEPLOYMENT.md` for deployment guide
- Create Supabase tables (SQL in `DEPLOYMENT.md`)
- Build chat UI in Lovable

---

**Need help?** Check the README.md or create an issue on GitHub!
