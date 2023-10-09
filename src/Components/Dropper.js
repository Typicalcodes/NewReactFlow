import React, { useEffect, useState } from "react";
import { useStore } from "reactflow";
const selectnodes = (state)=>state.getNodes;
const Dropper = () => {
  const getNodes = useStore(selectnodes)
  const [Color, setColor] = useState("#F78CA2");
  const [label, setLabel] = useState("New Node");
  useEffect(() => {
 
  }, [Color])
  const dragstart = (event,nodeType) => {
    const color = event.target.getAttribute("data-color"); 
    const label = event.target.getAttribute("labelvalue"); 

    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflowcolor", color);
    event.dataTransfer.setData("application/reactflowlabel", label);
    event.dataTransfer.effectAllowed = "move";
  };

  
  return (
    <>
    <div className=" border-4 rounded-md  my-4 p-2 px-4">
        <p className="text-start text-xl font-bold  ">Add Your Nodes</p>
        <button onClick={()=>{console.log(getNodes)}}>Get Node</button>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-none md:flex md:space-y-4 md:flex-col flex-none my-4 items-center w-auto justify-center justify-items-center content-center ">
        <div className="w-full rounded flex  flex-row ">
          <div
            className={` flex gap-2 flex-col md:flex-row  text-black font-bold border w-full  text-center items-center rounded-md p-6`}
            onDragStart={(event) =>
              dragstart(event, "Newnode", "Color Node")
            }
            data-color={Color}
            labelvalue={label}
            draggable
            style={{ backgroundColor: Color ,color : Color ? "white":"black" }}
          >
           <input value={label} className="border-2  px-2  py-2 text-black rounded-md " placeholder="Type text Here" onChange={(e)=>setLabel((prev)=>e.target.value)}/>
          
          <div className="flex justify-center space-x-2">
          <span className="text-center font-semibold ">Color</span>
          <input type="color" value={Color} className="rounded-md" onChange={(e)=>setColor((prev)=>e.target.value)} />
          </div>
       
          </div>
        </div>

        <div
          className="bg-[Black] h-full text-center items-center flex  justify-center text-white font-bold rounded-md w-full p-6"
          onDragStart={(event) =>
            dragstart(event, "textupdate", "#F78CA2", "Shape")
          }
          draggable
        >
          {" "}
          Shape Node
        </div>
        <div
          className="bg-[#ccd9f6] flex items-center justify-center text-black font-bold rounded-md w-full p-6"
          onDragStart={(event) =>
            dragstart(event, "CustomNode", "#ffcce3", "Shape")
          }
          draggable
        >
          {" "}
          Dropper Node 
        </div>
      </div>
      </div>
    </>
  );
};

export default Dropper;
