import React, { useCallback, useState } from 'react'
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges , Background, Controls} from 'reactflow';
import 'reactflow/dist/style.css';
import Newtextnode from './Newtextnode';
const newnode = { textupdate : Newtextnode};
const initialnode = [
    {
        id : "1",
        type : "textupdate",
        position : {x: 0,y:0}
    },
    {
        id : "2",
        type : "input",
        position : {x: 150,y:150},
        data : {label : "Newcpul"}
    },
 
]
const id=0;
const edges = [
    {
    
    }
]
const Flow = () => {

  return (
    <div style={{width: "700px", height:"700px", border: "2px solid black"}} >
    <ReactFlow style={{backgroundColor : "#D80032"}} defaultEdges={edges} fitView nodeTypes={newnode} defaultNodes={initialnode}  >
      <Background />
      <Controls />
    </ReactFlow>
  </div>
  )
}

export default Flow;