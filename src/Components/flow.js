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
    id: "35",
    type: "Newnode",
    position: {x:310, y :250},
    data: { label: "Color Node", color: "#5c3838" },
  },
  {
    id: "36",
    type: "Newnode",
    position: {x:400, y :280},
    data: { label: "Color Node", color: "#1c3453" },
  },
  {
    id: "37",
    type: "Newnode",
    position: {x:210, y :400},
    data: { label: "Color Node", color: "#9d2348" },
  },

];

let nodeid = 0;

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "#ccd9f6",
};

const initialEdges = [];

const getId = () => `dndnode_${nodeid++}`;

const flowKey = "example-flow";
//NOTE The Main Component
const Flow = () => {
  const reactflow = useReactFlow();
  // NOTE All States
  const [selectedEdges, setSelectedEdges] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [edges, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [nodes, setNode, onNodesChange] = useNodesState(initialnode);
  const reactflowbox = useRef();
  const [reactflowinstance, setReactflowinstance] = useState(null);
  const [doc, setDoc] = useState(null);

  // drag function
  const dragoverstart = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  //Selecting function
  const selectionchange = useCallback((event) => {
    setSelectedNodes(event.nodes);
    setSelectedEdges(getConnectedEdges(event.nodes, reactflow.getEdges()));
  }, []);
  useEffect(() => {}, [selectedNodes,doc]);
  useEffect(() => {}, [selectedEdges]);

  //copying
  function copyItems(event) {
    const data = {
      nodes: selectedNodes,
      edges: selectedEdges,
    };
    const ob = JSON.stringify(data);
    clipboard(ob);
  }
  const pasteItems = async () => {
    const textFromClipboard = await navigator.clipboard.readText();
    const ob = JSON.parse(textFromClipboard);
    console.log(ob);
    const now = Date.now();
    if (ob.nodes && ob.nodes.length > 0) {
      ob.nodes.forEach((element) => {
        element.id = `${element.id}_${now}`;
      });
    }
    if (ob.edges && ob.edges.length > 0) {
      ob.edges.forEach((element) => {
        element.source = `${element.source}_${now}`;
        element.target = `${element.target}_${now}`;
        element.id = `${element.id}_${now}`;
      });
    }

    reactflow.addNodes(ob.nodes);
    nodes.forEach((element) => {
      element.selected = false;
    });
    setNode((prev) => nodes);
    setNode((prev) => [...prev, ...ob.nodes]);
    setEdge((prev) => [...prev, ...ob.edges]);
  };
  //NOTE cut function
  const cutItems = async () => {
    const data = {
      nodes: selectedNodes,
      edges: selectedEdges,
    };
    const ob = JSON.stringify(data);
    clipboard(ob);
    const newnodes = nodes.filter((item) => {
      return !selectedNodes.some((removeItem) => removeItem.id === item.id);
    });
    console.log(newnodes);
    setNode(newnodes);
  };
  const edgesd = {
    style: { strokeWidth: 3, stroke: "white" },

    type: "closeedge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "white",
    },
  };
  //NOTE drop function
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
    window.addEventListener("copy", copyItems);
    window.addEventListener("paste", pasteItems);
    window.addEventListener("cut", cutItems);

    return () => {
      window.removeEventListener("copy", copyItems);
      window.removeEventListener("paste", pasteItems);
      window.removeEventListener("cut", cutItems);
    };
  }, [selectedNodes, selectedEdges]);

  const onConnect = useCallback(
    (params) => {
      if (params.source !== params.target) {
        setEdge((eds) => addEdge(params, eds));
      }
    },
    [setEdge]
  );

  //NOTE save function
  const saveFlow = useCallback(() => {
    if (reactflowinstance) {
      const flow = reactflowinstance.toObject();
      const string = JSON.stringify(flow);

      const element = document.createElement("a");
      const file = new Blob([string], {
        type: "text/plain;charset=utf-8",
      });
      element.href = URL.createObjectURL(file);
      element.download = "myFile.txt";
      document.body.appendChild(element);
      element.click();
    }
  }, [reactflowinstance]);

//NOTE handlefilesumbit
function handleFileChange(event) {
  const file = event.target.files[0];

  if (file) {
    // Read the contents of the selected file
    const reader = new FileReader();

    reader.onload = function (e) {
      // e.target.result contains the text content of the file
      const fileContent = e.target.result;

      // Now you can do something with the file content, like displaying it in the component's state or rendering it in your UI.
      setDoc((prev)=>fileContent)
    };

    // Read the file as text
    const text = reader.readAsText(file)
    console.log(text)    
  }
}
// NOTE  loading files  
  const loadfile = useCallback(() => {
     const flow = JSON.parse(doc);
    console.log(doc)
    if (flow) {
      
      setNode(flow.nodes || []);
      setEdge(flow.edges || []);
     
    }
    
  }, [doc]);



  //NOTE return
  return (
    <div className="flex flex-col md:flex-row-reverse  justify-center space-x-10 items-center gap-5 p-2">
      <div
        className="md:h-[45rem] md:w-[50rem] mt-4 mx-2 h-full w-full m-auto"
        ref={reactflowbox}
      >
        <button
          onClick={() => {
            copyItems();
          }}
          className="border-gray-950 border-2  mx-2 hover:bg-black hover:text-white hover:font-bold font-bold bg-white my-1 py-2 px-4 rounded-sm"
        >
          Copy
        </button>
        <button
          onClick={() => {
            pasteItems();
          }}
          className="border-gray-950 border-2 mx-2 hover:bg-black hover:text-white hover:font-bold font-bold bg-white my-1 py-2 px-4 rounded-sm"
        >
          Paste
        </button>
        <button
          onClick={() => {
            cutItems();
          }}
          className="border-gray-950 border-2 mx-2 hover:bg-black hover:text-white hover:font-bold font-bold bg-white my-1 py-2 px-4 rounded-sm"
        >
          Cut
        </button>
        <ReactFlow
          style={{ backgroundColor: "#F7F7F7", border: "  " }}
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
          <DownloadButton />
          <Panel className="flex space-x-2" position="top-left">
            <button
              onClick={() => {
                saveFlow();
              }}
              className="bg-black px-4 py-2 text-white font-semibold hover:text-gray-200 rounded"
            >
              Save
            </button>
            <div className="border bg-black rounded-md py-1">
            <input type="file" accept=".txt" onChange={handleFileChange} className="ml-2 rounded-md w-[200px] text-white bg-black"/>
            <button
              onClick={() => {
                loadfile()
              }}
              className="bg-black px-4 py-2 text-white font-semibold hover:text-gray-200 rounded"
            >
              Load
            </button>
            </div>
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
