// server/models/Room.js
const mongoose = require('mongoose');

const DrawingCommandSchema = new mongoose.Schema({
  type: String, // 'stroke' or 'clear'
  data: Object,
  timestamp: { type: Date, default: Date.now }
});

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  drawingData: [DrawingCommandSchema]
});

module.exports = mongoose.model('Room', RoomSchema);
