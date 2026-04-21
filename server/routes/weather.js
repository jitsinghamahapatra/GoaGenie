const express = require('express');
const axios = require('axios');
const router = express.Router();

// Goa coordinates: Panaji
const GOA_LOCATION_ID = '2295420'; // Foreca location ID for Panaji, Goa

router.get('/', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://foreca-weather.p.rapidapi.com/current/${GOA_LOCATION_ID}`,
      params: { alt: '0', tempunit: 'C', windunit: 'kmh', tz: 'Asia/Kolkata', lang: 'en' },
      headers: {
        'x-rapidapi-host': 'foreca-weather.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    };

    const response = await axios.request(options);
    const weather = response.data.current;

    // Normalize the data
    const weatherData = {
      location: 'Goa, India',
      temperature: weather.temperature,
      feelsLike: weather.feelsLikeTemp,
      symbol: weather.symbol,
      symbolPhrase: weather.symbolPhrase,
      windSpeed: weather.windSpeed,
      windDir: weather.windDirString,
      humidity: weather.relHumidity,
      visibility: weather.visibility,
      updated: weather.time,
      advice: getTravelAdvice(weather)
    };

    res.json({ success: true, weather: weatherData });
  } catch (err) {
    console.error('Weather API error:', err.message);
    // Return fallback data so app still works
    res.json({
      success: true,
      weather: {
        location: 'Goa, India',
        temperature: 32,
        feelsLike: 35,
        symbol: 'd000',
        symbolPhrase: 'Clear sky',
        windSpeed: 15,
        windDir: 'SW',
        humidity: 70,
        visibility: 10,
        updated: new Date().toISOString(),
        advice: 'Great beach weather! Don\'t forget sunscreen.',
        isFallback: true
      }
    });
  }
});

function getTravelAdvice(weather) {
  const temp = weather.temperature;
  const phrase = (weather.symbolPhrase || '').toLowerCase();

  if (phrase.includes('rain') || phrase.includes('storm')) {
    return '🌧️ Rain expected — pack a light raincoat. Perfect for fort visits and indoor shacks!';
  } else if (temp > 35) {
    return '☀️ Very hot today — visit beaches early morning or evening. Stay hydrated!';
  } else if (temp >= 28 && temp <= 35) {
    return '🌴 Ideal Goa weather! Perfect for beaches, water sports, and sightseeing.';
  } else if (temp < 25) {
    return '🌬️ Cool and pleasant — great for heritage walks and outdoor activities.';
  }
  return '🌅 Good weather for exploring Goa! Enjoy the beaches and culture.';
}

module.exports = router;
