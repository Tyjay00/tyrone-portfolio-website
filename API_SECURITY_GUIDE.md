# 🔒 API Key Security Guide

## ✅ Your API Key is Now Secured!

I've implemented a secure configuration system to protect your Gemini API key from being exposed in your public GitHub repository.

---

## 🛡️ What I've Done

### 1. Created Separate Config File
- **`assets/js/config.js`** - Contains your actual API key (✅ GITIGNORED)
- **`assets/js/config.example.js`** - Template file without sensitive data (safe to commit)

### 2. Updated .gitignore
Added rules to prevent committing sensitive files:
```
assets/js/config.js
config.js
*.env
.env
.env.local
.env.production
```

### 3. Modified Chatbot Code
Updated `chatbot.js` to load API key from the config file instead of hardcoding it.

### 4. Updated index.html
Added script tag to load config.js before chatbot.js.

---

## ⚠️ CRITICAL: Before You Commit to GitHub

### Step 1: Verify config.js is NOT tracked
```powershell
git status
```

You should see:
- ✅ `config.example.js` in untracked files (safe to commit)
- ❌ `config.js` should NOT appear (it's ignored)

### Step 2: If config.js appears in git status:
```powershell
# Remove it from git tracking
git rm --cached assets/js/config.js

# Verify it's gone
git status
```

### Step 3: Commit Safe Files Only
```powershell
git add .gitignore
git add assets/js/config.example.js
git add assets/js/chatbot.js
git add assets/css/main.css
git add index.html
git add CHATBOT_SETUP.md
git add PORTFOLIO_UPDATES.md

git commit -m "Add AI chatbot with secure API key configuration"
git push
```

---

## 🚨 IMPORTANT: Your API Key Status

**Your API key:** `AIzaSyA2xKdOFP-NK3IOndG-Dyc3USE1YyZ2Ixw`

### Immediate Actions Required:

#### 1. **Restrict API Key in Google Cloud Console**
🔗 Go to: https://console.cloud.google.com/apis/credentials

**Steps:**
1. Find your API key: `AIzaSyA2xKdOFP-NK3IOndG-Dyc3USE1YyZ2Ixw`
2. Click "Edit API key" (pencil icon)
3. Under **"Application restrictions"**:
   - Select: **"HTTP referrers (web sites)"**
   - Add these referrers:
     ```
     https://www.tyrone.studio/*
     https://tyrone.studio/*
     http://localhost/*
     http://127.0.0.1/*
     ```
4. Under **"API restrictions"**:
   - Select: **"Restrict key"**
   - Check only: **"Generative Language API"**
5. Click **"Save"**

#### 2. **Set Usage Quotas**
In Google Cloud Console:
1. Go to: APIs & Services → Quotas
2. Search for "Generative Language API"
3. Set limits:
   - **60 requests per minute** (default)
   - **1,500 requests per day** (recommended)

#### 3. **Enable Billing Alerts** (Optional but Recommended)
1. Go to: Billing → Budgets & alerts
2. Create a budget alert for $0 (free tier)
3. Get notified if usage exceeds free tier

---

## 🔍 Check If Your Key Was Already Exposed

### If you've already pushed to GitHub:

1. **Check your repository history:**
   ```powershell
   git log --all --full-history -- "*config.js"
   ```

2. **Search your commits for the API key:**
   ```powershell
   git log -p | Select-String "AIzaSy"
   ```

### If Your Key Was Exposed:

#### ⚠️ REGENERATE IT IMMEDIATELY!

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key
3. Click the 3 dots → **"Regenerate key"**
4. Copy the new key
5. Update `assets/js/config.js` with the new key
6. Restrict the new key (see steps above)

#### Clean Git History (Advanced):
If the key was committed, you need to remove it from history:

```powershell
# This is complex - consider just regenerating the key instead
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch assets/js/config.js" \
  --prune-empty --tag-name-filter cat -- --all
```

**Easier option:** Just regenerate the API key in Google Cloud Console.

---

## 📁 File Structure Explanation

```
tyrone-portfolio-website/
├── assets/js/
│   ├── config.js              ← 🔒 YOUR API KEY (NEVER COMMIT!)
│   ├── config.example.js      ← ✅ Template (safe to commit)
│   └── chatbot.js             ← ✅ Chatbot code (safe to commit)
├── .gitignore                 ← ✅ Protects sensitive files
└── API_SECURITY_GUIDE.md      ← 📖 This file
```

---

## 🔐 Additional Security Measures

### Option 1: Backend Proxy (Most Secure) 🌟 RECOMMENDED
Create a simple backend service to proxy API requests:

**Benefits:**
- ✅ API key never exposed to client
- ✅ Complete control over requests
- ✅ Can add rate limiting
- ✅ Can log usage

**Free Backend Options:**
- **Vercel Serverless Functions** (recommended)
- **Netlify Functions**
- **Cloudflare Workers**
- **AWS Lambda + API Gateway**

### Option 2: Environment Variables (Build Process)
If using a build tool like Vite or Webpack:

**In your build configuration:**
```javascript
// vite.config.js
export default {
  define: {
    'process.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
  }
}
```

**In .env file (also gitignored):**
```
VITE_GEMINI_API_KEY=AIzaSyA2xKdOFP-NK3IOndG-Dyc3USE1YyZ2Ixw
```

### Option 3: Current Setup (Acceptable for Portfolio)
Your current setup is acceptable for a portfolio site IF you:
- ✅ Restrict API key to your domain
- ✅ Set usage quotas
- ✅ Monitor usage regularly
- ✅ Never commit config.js to GitHub

---

## 🧪 Testing Your Security Setup

### 1. Test Locally
```powershell
# Open in browser
start index.html

# Or use Python server
python -m http.server 8000
# Then open: http://localhost:8000
```

### 2. Verify Chatbot Works
- Click the robot icon (bottom-right)
- Try asking: "Tell me about the AWS projects"
- Should get AI-powered responses

### 3. Verify Config is Gitignored
```powershell
git status
# config.js should NOT appear in the list
```

### 4. Check Repository on GitHub
After pushing, visit your GitHub repo and verify:
- ❌ `config.js` is NOT visible
- ✅ `config.example.js` IS visible
- ✅ `.gitignore` includes config.js

---

## 🔄 For Team Members or Future Setup

### If Someone Else Clones Your Repo:

**They need to:**
1. Copy the example config:
   ```powershell
   Copy-Item assets/js/config.example.js assets/js/config.js
   ```

2. Edit `assets/js/config.js` and add their own API key:
   ```javascript
   const GEMINI_CONFIG = {
     apiKey: 'THEIR_API_KEY_HERE'
   };
   ```

3. The file will be automatically ignored by git

---

## 📊 Monitoring Your API Usage

### Check Usage:
1. Go to: https://console.cloud.google.com/apis/dashboard
2. Select "Generative Language API"
3. View traffic, errors, and quota usage

### Set Up Alerts:
1. Click "Quotas" in the left sidebar
2. Click any quota limit
3. Click "Edit Quotas"
4. Set alert threshold (e.g., 80% of free tier)
5. Add your email

---

## ✅ Quick Security Checklist

Before deploying to production:

- [ ] `config.js` is in .gitignore
- [ ] API key is restricted to your domain in Google Cloud Console
- [ ] API key only allows "Generative Language API"
- [ ] Usage quotas are set (1,500/day recommended)
- [ ] Billing alerts are configured
- [ ] Tested chatbot functionality locally
- [ ] Verified config.js doesn't appear in `git status`
- [ ] Committed and pushed safe files only

---

## 🆘 Emergency: Key Was Exposed

### If you accidentally commit the API key:

1. **IMMEDIATELY regenerate the key** in Google Cloud Console
2. Update your local `config.js` with the new key
3. Restrict the new key to your domain
4. Consider these options:
   - **Option A (Easy):** Delete the repo and re-upload without history
   - **Option B (Advanced):** Use BFG Repo-Cleaner to remove sensitive data
   - **Option C (Simple):** Just regenerate the key - old one is useless

**The key point:** Once you regenerate, the old exposed key won't work anymore.

---

## 📞 Support Resources

- **Google Cloud Console:** https://console.cloud.google.com
- **Gemini API Docs:** https://ai.google.dev/docs
- **API Key Management:** https://console.cloud.google.com/apis/credentials
- **GitHub Security:** https://docs.github.com/en/code-security

---

## 🎯 Summary

✅ **What's Secure:**
- API key is in gitignored config.js
- Template file (config.example.js) is safe to commit
- Chatbot loads key from config dynamically

⚠️ **What You Must Do:**
1. Restrict API key in Google Cloud Console
2. Never commit config.js
3. Monitor API usage
4. Consider backend proxy for production

🚀 **You're Ready!**
Your API key is now protected and your chatbot is ready to use!

---

**Last Updated:** November 10, 2025
**Security Level:** ⭐⭐⭐⭐ (Good for portfolio sites)
**Recommended:** Implement backend proxy for production applications
