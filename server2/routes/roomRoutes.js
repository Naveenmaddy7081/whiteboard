const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); // ✅ Corrected path

// POST /api/rooms/join
router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  try {
    let room = await Room.findOne({ roomId });
    if (!room) {
      room = new Room({ roomId });
      await room.save();
    }
    res.status(200).json({ message: 'Joined room', roomId: room.roomId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
