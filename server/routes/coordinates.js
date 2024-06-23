const express = require('express');
const router = express.Router();
const Coordinate = require('../models/coordinate');

router.post('/', async (req, res) => {
  try {
    const { x, y, z } = req.body;
    const newCoordinate = new Coordinate({ x, y, z });
    await newCoordinate.save();
    res.status(201).json(newCoordinate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save coordinates' });
  }
});

module.exports = router;
