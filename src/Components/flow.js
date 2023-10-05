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

import "./styles.css";
import Floatingedge from "./floatingedge";
import Dropper from "./Dropper";
import newnoder from "./newnode";
import CustomEdge from "./customedge";

const newnode = {
  textupdate: Newtextnode,
  CustomNode: customNode,
  Newnode: newnoder,
};

const newedge = {
  floating: Floatingedge,
  closeedge: CustomEdge,
};

const initialnode = [
  {
    id: "34",
    type: "CustomNode",
    position: { x: 300, y: 100 },
  },
];

let nodeid = 0;

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "white",
};

const initialEdges = [];

const getId = () => `dndnode_${nodeid++}`;

//The Main Component
const Flow = () => {
  // all states
  const [edges, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [nodes, setNode, onNodesChange] = useNodesState(initialnode);
  const reactflowbox = useRef();
  const [reactflowinstance, setReactflowinstance] = useState(null);

  // drag function
  const dragoverstart = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const edgesd = {
    style: { strokeWidth: 3, stroke: "white" },

    type: "closeedge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "white",
    },
  };
  // drop function
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const boundingbox = reactflowbox.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const color = event.dataTransfer.getData("application/reactflowcolor");
      const label = event.dataTransfer.getData("application/reactflowlabel");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactflowinstance.project({
        x: event.clientX - boundingbox.left,
        y: event.clientY - boundingbox.top,
      });
      const nextnode = {
        id: getId(),
        type,
        position,
        data: { label: `${label}`, color: `${color}` },
      };
      setNode((prev) => prev.concat(nextnode));
    },
    [reactflowinstance]
  );

  // adding edge
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
    (params) => {console.log(params);
    if(params.source !== params.target) {setEdge((eds) => addEdge(params, eds))}},
    [setEdge]
  );
  return (
    <div className="flex flex-col md:flex-row-reverse  space-x-10 items-center gap-5 p-2">
      <div
        className="md:h-[40rem] md:w-[40rem] h-full w-full m-auto"
        ref={reactflowbox}
      >
        <ReactFlow
          style={{ backgroundColor: "#D80032", border: "5px solid gray" }}
          edges={edges}
          nodes={nodes}
          onConnect={onConnect}
          edgeTypes={newedge}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          defaultEdgeOptions={edgesd}
          fitView
          onDrop={onDrop}
          nodeTypes={newnode}
          onDragOver={dragoverstart}
          onInit={setReactflowinstance}
          defaultNodes={initialnode}
          connectionLineComponent={customlineComponent}
          connectionLineStyle={connectionLineStyle}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <Dropper />
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
