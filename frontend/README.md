# 🌊 Ocean Chat Frontend

Welcome to the **Ocean Chat** frontend! This is a beautiful, ocean-themed chat interface for your AI Developer Assistant. 

## ✨ Features

- **🌊 Ocean Background**: Animated waves and floating bubbles for a serene experience
- **💬 Real-time Chat**: Stream responses from OpenAI models as they're generated
- **🎨 Modern UI**: Glassmorphism design with smooth animations and transitions
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **🔐 Secure**: API keys are stored locally and never sent to our servers
- **⚡ Fast**: Optimized for performance with streaming responses
- **⌨️ Keyboard Shortcuts**: Quick actions for power users

## 🚀 Quick Start

### Option 1: Open Directly in Browser
1. Simply open `index.html` in your web browser
2. Enter your OpenAI API key
3. Start chatting! 🎉

### Option 2: Local Development Server
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start a local server:**
   
   **Using Python 3:**
   ```bash
   python -m http.server 3000
   ```
   
   **Using Node.js:**
   ```bash
   npx serve -p 3000
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:3000
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Backend API
Make sure your FastAPI backend is running on `http://localhost:8000` (or update the API endpoint in `script.js` if different).

### OpenAI API Key
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Enter it in the "OpenAI API Key" field
3. Your key is automatically saved locally for convenience

## 🎯 How to Use

1. **Enter Your API Key**: Paste your OpenAI API key in the password field
2. **Choose a Model**: Select from GPT-4.1 Mini, GPT-4, or GPT-3.5 Turbo
3. **Developer Message (Optional)**: Add instructions to guide the AI's behavior
4. **Type Your Message**: Ask questions, get coding help, or chat about any topic
5. **Send**: Click the send button or press Enter

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message (when Shift+Enter for new line)
- **Ctrl/Cmd + Enter**: Force send message
- **Escape**: Clear user input field

## 🎨 Customization

### Colors and Theme
The ocean theme uses a beautiful blue gradient with animated waves. You can customize:
- **Primary Colors**: Update CSS variables in `styles.css`
- **Wave Animation**: Modify the wave timing and opacity
- **Bubble Effects**: Adjust the number and size of floating bubbles

### Styling
All styles are in `styles.css` with clear comments for easy modification:
- Ocean background gradients
- Glassmorphism effects
- Animation timings
- Responsive breakpoints

## 🐛 Troubleshooting

### Common Issues

**"API Key Required" Error:**
- Make sure you've entered your OpenAI API key
- Check that the key is valid and has sufficient credits

**"Network Error" or "Failed to Fetch":**
- Ensure your FastAPI backend is running
- Check that the API endpoint is accessible
- Verify CORS settings in your backend

**Messages Not Appearing:**
- Check the browser console for JavaScript errors
- Ensure all files (`index.html`, `styles.css`, `script.js`) are in the same directory

### Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (not supported)

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- **Vercel**: Drag and drop the `frontend` folder
- **Netlify**: Connect your repository or upload files
- **GitHub Pages**: Push to a repository and enable Pages
- **AWS S3**: Upload files to an S3 bucket with static website hosting

### Production Considerations
- Update API endpoint URLs for production
- Consider adding environment variables for configuration
- Implement proper error handling and logging
- Add analytics and monitoring if needed

## 🎉 Have Fun!

The Ocean Chat frontend is designed to be both beautiful and functional. Enjoy the calming ocean waves while chatting with AI! 🌊🤖

---

**Built with ❤️ using HTML, CSS, and JavaScript**