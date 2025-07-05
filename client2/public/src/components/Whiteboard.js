import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const Whiteboard = ({ roomId }) => {
  const socket = useRef(null);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(2);
  const [userCount, setUserCount] = useState(1);
  const [cursors, setCursors] = useState({});
  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState('pen');
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    socket.current = io('http://localhost:5000');

    socket.current.on('connect', () => {
      socket.current.emit('join-room', { roomId });
      setReady(true);
    });

    socket.current.on('user-count', count => setUserCount(count));
    socket.current.on('cursor-move', ({ id, x, y }) => {
      setCursors(prev => ({ ...prev, [id]: { x, y } }));
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const updatedHistory = [...history];
    const last = updatedHistory.pop();
    setRedoStack([...redoStack, last]);
    setHistory(updatedHistory);
    socket.current.emit('clear-canvas', { roomId });
    updatedHistory.forEach(cmd => {
      socket.current.emit('draw-end', cmd.data);
    });
  };

  return (
    <div>
      <Toolbar
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
        clearCanvas={() => socket.current.emit('clear-canvas', { roomId })}
        setTool={setTool}
        tool={tool}
        onUndo={handleUndo}
      />
      <p className="text-muted text-center">Active Users: {userCount}</p>
      {ready && (
        <>
          <DrawingCanvas
            socket={socket.current}
            roomId={roomId}
            color={tool === 'eraser' ? '#ffffff' : color}
            width={width}
            onDrawEnd={(cmd) => setHistory(prev => [...prev, cmd])}
          />
          <UserCursors cursors={cursors} socketId={socket.current?.id} />
        </>
      )}
    </div>
  );
};

export default Whiteboard;
