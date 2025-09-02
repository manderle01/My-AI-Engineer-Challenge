// DOM elements
const chatMessages = document.getElementById('chatMessages');
const apiKeyInput = document.getElementById('apiKey');
const developerMessageInput = document.getElementById('developerMessage');
const userMessageInput = document.getElementById('userMessage');
const sendButton = document.getElementById('sendButton');
const modelSelector = document.getElementById('model');

// State
let isStreaming = false;

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Enable/disable send button based on input validation
    apiKeyInput.addEventListener('input', validateInputs);
    userMessageInput.addEventListener('input', validateInputs);
    
    // Handle send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Handle Enter key in user message input
    userMessageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendButton.disabled) {
                sendMessage();
            }
        }
    });
    
    // Load saved API key if available
    loadSavedApiKey();
    
    // Initial validation
    validateInputs();
});

// Validate inputs and enable/disable send button
function validateInputs() {
    const hasApiKey = apiKeyInput.value.trim().length > 0;
    const hasUserMessage = userMessageInput.value.trim().length > 0;
    
    sendButton.disabled = !hasApiKey || !hasUserMessage || isStreaming;
}

// Save API key to localStorage
function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('oceanChatApiKey', apiKey);
    }
}

// Load saved API key from localStorage
function loadSavedApiKey() {
    const savedApiKey = localStorage.getItem('oceanChatApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        validateInputs();
    }
}

// Send message to API
async function sendMessage() {
    const apiKey = apiKeyInput.value.trim();
    const developerMessage = developerMessageInput.value.trim();
    const userMessage = userMessageInput.value.trim();
    const model = modelSelector.value;
    
    if (!apiKey || !userMessage || isStreaming) {
        return;
    }
    
    // Save API key
    saveApiKey();
    
    // Add user message to chat
    addMessage('user', userMessage);
    
    // Clear user input
    userMessageInput.value = '';
    validateInputs();
    
    // Add AI message placeholder with loading animation
    const aiMessageElement = addMessage('ai', '', true);
    
    try {
        isStreaming = true;
        sendButton.disabled = true;
        
        // Prepare request payload
        const payload = {
            api_key: apiKey,
            user_message: userMessage,
            model: model
        };
        
        // Add developer message if provided
        if (developerMessage) {
            payload.developer_message = developerMessage;
        }
        
        // Make API request
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            aiResponse += chunk;
            
            // Update AI message content
            updateMessageContent(aiMessageElement, aiResponse);
        }
        
        // Remove loading animation
        removeLoadingAnimation(aiMessageElement);
        
    } catch (error) {
        console.error('Error:', error);
        
        // Show error message
        updateMessageContent(aiMessageElement, `Sorry, I encountered an error: ${error.message}`);
        removeLoadingAnimation(aiMessageElement);
        
        // Add error styling
        aiMessageElement.classList.add('error');
        
    } finally {
        isStreaming = false;
        validateInputs();
    }
}

// Add a new message to the chat
function addMessage(type, content, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const icon = type === 'user' ? 'fas fa-user' : 
                 type === 'ai' ? 'fas fa-robot' : 
                 'fas fa-info-circle';
    
    let messageContent;
    
    if (isLoading) {
        messageContent = `
            <div class="message-content">
                <i class="${icon}"></i>
                <div class="loading">
                    <span>AI is thinking</span>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
    } else {
        messageContent = `
            <div class="message-content">
                <i class="${icon}"></i>
                <p>${escapeHtml(content)}</p>
            </div>
        `;
    }
    
    messageDiv.innerHTML = messageContent;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Update message content (for streaming)
function updateMessageContent(messageElement, content) {
    const contentElement = messageElement.querySelector('p');
    if (contentElement) {
        contentElement.innerHTML = escapeHtml(content);
    }
}

// Remove loading animation from message
function removeLoadingAnimation(messageElement) {
    const loadingElement = messageElement.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add some fun ocean-themed features
function addOceanEffects() {
    // Add floating bubbles effect
    createFloatingBubbles();
    
    // Add gentle sway to chat container
    addGentleSway();
}

// Create floating bubbles
function createFloatingBubbles() {
    const oceanBackground = document.querySelector('.ocean-background');
    
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        bubble.style.cssText = `
            position: absolute;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            bottom: -20px;
            animation: float ${Math.random() * 10 + 15}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;
        
        oceanBackground.appendChild(bubble);
    }
}

// Add gentle sway animation to chat container
function addGentleSway() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.style.animation = 'gentleSway 8s ease-in-out infinite';
}

// Add CSS for floating bubbles and gentle sway
const additionalStyles = `
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes gentleSway {
        0%, 100% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(0.5deg);
        }
    }
    
    .floating-bubble {
        pointer-events: none;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize ocean effects after a short delay
setTimeout(addOceanEffects, 1000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!sendButton.disabled) {
            sendMessage();
        }
    }
    
    // Escape to clear user input
    if (e.key === 'Escape') {
        userMessageInput.value = '';
        validateInputs();
        userMessageInput.focus();
    }
});

// Add some helpful tooltips
function addTooltips() {
    const tooltips = [
        { element: apiKeyInput, text: 'Your OpenAI API key is stored locally and never sent to our servers' },
        { element: developerMessageInput, text: 'Optional instructions to guide the AI\'s behavior' },
        { element: modelSelector, text: 'Choose the AI model you want to use for this conversation' }
    ];
    
    tooltips.forEach(({ element, text }) => {
        element.title = text;
    });
}

// Initialize tooltips
addTooltips();
