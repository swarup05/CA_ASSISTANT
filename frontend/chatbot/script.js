// Replace with your Google Gemini API key
const GEMINI_API_KEY = 'AIzaSyB53BxrxG2rpLSpqgCE_xZY_vaiil7m4hE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Add event listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    try {
        // Show loading indicator
        const loadingMessage = addMessage('Thinking...', 'bot');
        
        // Get response from Gemini with timeout
        const response = await Promise.race([
            getBotResponse(message),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), 10000)
            )
        ]);
        
        // Remove loading message and add actual response
        loadingMessage.remove();
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error details:', error);
        if (error.message === 'Request timed out') {
            addMessage('The response is taking too long. Please try again with a more specific question.', 'bot');
        } else {
            addMessage(`Error: ${error.message}. Please check your API key and try again.`, 'bot');
        }
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

async function getBotResponse(userMessage) {
    try {
        console.log('Sending request to Gemini API...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a professional Chartered Accountant (CA) assistant. Your role is strictly limited to providing financial, accounting, and tax-related advice. If asked about any other topics, politely decline and explain that you can only assist with financial matters. For the following question, provide a concise financial answer or politely decline if it's not related to finance: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 200,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Unexpected API Response:', data);
            throw new Error('Invalid response format from API');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
} 
