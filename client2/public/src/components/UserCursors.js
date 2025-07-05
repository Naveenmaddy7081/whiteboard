import React from 'react';

const UserCursors = ({ cursors, socketId }) => {
  return (
    <>
      {Object.entries(cursors).map(([id, { x, y }]) => (
        id === socketId ? null : (
          <div key={id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 10,
              height: 10,
              backgroundColor: 'purple',
              borderRadius: '50%',
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )
      ))}
    </>
  );
};

export default UserCursors;