const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { text, sourceLang } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Text is required' });
  }

  let prompt = '';
  
  if (sourceLang === 'hi') {
    prompt = `Translate the following Hindi text into English and Konkani. Return ONLY a valid JSON object with the keys "english" and "konkani". Do not include any explanations or markdown formatting outside the JSON.\n\nText: "${text}"`;
  } else if (sourceLang === 'kok') {
    prompt = `Translate the following Konkani text into English and Hindi. Return ONLY a valid JSON object with the keys "english" and "hindi". Do not include any explanations or markdown formatting outside the JSON.\n\nText: "${text}"`;
  } else {
    // Default to English as source
    prompt = `Translate the following English text into Hindi and Konkani. Return ONLY a valid JSON object with the keys "hindi" and "konkani". Do not include any explanations or markdown formatting outside the JSON.\n\nText: "${text}"`;
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specializing in English, Hindi, and Konkani (Goan dialect). You only return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const resultStr = completion.choices[0].message.content;
    const translations = JSON.parse(resultStr);

    res.json({
      success: true,
      translations
    });

  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({
      success: false,
      message: "Translation failed. Please try again."
    });
  }
});

module.exports = router;
