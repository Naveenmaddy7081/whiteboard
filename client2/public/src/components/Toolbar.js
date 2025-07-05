import React from 'react';

const Toolbar = ({ color, setColor, width, setWidth, clearCanvas, setTool, tool, onUndo }) => {
  return (
    <div className="d-flex align-items-center gap-3 p-3 bg-light border rounded flex-wrap">
      <label>Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="form-control form-control-color"
      />

      <label className="ms-3">Width:</label>
      <input
        type="range"
        min="1"
        max="10"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
      />

      <button
        className={`btn btn-outline-dark ms-3 ${tool === 'pen' ? 'active' : ''}`}
        onClick={() => setTool('pen')}
      >Pen</button>
      <button
        className={`btn btn-outline-secondary ${tool === 'eraser' ? 'active' : ''}`}
        onClick={() => setTool('eraser')}
      >Eraser</button>

      <button onClick={clearCanvas} className="btn btn-warning ms-3">Clear</button>
      <button onClick={onUndo} className="btn btn-danger">Undo</button>
    </div>
  );
};

export default Toolbar;
