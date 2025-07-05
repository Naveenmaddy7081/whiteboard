import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [roomId, setRoomId] = useState(null);

  return (
    <div className="container mt-4">
      {roomId ? (
        <Whiteboard roomId={roomId} />
      ) : (
        <RoomJoin onJoin={setRoomId} />
      )}
    </div>
  );
}

export default App;