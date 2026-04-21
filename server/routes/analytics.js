const express = require('express');
const router = express.Router();

// Mock analytics data
router.get('/visitors', (req, res) => {
  // In a real app, this would come from a DB or Firebase
  res.json({
    success: true,
    count: 1250,
    online: 42
  });
});

module.exports = router;
