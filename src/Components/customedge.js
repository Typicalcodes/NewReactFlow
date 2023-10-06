import React, { useCallback, useEffect, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useStore,
  useReactFlow
} from "reactflow";


const onEdgeClick = (evt, id) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
};


export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) {
  const reactFlow = useReactFlow()
  const [showClose, setShowClose] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  function show() {
    setShowClose(true);
  }
  function hide() {
    setTimeout(() => {
      
      setShowClose(false);
    }, 2000);
  }

    
    const onDelete = useCallback(
      (evt, id) => {
        evt.stopPropagation()
        reactFlow.setEdges((edges) => edges.filter((edge) => edge.id !== id))
      },
      [reactFlow]
    )

  useEffect(() => {
    
  }, [showClose]);

  return (
    <>
      <path
        fill="none"
        onMouseOver={() => {
          show();
        }}
        onMouseOut={() => {
          hide();
        }}
        className="stroke-white stroke-[4px] hover:stroke-[#F78CA2]"
        d={edgePath}
      />
    {showClose && <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button className="p-1 rounded-full transition-opacity duration-100 delay-100 text-slate-400 bg-white" onClick={(e)=>{onDelete(e,id)}}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>}
     
     </>
  );
}
