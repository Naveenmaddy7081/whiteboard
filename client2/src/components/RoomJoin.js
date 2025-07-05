import React, { useState } from 'react';
import axios from 'axios';

const RoomJoin = ({ onJoin }) => {
  const [roomCode, setRoomCode] = useState('');

  const joinRoom = async () => {
    if (!roomCode.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/rooms/join', { roomId: roomCode });
      onJoin(roomCode);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="text-center mt-5">
      <h2 className="mb-4">Join or Create a Room</h2>
      <div className="input-group justify-content-center">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button onClick={joinRoom} className="btn btn-primary ms-2">
          Join
        </button>
      </div>
    </div>
  );
};

export default RoomJoin;