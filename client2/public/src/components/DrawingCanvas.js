import React, { useEffect, useRef } from 'react';

const DrawingCanvas = ({ socket, roomId, color, width, onDrawEnd }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const path = useRef({ x: [], y: [], color: '', width: 1 });
  const contextRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    contextRef.current = ctx;

    const handleDrawStart = ({ x, y, color, width }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleDrawMove = ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handleClear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleLoadCanvas = (data) => {
      data.forEach(cmd => {
        if (cmd.type === 'stroke') {
          const { x, y, color, width } = cmd.data;
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(x[0], y[0]);
          for (let i = 1; i < x.length; i++) {
            ctx.lineTo(x[i], y[i]);
          }
          ctx.stroke();
        } else if (cmd.type === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    };

    socket.on('draw-start', handleDrawStart);
    socket.on('draw-move', handleDrawMove);
    socket.on('clear-canvas', handleClear);
    socket.on('load-canvas', handleLoadCanvas);

    return () => {
      socket.off('draw-start', handleDrawStart);
      socket.off('draw-move', handleDrawMove);
      socket.off('clear-canvas', handleClear);
      socket.off('load-canvas', handleLoadCanvas);
    };
  }, [socket]);

  const handleMouseDown = (e) => {
    if (!contextRef.current || !socket) return;
    isDrawing.current = true;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    path.current = { x: [x], y: [y], color, width };
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = width;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    socket.emit('draw-start', { roomId, x, y, color, width });
  };

  const handleMouseMove = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    if (isDrawing.current) {
      path.current.x.push(x);
      path.current.y.push(y);
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
      socket.emit('draw-move', { roomId, x, y });
    }
    socket.emit('cursor-move', { roomId, x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current || !socket) return;
    isDrawing.current = false;
    const drawCommand = {
      type: 'stroke',
      data: { ...path.current }
    };
    socket.emit('draw-end', drawCommand.data);
    if (onDrawEnd) onDrawEnd(drawCommand);
  };

  return (
    <canvas
      ref={canvasRef}
      className="border border-secondary d-block mx-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default DrawingCanvas;
