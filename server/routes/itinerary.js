const express = require('express');
const Groq = require('groq-sdk');
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { days, budget, interests, groupType, accommodation } = req.body;

  if (!days || !budget || !interests) {
    return res.status(400).json({ error: 'Missing required fields: days, budget, interests' });
  }

  const interestList = Array.isArray(interests) ? interests.join(', ') : interests;
  const budgetPerDay = Math.round(budget / days);

  const systemPrompt = `You are GoaGenie, an expert Goa travel planner. You create detailed, practical, and exciting day-wise itineraries for Goa. Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

  const userPrompt = `Create a ${days}-day Goa trip itinerary for a ${groupType || 'couple'} with:
- Total budget: ₹${budget} (approx ₹${budgetPerDay}/day)
- Interests: ${interestList}
- Accommodation preference: ${accommodation || 'mid-range hotel'}

Return ONLY this JSON structure:
{
  "tripSummary": "One paragraph overview of the trip",
  "totalBudgetEstimate": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "total": number
  },
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "theme": "Beach & Relaxation",
      "activities": [
        {
          "time": "8:00 AM",
          "place": "Place name",
          "description": "What to do here",
          "duration": "2 hours",
          "estimatedCost": "₹200",
          "category": "beach|fort|food|nightlife|nature|culture|shopping"
        }
      ],
      "meals": {
        "breakfast": { "place": "name", "dish": "dish name", "cost": "₹100" },
        "lunch": { "place": "name", "dish": "dish name", "cost": "₹300" },
        "dinner": { "place": "name", "dish": "dish name", "cost": "₹500" }
      },
      "transport": "How to travel today — bike rental, taxi, bus",
      "dayBudget": number,
      "tip": "Local insider tip for the day"
    }
  ],
  "packingList": ["item1", "item2"],
  "transportTips": ["tip1", "tip2"],
  "bestTimeToVisit": "Season/month advice",
  "emergencyContacts": {
    "police": "100",
    "ambulance": "108",
    "touristHelpline": "1800-111-363"
  }
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const raw = completion.choices[0].message.content;
    const itinerary = JSON.parse(raw);

    res.json({ success: true, itinerary });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'Failed to generate itinerary', details: err.message });
  }
});

module.exports = router;
