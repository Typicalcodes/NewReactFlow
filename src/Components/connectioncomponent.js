import React from 'react';
import { getStraightPath } from 'reactflow';

function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle cx={toX} cy={toY} fill="white" r={3} stroke="white" strokeWidth={1.5} />
    </g>
  );
}

export default CustomConnectionLine;
