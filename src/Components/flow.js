import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import Newtextnode from "./Newtextnode";
import customNode from "./customnode";
import customlineComponent from "./connectioncomponent";
import "./btnstyle.css";

import "./styles.css"
import Floatingedge from "./floatingedge";

const newnode = { textupdate: Newtextnode, CustomNode: customNode };
const newedge = {
  floating: Floatingedge,
};
const initialnode = [
  {
    id: "c",
    type: "textupdate",
    position: { x: 0, y: 0 },
    data: { label: "Green" },
  },
  {
    id: "a",
    type: "output",
    position: { x: 0, y: 0 },
  },
  {
    id: "b",
    type: "input",
    position: { x: 150, y: 150 },
  },
  {
    id: "33",
    type: "CustomNode",
    position: { x: 200, y: 200 },
  },
  {
    id: "34",
    type: "CustomNode",
    position: { x: 300, y: 100 },
  },
];
let nodeid = 0;
const edges = [
  {
    style: { strokeWidth: 3, stroke: "black", },
    type: "floating",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  },
];
const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};
const initialEdges = [];
const getId = () => `dndnode_${nodeid++}`;
const Flow = () => {
  const [edge, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [node, setNode, onNodesChange] = useNodesState(initialnode);                
  const reactflowbox = useRef();
  const reactflowinstance = useReactFlow();

  const dragoverstart = useCallback((event)=>{
    event.preventDefault(); 
    event.dataTransfer.dropEffect = 'move';  
  },[])

  const onDrop = useCallback((event)=>{
    
      event.preventDefault();
      const boundingbox  = reactflowbox.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if(typeof type === 'undefined' || !type){
        return;
      }

      const position = reactflowinstance.project({
        x: event.clientX - boundingbox.left,
        y: event.clinetY - boundingbox.top
      })
      const nextnode = {
        id: getId(),
        type,
        position,
        data: {label: `${type} node`}
      };
      setNode((prev)=>[prev,nextnode])
       
 
  },[reactflowinstance])
 
  const addedge = useCallback(() => {
    const id = `${++nodeid}`;
    const newnode = {
      id,

      data: { label: "New Lable" },
      position: { x: Math.random() * 200, y: Math.random() * 150 },
    };
    reactflowinstance.addNodes(newnode);
  }, []);

  const onConnect = useCallback(
    (params) => setEdge((eds) => addEdge(params, eds)),
    [setEdge]
  );
  return (
    <div style={{ width: "700px", height: "700px", border: "2px solid black" }}>
      <ReactFlow
        style={{ backgroundColor: "#D80032" }}
        edges={edge}
        nodes={node}
        onConnect={onConnect}
        edgeTypes={newedge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={edges}
        fitView
        onDrop={onDrop}
        nodeTypes={newnode}
        onDragOver={dragoverstart}
        onInit={reactflowinstance}
        defaultNodes={initialnode}
        connectionLineComponent={customlineComponent}
        connectionLineStyle={connectionLineStyle}
      >
        <Background />
        <Controls />
        <button className="btn-add" onClick={addedge}>
          Add node
        </button>
      </ReactFlow>
    </div>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
