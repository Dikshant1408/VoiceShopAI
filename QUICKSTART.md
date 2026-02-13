# Quick Start Guide - VoiceShop AI Pro

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create a `.env.local` file in the project root:
```env
API_KEY=your_gemini_api_key_here
```

### Step 4: Start the App
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 5: Grant Permissions
When prompted, allow:
- ✅ Microphone access (for voice commands)
- ✅ Camera access (for scanning)

## 🎤 Try These Voice Commands

### Adding Items
- "Add milk"
- "I need 3 apples"
- "Put bread on my list"
- "Add 2 bottles of water"

### Removing Items
- "Remove milk"
- "Delete apples"
- "Take bread off my list"

### Searching
- "Find organic apples"
- "Show me toothpaste under $5"
- "Search for Colgate products"

### Managing List
- "Clear my list"
- "Empty the basket"

## 📸 Using Camera Scanner

1. Click the camera icon (top-right)
2. Point at a product, receipt, or pantry shelf
3. Tap the white capture button
4. AI automatically identifies and adds items

## 🌍 Changing Language

1. Click the language selector (top-right)
2. Choose from 11+ languages
3. Voice recognition adapts automatically

## 🍳 Recipe Scout

1. Add several items to your list
2. Click the "Recipe Scout" button
3. AI suggests a meal you can make
4. Tap to add missing ingredients

## 🔍 Voice Search

1. Tap the voice orb
2. Say "Find [product] under $[price]"
3. Browse results in the modal
4. Tap "Add to List" on any product

## 🎯 Tips for Best Results

### Voice Commands
- Speak clearly in a quiet environment
- Use natural language (no need for rigid commands)
- Wait for the orb to pulse before speaking
- You can interrupt the AI anytime

### Camera Scanning
- Ensure good lighting
- Hold camera steady
- Center items in the frame
- Works best with clear product labels

### Language Support
- Select your preferred language first
- Speak in that language for best accuracy
- AI responses adapt to your language

## 🐛 Troubleshooting

### Voice Not Working
- Check microphone permissions in browser settings
- Ensure you're using HTTPS (required for mic access)
- Try Chrome or Edge for best compatibility

### Camera Not Working
- Grant camera permissions when prompted
- Check if another app is using the camera
- Reload the page and try again

### API Errors
- Verify your API key is correct in `.env.local`
- Check your Gemini API quota at [Google AI Studio](https://aistudio.google.com)
- Ensure you're connected to the internet

### Items Not Adding
- Speak clearly and wait for confirmation
- Check the toast notification for errors
- Try rephrasing your command

## 📱 Mobile Usage

### iOS Safari
- Requires iOS 14.5+ for voice recognition
- Tap the voice orb to start listening
- Grant permissions when prompted

### Android Chrome
- Full support for all features
- Best performance on Android 10+
- Enable microphone in site settings

## 🚀 Deploy Your Own

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
**Add Environment Variable:**
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Key: `API_KEY`, Value: your Gemini API key
4. Select all environments (Production, Preview, Development)
5. Save and redeploy from Deployments tab

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```
**Add Environment Variable:**
1. Go to Netlify dashboard → Site settings → Environment variables
2. Add: Key = `API_KEY`, Value = your Gemini API key
3. Trigger redeploy

### Firebase
```bash
npm install -g firebase-tools
npm run build
firebase deploy
```
**Add Environment Variable:**
Configure `API_KEY` in Firebase Console → Project Settings

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed features
- Check [TECHNICAL_WRITEUP.md](./TECHNICAL_WRITEUP.md) for architecture details
- Explore the code in `components/` and `services/`
- Customize categories in `constants.ts`
- Add your own product catalog

## 💡 Pro Tips

1. **Batch Commands**: "Add milk, bread, and eggs" works!
2. **Natural Speech**: "I'm running low on coffee" is understood
3. **Price Awareness**: "Find the cheapest toothpaste" uses smart search
4. **Recipe Ideas**: Keep adding items and check Recipe Scout periodically
5. **Health Tracking**: Watch your Vitality Score improve with more produce

## 🤝 Need Help?

- Check browser console for detailed error messages
- Verify all permissions are granted
- Ensure API key has sufficient quota
- Try in an incognito window to rule out extensions

Happy shopping! 🛒✨
