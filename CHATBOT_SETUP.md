# AI Chatbot Setup Instructions

## ✅ What's Been Added

Your portfolio now includes an intelligent AI chatbot powered by Google's Gemini API that helps visitors navigate your portfolio and learn about your cloud engineering expertise.

### Features:
- 🤖 AI-powered responses using Gemini API
- 📍 Smart portfolio navigation
- 💬 Context-aware about your projects and skills
- 📱 Fully responsive design
- ⚡ Quick suggestion chips
- 🎨 Beautiful, modern UI

## 🚀 How to Set Up the Gemini API

### Step 1: Get Your Free API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

### Step 2: Add Your API Key

1. Open `assets/js/chatbot.js` in your code editor
2. Find this line near the top (around line 11):
   ```javascript
   this.GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```
3. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```javascript
   this.GEMINI_API_KEY = 'AIzaSyD...your-actual-key...';
   ```
4. Save the file

### Step 3: Test Your Chatbot

1. Open `index.html` in your browser
2. Look for the floating robot icon (💬) in the bottom-right corner
3. Click it to open the chatbot
4. Try asking questions like:
   - "Tell me about the AWS projects"
   - "What are the certifications?"
   - "Show me the portfolio"
   - "How can I contact Tyrone?"

## 🎯 What the Chatbot Can Do

### Smart Navigation
The chatbot intelligently navigates visitors to different sections:
- **Home** - Portfolio introduction
- **About** - Your background and experience
- **Skills** - Technical expertise and certifications
- **Portfolio** - Project showcase
- **Contact** - Contact information

### Project Information
Ask about specific projects:
- Static Website on AWS
- Grafana on ECS Fargate
- Metabase BI Platform
- Serverless Image Processing
- Secure Windows EC2
- Multi-VPC Architecture

### Context-Aware Responses
The chatbot knows about:
- Your AWS certifications
- CloudSec Network training
- Technical skills and proficiency levels
- All 6 portfolio projects
- Contact information
- Professional background

## 🔒 API Key Security

**Important:** Your API key is embedded in the frontend JavaScript, which means it's visible to anyone who views the page source. For a public portfolio website, this is generally acceptable if you:

1. **Set usage limits** in Google Cloud Console
2. **Restrict the API key** to specific domains
3. **Monitor usage** regularly

### To Restrict Your API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your API key
3. Click "Edit API key"
4. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain: `https://www.tyrone.studio/*`
   - Add localhost for testing: `http://localhost/*`
5. Save changes

## 🎨 Customization Options

### Change Chatbot Colors
Edit `assets/css/main.css` and find the chatbot styles section. The primary colors are:
```css
background: linear-gradient(135deg, #065cc2 0%, #2973cc 100%);
```

### Modify Welcome Message
Edit `index.html` and find the initial bot message in the chatbot container.

### Add More Suggestions
In `index.html`, add more suggestion chips:
```html
<button class="suggestion-chip" data-message="Your question here">
  <i class="bi bi-icon-name"></i> Button Text
</button>
```

### Adjust Response Behavior
Edit `assets/js/chatbot.js`:
- Modify `portfolioContext` to change how the AI understands your portfolio
- Update `handleNavigation()` to add more navigation patterns
- Customize response templates in `getNavigationResponse()`

## 🐛 Troubleshooting

### Chatbot doesn't respond
- Check browser console for errors (F12)
- Verify API key is correctly set
- Ensure internet connection is active
- Check API quota hasn't been exceeded

### API Key Error
- Make sure you copied the complete key
- Remove any extra spaces
- Verify the key is enabled in Google Cloud Console

### Navigation not working
- The chatbot will still provide navigation help even without the API key
- Click on the blue action buttons in responses to navigate

## 📊 Free Tier Limits

Google's Gemini API free tier includes:
- **60 requests per minute**
- **1,500 requests per day**
- **1 million requests per month**

This is more than sufficient for a portfolio website!

## 🔄 Updates and Maintenance

### Monitor API Usage
Check your usage in [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)

### Update Context
As you add new projects or skills, update the `portfolioContext` in `chatbot.js` to keep the AI informed.

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review the troubleshooting section above
3. Verify your API key is valid and has proper permissions

## 🎉 You're All Set!

Your portfolio now has an intelligent AI assistant that will:
- Help visitors navigate your work
- Answer questions about your experience
- Provide detailed project information
- Guide people to contact you

**Enjoy your new AI-powered portfolio!** 🚀
