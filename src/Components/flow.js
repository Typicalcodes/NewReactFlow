import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  getConnectedEdges,
  Panel,


} from "reactflow";
import clipboard from "clipboard-copy";
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
import DownloadButton from "./DownloadButton";

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
  const reactflow = useReactFlow()
  // all states
  const [selectedEdges, setSelectedEdges] = useState(null)
  const [selectedNodes, setSelectedNodes] = useState(null)
  const [edges, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [nodes, setNode, onNodesChange] = useNodesState(initialnode);
  const reactflowbox = useRef();
  const [reactflowinstance, setReactflowinstance] = useState(null);

  // drag function
  const dragoverstart = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  //Selecting function
  const selectionchange = useCallback(
    (event) => {

            setSelectedNodes(event.nodes)
        setSelectedEdges(getConnectedEdges(event.nodes,reactflow.getEdges()))

      },
    [],
  )
  useEffect(() => {
  
  }, [selectedNodes])
  useEffect(() => {
  
  }, [selectedEdges])
  

  //copying
 

  function copyItems(event){
  
    const data = {
      nodes: selectedNodes,
      edges: selectedEdges
    }
    const ob = JSON.stringify(data);
    clipboard(ob)
  

  }
  const pasteItems = async ()=>{
    const textFromClipboard = await navigator.clipboard.readText();
    const ob = JSON.parse(textFromClipboard)
    console.log(ob)
    const now = Date.now();
    if(ob.nodes && ob.nodes.length>0){
      ob.nodes.forEach(element => {
        element.id =`${element.id}_${now}`;
      
      });
    }
    if(ob.edges && ob.edges.length>0){
      ob.edges.forEach(element=>{
        element.source = `${element.source}_${now}`
        element.target = `${element.target}_${now}`
        element.id = `${element.id}_${now}`
      })
    }

    reactflow.addNodes(ob.nodes);
    nodes.forEach(element => {
      element.selected = false
    });
    setNode((prev)=>nodes);
    setNode((prev)=>[...prev, ...ob.nodes])
    setEdge((prev)=>[...prev, ...ob.edges])

  }
// cut function
  const cutItems = async ()=>{
    const data = {
      nodes: selectedNodes,
      edges: selectedEdges
    }
    const ob = JSON.stringify(data);
    clipboard(ob)
    const newnodes = nodes.filter((item)=>{ return !selectedNodes.some((removeItem) => removeItem.id === item.id)})
    console.log(newnodes)
    setNode(newnodes)

   }
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
  const addnode = useCallback(() => {
    const id = `${++nodeid}`;
    const newnode = {
      id,

      data: { label: "New Lable" },
      position: { x: Math.random() * 200, y: Math.random() * 150 },
    };
    reactflowinstance.addNodes(newnode);
  }, []);


  useEffect(() => {
    window.addEventListener("copy",copyItems)
    window.addEventListener("paste",pasteItems)
    window.addEventListener("cut",cutItems)
  
    return () => {
      window.removeEventListener("copy",copyItems)
      window.removeEventListener("paste",pasteItems)
      window.removeEventListener("cut",cutItems)
    }
  }, [selectedNodes,selectedEdges])
  
  const onConnect = useCallback(
    (params) => {if(params.source !== params.target) {setEdge((eds) => addEdge(params, eds))}},
    [setEdge]
  );

  // SAVE FUNCTION
  function saveFlow(){

      const element = document.createElement("a");
      const file = new Blob([document.getElementById('input').value],    
                  {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = "myFile.txt";
      document.body.appendChild(element);
      element.click();
    
  }
  // return
  return (
    <div className="flex flex-col md:flex-row-reverse  justify-center space-x-10 items-center gap-5 p-2">
      <div
        className="md:h-[40rem] md:w-[40rem] my-4 h-full w-full m-auto"
        ref={reactflowbox}
      >
        <button onClick={()=>{copyItems()}} className="border-gray-950 border-2  mx-2 hover:bg-black hover:text-white hover:font-bold font-bold bg-white my-1 py-2 px-4 rounded-sm">Copy</button>
        <button onClick={()=>{pasteItems()}} className="border-gray-950 border-2 mx-2 hover:bg-black hover:text-white hover:font-bold font-bold bg-white my-1 py-2 px-4 rounded-sm">Paste</button>
        <button onClick={()=>{cutItems()}} className="border-gray-950 border-2 mx-2 hover:bg-black hover:text-white hover:font-bold font-bold bg-white my-1 py-2 px-4 rounded-sm">Cut</button>
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
          onSelectionChange={selectionchange}
          onDrop={onDrop}
          nodeTypes={newnode}
          onDragOver={dragoverstart}
          onInit={setReactflowinstance}
          defaultNodes={initialnode}
          connectionLineComponent={customlineComponent}
          connectionLineStyle={connectionLineStyle}
        >
          <DownloadButton/>
          <Panel position="top-left">
            <button onClick={()=>{saveFlow()}} className="bg-black px-4 py-2 text-white font-semibold hover:text-gray-200 rounded">Game OVer</button>
          </Panel>
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
