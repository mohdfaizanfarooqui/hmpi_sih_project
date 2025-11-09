# 🤖 AI Chatbot Setup Guide

## Overview
The PURE-Intelligence chatbot has been upgraded with advanced AI capabilities using Google's Gemini API. It now provides intelligent, context-aware responses about water quality monitoring, health risks, and application features.

---

## Features

### ✅ Enhanced Capabilities
- **AI-Powered Responses**: Uses Google Gemini Pro for natural language understanding
- **Context-Aware**: Knows your current data and application state
- **Scientific Accuracy**: Trained on WHO/EPA standards and pollution science
- **Markdown Support**: Formatted responses with bold, italic, code blocks
- **Typing Indicators**: Shows when AI is thinking
- **Chat History**: Maintains conversation context
- **Fallback System**: Works without API key using enhanced rule-based responses

### 🎨 Improved UI
- Modern gradient design
- Smooth animations
- Typing indicators
- Better message formatting
- Mobile responsive
- AI badge indicator

---

## Setup Instructions

### Option 1: Enable AI (Recommended)

#### Step 1: Get Free API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

#### Step 2: Configure API Key
Open `src/js/chatbot-config.js` and add your API key:

```javascript
const CHATBOT_CONFIG = {
    GEMINI_API_KEY: 'YOUR_API_KEY_HERE', // Paste your key here
    AI_ENABLED: true,
    // ... rest of config
};
```

#### Step 3: Test
1. Open your application
2. Click the chatbot button (bottom right)
3. Ask: "What is HPI?"
4. You should get an AI-powered response!

### Option 2: Use Without AI (Fallback Mode)

The chatbot works perfectly without an API key using enhanced rule-based responses:

1. Leave `GEMINI_API_KEY` empty in config
2. The chatbot will use intelligent fallback responses
3. Still provides helpful, formatted answers
4. No external API calls needed

---

## API Key Security

### For Development
- Store API key in `chatbot-config.js` (already in .gitignore)
- Never commit API keys to version control

### For Production
Use environment variables:

```javascript
const CHATBOT_CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    // ...
};
```

Or use a backend proxy:
```javascript
// Instead of calling Gemini directly, call your backend
const response = await fetch('/api/chatbot', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage })
});
```

---

## Usage Examples

### Example Conversations

**User**: "What is HPI?"
**AI**: "🔬 HPI (Heavy Metal Pollution Index) represents overall water quality. It's calculated using weighted metal concentrations. Classification: <15 = Excellent ✅, 15-30 = Good 👍, 30-45 = Poor ⚠️, >45 = Very Poor ❌"

**User**: "How do I upload data?"
**AI**: "📤 To upload data: 1) Click 'Download Template' for the correct CSV format, 2) Fill in location, coordinates, date, and metal concentrations, 3) Drag & drop or click 'Choose File', 4) Data is automatically saved to the database!"

**User**: "What are the health risks of lead?"
**AI**: "⚕️ Lead exposure can cause serious health issues including neurological damage, kidney disease, cardiovascular problems, and developmental issues in children. The WHO limit is 0.01 mg/L. Even low levels can be harmful over time."

---

## Customization

### Modify System Context
Edit the `SYSTEM_CONTEXT` in `src/js/chatbot.js`:

```javascript
const SYSTEM_CONTEXT = `You are PURE-Intelligence Assistant...
Add your custom instructions here...`;
```

### Adjust AI Parameters
In `chatbot-config.js`:

```javascript
GENERATION_CONFIG: {
    temperature: 0.7,  // 0-1, higher = more creative
    topK: 40,          // Sampling parameter
    topP: 0.95,        // Nucleus sampling
    maxOutputTokens: 500  // Max response length
}
```

### Add Custom Responses
In `generateBotResponse()` function, add new patterns:

```javascript
if (message.includes('your-keyword')) {
    return 'Your custom response here';
}
```

---

## Troubleshooting

### "API request failed"
- Check if API key is correct
- Verify internet connection
- Check API quota (free tier: 60 requests/minute)
- Falls back to rule-based responses automatically

### Chatbot not appearing
- Check if `chatbot.css` is loaded
- Verify JavaScript files are loaded in correct order
- Check browser console for errors

### Responses are slow
- Normal for AI responses (1-3 seconds)
- Typing indicator shows while processing
- Consider caching common questions

### API quota exceeded
- Free tier: 60 requests/minute
- Implement rate limiting
- Cache frequent responses
- Use fallback mode during high traffic

---

## API Costs

### Free Tier (Gemini Pro)
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**
- Perfect for development and small deployments

### Paid Tier
- Higher rate limits
- More tokens
- Priority support
- See [Google AI Pricing](https://ai.google.dev/pricing)

---

## Advanced Features

### Context-Aware Responses
The AI knows your current application state:
- Number of monitoring locations
- Latest HPI values
- Average pollution levels
- Recent uploads

### Multi-Turn Conversations
Chat history is maintained:
```javascript
chatHistory.push({ user: message, bot: response });
```

### Markdown Formatting
Supports:
- **Bold text** with `**text**`
- *Italic text* with `*text*`
- `Code blocks` with backticks
- Bullet points with `•`
- Line breaks with `\n`

---

## Performance Optimization

### Caching
Implement response caching:
```javascript
const responseCache = new Map();
if (responseCache.has(message)) {
    return responseCache.get(message);
}
```

### Rate Limiting
Add request throttling:
```javascript
let lastRequestTime = 0;
const MIN_INTERVAL = 1000; // 1 second

if (Date.now() - lastRequestTime < MIN_INTERVAL) {
    return 'Please wait a moment before asking another question.';
}
```

### Lazy Loading
Load chatbot only when needed:
```javascript
let chatbotLoaded = false;
function toggleChatbot() {
    if (!chatbotLoaded) {
        loadChatbotResources();
        chatbotLoaded = true;
    }
    // ... rest of toggle logic
}
```

---

## Testing

### Test AI Responses
```javascript
// In browser console
sendChatMessage(); // Type a message first
```

### Test Fallback Mode
```javascript
// Temporarily disable AI
isAIEnabled = false;
sendChatMessage();
```

### Test Error Handling
```javascript
// Use invalid API key to test fallback
GEMINI_API_KEY = 'invalid_key';
```

---

## Files Modified

1. **src/js/chatbot.js** - Main chatbot logic with AI integration
2. **src/css/chatbot.css** - Enhanced styling and animations
3. **src/js/chatbot-config.js** - Configuration file (NEW)
4. **index.html** - Updated chatbot UI and CSS link

---

## Next Steps

### Recommended Enhancements
1. ✅ Add voice input/output
2. ✅ Implement conversation history export
3. ✅ Add quick reply buttons
4. ✅ Multi-language support
5. ✅ Sentiment analysis
6. ✅ User feedback system

### Production Checklist
- [ ] Get production API key
- [ ] Set up backend proxy for API calls
- [ ] Implement rate limiting
- [ ] Add response caching
- [ ] Monitor API usage
- [ ] Set up error logging
- [ ] Add analytics tracking

---

## Support

### Resources
- [Google AI Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Best Practices](https://ai.google.dev/docs/best_practices)

### Common Issues
- API key issues → Check Google AI Studio
- Rate limits → Implement caching
- Slow responses → Normal for AI (1-3s)
- Formatting issues → Check markdown syntax

---

**Status**: ✅ Chatbot upgraded and ready to use!

**With API Key**: Advanced AI-powered responses
**Without API Key**: Enhanced rule-based responses

Both modes provide excellent user experience! 🚀
