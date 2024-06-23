const { required } = require('joi');
const mongoose = require('mongoose');

const CoordinateSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model('Coordinate', CoordinateSchema);
