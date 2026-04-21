const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOA_LAT = 15.4909;
const GOA_LON = 73.8278;

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API Key missing');
    }

    // Get 5-day forecast (3-hour intervals)
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        lat: GOA_LAT,
        lon: GOA_LON,
        appid: apiKey,
        units: 'metric'
      }
    });

    const list = response.data.list;
    
    // Group by day and pick one entry per day (e.g., mid-day)
    const dailyData = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = item;
      } else {
        // If we have a slot closer to 12:00, pick that
        const currentHour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
        if (Math.abs(currentHour - 12) < Math.abs(parseInt(dailyData[date].dt_txt.split(' ')[1].split(':')[0]) - 12)) {
          dailyData[date] = item;
        }
      }
    });

    const forecast = Object.values(dailyData).map(day => ({
      date: day.dt_txt.split(' ')[0],
      temp: Math.round(day.main.temp),
      condition: day.weather[0].main,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      humidity: day.main.humidity,
      windSpeed: day.wind.speed,
      // Bad weather flag for warnings
      isBad: ['Rain', 'Thunderstorm', 'Snow', 'Extreme'].includes(day.weather[0].main)
    }));

    res.json({
      success: true,
      city: 'Goa',
      current: forecast[0],
      forecast: forecast.slice(0, 5) // Return up to 5 days
    });

  } catch (error) {
    console.error('Weather Proxy Error:', error.message);
    
    // Fallback data for demo
    res.json({
      success: false,
      city: 'Goa (Demo)',
      current: { temp: 32, condition: 'Clear', description: 'clear sky', icon: '01d', isBad: false },
      forecast: [
        { date: '2026-04-21', temp: 32, condition: 'Clear', isBad: false },
        { date: '2026-04-22', temp: 31, condition: 'Clouds', isBad: false },
        { date: '2026-04-23', temp: 29, condition: 'Rain', isBad: true },
      ],
      error: error.message
    });
  }
});

module.exports = router;
