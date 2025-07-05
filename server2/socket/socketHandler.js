const Room = require('../models/Room'); // ✅ Corrected path

const usersInRoom = {};

module.exports = (io, socket) => {
  socket.on('join-room', async ({ roomId }) => {
    socket.join(roomId);
    usersInRoom[roomId] = usersInRoom[roomId] || new Set();
    usersInRoom[roomId].add(socket.id);

    const userCount = usersInRoom[roomId].size;
    io.to(roomId).emit('user-count', userCount);

    const room = await Room.findOne({ roomId });
    if (room) {
      socket.emit('load-canvas', room.drawingData);
    }
  });

  socket.on('cursor-move', ({ roomId, x, y }) => {
    socket.to(roomId).emit('cursor-move', { id: socket.id, x, y });
  });

  socket.on('draw-start', (data) => {
    socket.to(data.roomId).emit('draw-start', data);
  });

  socket.on('draw-move', (data) => {
    socket.to(data.roomId).emit('draw-move', data);
  });

  socket.on('draw-end', async (data) => {
    socket.to(data.roomId).emit('draw-end', data);

    const room = await Room.findOne({ roomId: data.roomId });
    if (room) {
      room.drawingData.push({
        type: 'stroke',
        data,
      });
      room.lastActivity = new Date();
      await room.save();
    }
  });

  socket.on('clear-canvas', async ({ roomId }) => {
    io.to(roomId).emit('clear-canvas');
    const room = await Room.findOne({ roomId });
    if (room) {
      room.drawingData.push({ type: 'clear' });
      await room.save();
    }
  });

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach(roomId => {
      if (usersInRoom[roomId]) {
        usersInRoom[roomId].delete(socket.id);
        io.to(roomId).emit('user-count', usersInRoom[roomId].size);
      }
    });
  });
};
