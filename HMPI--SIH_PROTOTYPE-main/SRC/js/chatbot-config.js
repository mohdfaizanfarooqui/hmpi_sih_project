// Chatbot Configuration
// To enable AI-powered responses, get a free API key from Google AI Studio:
// https://makersuite.google.com/app/apikey

const CHATBOT_CONFIG = {
    // Set your Gemini API key here (free tier available)
    GEMINI_API_KEY: '', // Leave empty to use fallback responses
    
    // API endpoint
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Enable/disable AI features
    AI_ENABLED: true,
    
    // Generation settings
    GENERATION_CONFIG: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500
    }
};

// Export for use in chatbot.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_CONFIG;
}
