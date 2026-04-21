# 🌴 GoaGenie — Your Smart Goa Travel Companion

GoaGenie is an AI-powered smart tourism web app that helps tourists plan their Goa trip efficiently — generating personalized itineraries, budget estimates, weather insights, and spot recommendations.

## ✨ Features

- 🤖 **AI Itinerary Generation** — Day-wise travel plans powered by Groq (Llama 3.3)
- 💰 **Budget Estimation** — Breakdown for accommodation, food, transport & activities
- ⛅ **Live Weather** — Real-time Goa weather via Foreca Weather API
- 📍 **Curated Spots** — Beaches, forts, nightlife, and nature gems
- 🚗 **Transport Tips** — Smart travel guidance and local routes

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express |
| AI | Groq API (llama-3.3-70b-versatile) |
| Weather | Foreca Weather (RapidAPI) |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/GoaGenie.git
   cd GoaGenie
   ```

2. **Server setup**
   ```bash
   cd server
   npm install
   cp .env.example .env   # Fill in your API keys
   npm run dev
   ```

3. **Client setup** (new terminal)
   ```bash
   cd client
   npm install
   cp .env.example .env   # Set VITE_API_URL
   npm run dev
   ```

4. Open `http://localhost:5173`

### Environment Variables

**`server/.env`**
```
GROQ_API_KEY=your_groq_api_key
RAPIDAPI_KEY=your_rapidapi_key
PORT=5000
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Never commit `.env` files.** They are excluded by `.gitignore`.

## 📁 Project Structure

```
GoaGenie/
├── client/          # React frontend (Vite)
├── server/          # Node.js + Express backend
├── .gitignore
└── README.md
```

## 🗺️ Future Scope

- Real-time crowd detection
- Hotel and transport booking integration
- Live traffic and route optimization
- Mobile app version

---

*Made with ❤️ for the beaches of Goa*
