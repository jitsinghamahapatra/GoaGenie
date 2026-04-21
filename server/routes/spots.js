const express = require('express');
const router = express.Router();

const spots = [
  // ─── BEACHES ────────────────────────────────────────────────────
  {
    id: 1, name: 'Baga Beach', category: 'beach', area: 'North Goa',
    description: 'The most vibrant beach in Goa — perfect for water sports, beach shacks, and nightlife. Known for parasailing, banana boat rides, and the famous Saturday Night Market nearby.',
    rating: 4.5, entryFee: 'Free', bestTime: 'October–March',
    highlights: ['Water sports', 'Shack dining', 'Nightlife', 'Flea market'],
    coordinates: { lat: 15.5552, lng: 73.7516 },
    image: 'baga', tags: ['popular', 'nightlife', 'water-sports']
  },
  {
    id: 2, name: 'Palolem Beach', category: 'beach', area: 'South Goa',
    description: 'A crescent-shaped paradise with calm waters and a laid-back vibe. Great for kayaking, dolphin spotting, and silent disco nights. One of Goa\'s most beautiful beaches.',
    rating: 4.8, entryFee: 'Free', bestTime: 'November–February',
    highlights: ['Dolphin trips', 'Kayaking', 'Silent disco', 'Crescent shape'],
    coordinates: { lat: 15.0100, lng: 74.0230 },
    image: 'palolem', tags: ['peaceful', 'scenic', 'dolphin-spotting']
  },
  {
    id: 3, name: 'Anjuna Beach', category: 'beach', area: 'North Goa',
    description: 'Famous for its rocky cliffs and psychedelic trance culture. Host of the legendary Wednesday Flea Market. A bohemian paradise with cliff-top bars and epic sunsets.',
    rating: 4.4, entryFee: 'Free', bestTime: 'November–March',
    highlights: ['Flea market', 'Cliff views', 'Trance parties', 'Sunset'],
    coordinates: { lat: 15.5740, lng: 73.7403 },
    image: 'anjuna', tags: ['bohemian', 'flea-market', 'sunset']
  },
  {
    id: 4, name: 'Vagator Beach', category: 'beach', area: 'North Goa',
    description: 'Two crescent beaches flanked by red laterite cliffs. Home to the famous Chapora Fort and the iconic Hilltop club. Stunning sunsets and a chilled vibe.',
    rating: 4.6, entryFee: 'Free', bestTime: 'October–March',
    highlights: ['Red cliffs', 'Chapora Fort view', 'Music scene', 'Quiet coves'],
    coordinates: { lat: 15.5986, lng: 73.7370 },
    image: 'vagator', tags: ['scenic', 'cliffs', 'chill']
  },
  {
    id: 5, name: 'Morjim Beach', category: 'beach', area: 'North Goa',
    description: 'Pristine and less crowded, famous for olive ridley turtle nesting. A haven for bird-watchers and those seeking solitude. Beautiful backwater estuary nearby.',
    rating: 4.3, entryFee: 'Free', bestTime: 'November–February',
    highlights: ['Turtle nesting', 'Birdwatching', 'Backwaters', 'Uncrowded'],
    coordinates: { lat: 15.6358, lng: 73.7273 },
    image: 'morjim', tags: ['nature', 'turtles', 'peaceful']
  },

  // ─── FORTS ──────────────────────────────────────────────────────
  {
    id: 6, name: 'Aguada Fort', category: 'fort', area: 'North Goa',
    description: 'A 17th-century Portuguese fort at the confluence of the Mandovi River and the Arabian Sea. Features a four-story lighthouse — one of the oldest in Asia. Iconic photo spot.',
    rating: 4.5, entryFee: '₹25 (Indians), ₹300 (Foreign)', bestTime: 'October–March',
    highlights: ['Lighthouse', 'Sea views', 'Portuguese history', 'Sunset point'],
    coordinates: { lat: 15.4921, lng: 73.7757 },
    image: 'aguada', tags: ['heritage', 'photography', 'sunset']
  },
  {
    id: 7, name: 'Chapora Fort', category: 'fort', area: 'North Goa',
    description: 'Made famous by Bollywood\'s Dil Chahta Hai. Perched on a cliff overlooking Vagator Beach, this ruined fort offers panoramic views of the coastline and the Chapora River.',
    rating: 4.6, entryFee: 'Free', bestTime: 'October–April',
    highlights: ['Bollywood fame', 'Panoramic views', 'Sunset', 'River mouth'],
    coordinates: { lat: 15.6050, lng: 73.7367 },
    image: 'chapora', tags: ['views', 'bollywood', 'free']
  },
  {
    id: 8, name: 'Reis Magos Fort', category: 'fort', area: 'North Goa',
    description: 'One of the oldest Portuguese forts in Goa, overlooking the Mandovi River. Recently restored with a cultural centre inside. Fascinating history and great river views.',
    rating: 4.2, entryFee: '₹100', bestTime: 'October–March',
    highlights: ['Cultural centre', 'River views', 'Old architecture', 'Museum'],
    coordinates: { lat: 15.5096, lng: 73.8196 },
    image: 'reismagos', tags: ['heritage', 'museum', 'restored']
  },

  // ─── NIGHTLIFE ───────────────────────────────────────────────────
  {
    id: 9, name: 'Tito\'s Lane, Baga', category: 'nightlife', area: 'North Goa',
    description: 'Goa\'s most iconic nightlife strip. Tito\'s Club is a legendary venue with multiple dance floors, international DJs, and the classic Goa party experience. Party till sunrise!',
    rating: 4.3, entryFee: '₹500–₹1500', bestTime: 'November–February',
    highlights: ['Multiple clubs', 'International DJs', 'Rooftop bars', 'Live music'],
    coordinates: { lat: 15.5548, lng: 73.7519 },
    image: 'titos', tags: ['party', 'clubbing', 'dj']
  },
  {
    id: 10, name: 'Curlies Beach Shack, Anjuna', category: 'nightlife', area: 'North Goa',
    description: 'Legendary beach club on Anjuna Beach. The birthplace of Goa\'s psychedelic trance scene. Fire dancers, full moon parties, and legendary DJs. A Goa rite of passage.',
    rating: 4.4, entryFee: 'Free entry (drinks)', bestTime: 'October–March',
    highlights: ['Trance music', 'Fire shows', 'Full moon parties', 'Beach setting'],
    coordinates: { lat: 15.5715, lng: 73.7378 },
    image: 'curlies', tags: ['trance', 'beach-club', 'iconic']
  },
  {
    id: 11, name: 'LPK Waterfront, Nerul', category: 'nightlife', area: 'North Goa',
    description: 'Love Passion Karma — a stunning open-air club carved into a cliff face, overlooking the Nerul River. One of the most uniquely beautiful clubs in the world.',
    rating: 4.5, entryFee: '₹1000–₹2000', bestTime: 'November–February',
    highlights: ['Cliff architecture', 'Waterfront views', 'Premium DJs', 'Open air'],
    coordinates: { lat: 15.5179, lng: 73.7649 },
    image: 'lpk', tags: ['premium', 'open-air', 'unique']
  },

  // ─── NATURE ─────────────────────────────────────────────────────
  {
    id: 12, name: 'Dudhsagar Falls', category: 'nature', area: 'East Goa',
    description: 'One of India\'s tallest waterfalls (310m), located on the Goa-Karnataka border. The name means "Sea of Milk" — a spectacular cascade through dense forest. Best visited by jeep safari.',
    rating: 4.9, entryFee: '₹400 (jeep + entry)', bestTime: 'June–February',
    highlights: ['Tallest in India', 'Jeep safari', 'Swimming pool', 'Train track'],
    coordinates: { lat: 15.3133, lng: 74.3148 },
    image: 'dudhsagar', tags: ['waterfall', 'nature', 'adventure']
  },
  {
    id: 13, name: 'Bhagwan Mahavir Wildlife Sanctuary', category: 'nature', area: 'East Goa',
    description: 'Goa\'s largest wildlife sanctuary covering 240 sq km. Home to leopards, deer, monkeys, and hundreds of bird species. Includes the famous Dudhsagar Falls within its borders.',
    rating: 4.3, entryFee: '₹30', bestTime: 'October–May',
    highlights: ['Wildlife spotting', 'Trekking', 'Bird watching', 'Forest trails'],
    coordinates: { lat: 15.3500, lng: 74.3200 },
    image: 'sanctuary', tags: ['wildlife', 'trekking', 'birds']
  },
  {
    id: 14, name: 'Salim Ali Bird Sanctuary, Chorao', category: 'nature', area: 'Chorao Island',
    description: 'A mangrove sanctuary on Chorao Island accessible only by ferry. Named after famous ornithologist Salim Ali. Spot kingfishers, herons, and exotic migratory birds.',
    rating: 4.2, entryFee: '₹10', bestTime: 'October–March',
    highlights: ['Mangrove forest', 'Boat ride', 'Bird watching', 'Island adventure'],
    coordinates: { lat: 15.5010, lng: 73.8700 },
    image: 'salimali', tags: ['birds', 'mangroves', 'ferry']
  },

  // ─── CULTURE ────────────────────────────────────────────────────
  {
    id: 15, name: 'Basilica of Bom Jesus', category: 'culture', area: 'Old Goa',
    description: 'A UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier. Built in 1594, this Baroque masterpiece is one of the best examples of Portuguese colonial architecture.',
    rating: 4.8, entryFee: 'Free', bestTime: 'October–March',
    highlights: ['UNESCO site', 'St. Francis Xavier tomb', 'Baroque architecture', 'Museum'],
    coordinates: { lat: 15.5009, lng: 73.9119 },
    image: 'bomjesus', tags: ['UNESCO', 'heritage', 'church']
  },
  {
    id: 16, name: 'Fontainhas (Latin Quarter)', category: 'culture', area: 'Panaji',
    description: 'Goa\'s charming heritage district with narrow lanes, Portuguese-era houses in ochre and indigo, art galleries, and Portuguese-influenced Goan cuisine. A photographer\'s paradise.',
    rating: 4.7, entryFee: 'Free', bestTime: 'October–March',
    highlights: ['Colorful houses', 'Art galleries', 'Goan-Portuguese food', 'Street art'],
    coordinates: { lat: 15.4981, lng: 73.8318 },
    image: 'fontainhas', tags: ['heritage', 'photography', 'art']
  },

  // ─── FOOD ────────────────────────────────────────────────────────
  {
    id: 17, name: 'Fisherman\'s Wharf, Cavelossim', category: 'food', area: 'South Goa',
    description: 'Award-winning riverside restaurant famous for authentic Goan seafood. Known for crab xec-xec, prawn curry rice, and fresh fish thali. Gorgeous views of the Sal River.',
    rating: 4.6, entryFee: 'Menu prices', bestTime: 'Lunch/Dinner',
    highlights: ['Crab xec-xec', 'Prawn curry', 'River views', 'Live music'],
    coordinates: { lat: 15.1750, lng: 73.9400 },
    image: 'fishermans', tags: ['seafood', 'authentic', 'fine-dining']
  },
  {
    id: 18, name: 'Café Bhonsle, Panaji', category: 'food', area: 'Panaji',
    description: 'Legendary Goan breakfast institution since 1970s. Famous for poee bread with butter, ros omelette, and the authentic Goan breakfast experience that locals swear by.',
    rating: 4.5, entryFee: 'Menu prices', bestTime: 'Breakfast',
    highlights: ['Poee bread', 'Ros omelette', 'Local vibe', 'Budget-friendly'],
    coordinates: { lat: 15.4989, lng: 73.8278 },
    image: 'bhonsle', tags: ['breakfast', 'local', 'budget']
  }
];

// GET /api/spots — all spots
router.get('/', (req, res) => {
  const { category, area, name } = req.query;
  let filtered = spots;

  if (category) filtered = filtered.filter(s => s.category === category);
  if (area) filtered = filtered.filter(s => s.area.toLowerCase().includes(area.toLowerCase()));
  if (name) {
    const search = name.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(search) || 
      search.includes(s.name.toLowerCase())
    );
  }

  res.json({ success: true, spots: filtered, total: filtered.length });
});

// GET /api/spots/categories — unique categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(spots.map(s => s.category))];
  res.json({ success: true, categories });
});

module.exports = router;
