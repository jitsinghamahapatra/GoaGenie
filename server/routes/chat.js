const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are GoaGenie AI, a helpful and enthusiastic travel assistant for Goa, India. You know everything about Goa - from the best hidden beaches to the most happening parties. Keep your answers concise, tropical, and helpful. Use emojis! 🌴🌊☀️'
        },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({
      success: true,
      message: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Groq Chat Error:', error);
    res.status(500).json({
      success: false,
      message: "I'm feeling a bit beach-lagged right now. Please try again later! 🥥"
    });
  }
});

module.exports = router;
