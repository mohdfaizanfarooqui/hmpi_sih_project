// Advanced AI Chatbot with Gemini API
// Configuration is loaded from chatbot-config.js
let GEMINI_API_KEY = '';
let GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
let GENERATION_CONFIG = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 500
};

// Load config if available
if (typeof CHATBOT_CONFIG !== 'undefined') {
    GEMINI_API_KEY = CHATBOT_CONFIG.GEMINI_API_KEY || '';
    GEMINI_API_URL = CHATBOT_CONFIG.GEMINI_API_URL || GEMINI_API_URL;
    GENERATION_CONFIG = CHATBOT_CONFIG.GENERATION_CONFIG || GENERATION_CONFIG;
}

// Chatbot state
let chatHistory = [];
let isAIEnabled = true;

// System context for the AI
const SYSTEM_CONTEXT = `You are PURE-Intelligence Assistant, an expert AI helping users with water quality monitoring and heavy metal pollution analysis. 

Your expertise includes:
- Heavy Metal Pollution Index (HPI), Heavy Metal Evaluation Index (HEI), and Contamination Degree (Cd) calculations
- Health risks from heavy metals (Lead, Mercury, Cadmium, Arsenic, Chromium, Copper, Zinc, Nickel)
- WHO/EPA water quality standards
- Climate change impact on water contamination
- Energy efficiency in water testing
- Carbon footprint reduction
- Disease prediction from metal exposure

WHO/EPA Limits (mg/L):
- Lead: 0.01, Mercury: 0.006, Cadmium: 0.003, Arsenic: 0.01
- Chromium: 0.05, Copper: 2.0, Zinc: 3.0, Nickel: 0.07

HPI Classification:
- <15: Excellent, 15-30: Good, 30-45: Poor, >45: Very Poor

Be helpful, concise, and scientifically accurate. Use emojis occasionally for friendliness.`;

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot-window');
    chatbot.classList.toggle('active');
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    try {
        let response;
        if (isAIEnabled && GEMINI_API_KEY && GEMINI_API_KEY.length > 20) {
            response = await getAIResponse(message);
        } else {
            // Fallback to enhanced rule-based responses
            response = generateBotResponse(message);
        }
        
        removeTypingIndicator();
        addChatMessage(response, 'bot');
        
        // Store in history
        chatHistory.push({ user: message, bot: response });
        
    } catch (error) {
        console.error('Chatbot error:', error);
        removeTypingIndicator();
        const fallbackResponse = generateBotResponse(message);
        addChatMessage('🔄 Switching to offline mode: ' + fallbackResponse, 'bot');
    }
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `<strong>You:</strong> ${escapeHtml(message)}`;
    } else {
        // Support markdown-like formatting
        const formattedMessage = formatBotMessage(message);
        messageDiv.innerHTML = `<strong>🤖 PURE-I Assistant:</strong> ${formattedMessage}`;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `<strong>🤖 PURE-I Assistant:</strong> <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBotMessage(message) {
    // Convert markdown-like syntax to HTML
    let formatted = escapeHtml(message);
    
    // Bold text **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code blocks `code`
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Bullet points
    formatted = formatted.replace(/^- (.*?)$/gm, '• $1');
    
    return formatted;
}

// AI-powered response using Gemini API
async function getAIResponse(userMessage) {
    try {
        // Build context with current data
        const dataContext = buildDataContext();
        const fullPrompt = `${SYSTEM_CONTEXT}\n\nCurrent Application Data:\n${dataContext}\n\nUser Question: ${userMessage}\n\nProvide a helpful, accurate response:`;
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: GENERATION_CONFIG
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        return aiResponse;
        
    } catch (error) {
        console.error('AI API error:', error);
        throw error;
    }
}

// Build context from current application state
function buildDataContext() {
    let context = '';
    
    if (typeof waterQualityData !== 'undefined' && waterQualityData.length > 0) {
        context += `Total monitoring locations: ${waterQualityData.length}\n`;
        
        const latest = waterQualityData[waterQualityData.length - 1];
        context += `Latest location: ${latest.location}\n`;
        
        if (latest.indices) {
            context += `Latest HPI: ${latest.indices.hpi}, HEI: ${latest.indices.hei}, Cd: ${latest.indices.cd}\n`;
        }
        
        // Calculate average HPI
        const avgHPI = waterQualityData.reduce((sum, d) => sum + parseFloat(d.indices?.hpi || 0), 0) / waterQualityData.length;
        context += `Average HPI across all locations: ${avgHPI.toFixed(2)}\n`;
    } else {
        context += 'No monitoring data currently loaded.\n';
    }
    
    return context;
}

// Enhanced fallback response with better intelligence
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses
    if (message.includes('data') || message.includes('location')) {
        if (typeof waterQualityData !== 'undefined' && waterQualityData.length > 0) {
            const avgHPI = waterQualityData.reduce((sum, d) => sum + parseFloat(d.indices?.hpi || 0), 0) / waterQualityData.length;
            return `📊 You have **${waterQualityData.length} monitoring locations**. Average HPI: **${avgHPI.toFixed(2)}**. The latest location is "${waterQualityData[waterQualityData.length - 1].location}".`;
        }
        return '📊 No monitoring data loaded yet. Upload a CSV file or enter data manually to get started!';
    }
    
    if (message.includes('hpi')) {
        return `🔬 **HPI (Heavy Metal Pollution Index)** represents overall water quality:\n\n• **<15**: Excellent ✅\n• **15-30**: Good 👍\n• **30-45**: Poor ⚠️\n• **>45**: Very Poor ❌\n\nFormula: HPI = Σ(Wi × Qi)/ΣWi`;
    }
    
    if (message.includes('hei')) {
        return '📈 **HEI (Heavy Metal Evaluation Index)** is the sum of concentration ratios to permissible limits. Lower values indicate better water quality. HEI < 10 is generally acceptable.';
    }
    
    if (message.includes('health') || message.includes('risk') || message.includes('disease')) {
        return '⚕️ **Health Risk Assessment** considers:\n\n• Metal toxicity levels\n• Exposure duration\n• Concentration vs WHO limits\n\n**High-risk metals**: Lead, Mercury, Arsenic, Cadmium\n\nUse the **Disease Prediction** tab for AI-powered health risk analysis!';
    }
    
    if (message.includes('upload') || message.includes('csv') || message.includes('import')) {
        return '📤 **CSV Upload Instructions**:\n\n1. Click "Download Template" for correct format\n2. Fill in: location, latitude, longitude, date, metal concentrations\n3. Drag & drop or click "Choose File"\n4. Data automatically saved to database!\n\n**Tip**: You can upload hundreds of records at once!';
    }
    
    if (message.includes('map')) {
        return '🗺️ **Interactive Map Features**:\n\n• Color-coded markers (green=good, red=poor)\n• Click markers for detailed info\n• Click map to set coordinates\n• Automatic location clustering\n\nGo to the **Interactive Map** tab to explore!';
    }
    
    if (message.includes('formula') || message.includes('calculate') || message.includes('equation')) {
        return '🧮 **Calculation Formulas**:\n\n**HPI**: Σ(Wi × Qi)/ΣWi\n- Wi = Weight of metal i\n- Qi = (Ci/Si) × 100\n- Ci = Concentration\n- Si = WHO/EPA standard\n\n**HEI**: Σ(Ci/Si)\n\n**Cd**: Σ(Ci/Si)';
    }
    
    if (message.includes('limit') || message.includes('standard') || message.includes('who') || message.includes('epa')) {
        return '📋 **WHO/EPA Limits (mg/L)**:\n\n• Lead: 0.01\n• Mercury: 0.006\n• Cadmium: 0.003\n• Arsenic: 0.01\n• Chromium: 0.05\n• Copper: 2.0\n• Zinc: 3.0\n• Nickel: 0.07';
    }
    
    if (message.includes('export') || message.includes('download') || message.includes('report')) {
        return '💾 **Export Options**:\n\n• **CSV Export**: Download all data\n• **PDF Reports**: Generate professional reports\n• **Health Reports**: Disease risk assessments\n\nFind these in the **Analytics** and **Data Entry** tabs!';
    }
    
    if (message.includes('climate') || message.includes('weather') || message.includes('temperature')) {
        return '🌡️ **Climate Integration**:\n\n• Real-time weather data\n• Temperature impact on contamination\n• 7-day contamination forecasts\n• Rainfall correlation analysis\n\nCheck the **Climate & Energy** tab!';
    }
    
    if (message.includes('energy') || message.includes('carbon') || message.includes('sustainability')) {
        return '⚡ **Energy & Carbon Tracking**:\n\n• 99% energy reduction vs traditional labs\n• Real-time CO₂ savings counter\n• Treatment optimization\n• Milestone achievements\n\nSee **Climate & Energy** and **Carbon Impact** tabs!';
    }
    
    if (message.includes('help') || message.includes('how') || message.includes('guide')) {
        return '❓ **I can help with**:\n\n• 📊 Pollution calculations (HPI, HEI, Cd)\n• ⚕️ Health risk interpretation\n• 📤 Data upload & management\n• 🗺️ Map features\n• 📈 Analytics & reports\n• 🌡️ Climate integration\n• ⚡ Energy efficiency\n\n**What would you like to know more about?**';
    }
    
    if (message.includes('clear') || message.includes('delete') || message.includes('reset')) {
        return '🗑️ **Clear Form**: Resets input fields only (doesn\'t delete saved data)\n\n**Delete Data**: Currently not available from UI. Contact admin to clear database records.';
    }
    
    if (message.includes('ai') || message.includes('ml') || message.includes('predict')) {
        return '🤖 **AI Features**:\n\n• Disease risk prediction (8 diseases)\n• ML-based health assessments\n• Climate-contamination correlation\n• Predictive analytics\n\nUse the **Disease Prediction** tab for AI analysis!';
    }
    
    // Default response
    return '👋 I\'m your **PURE-Intelligence Assistant**! I can help with:\n\n• Water quality analysis\n• Health risk assessment\n• Data management\n• Climate & energy tracking\n\n**Ask me anything specific!** For example:\n- "What is HPI?"\n- "How do I upload data?"\n- "What are the health risks?"';
}
