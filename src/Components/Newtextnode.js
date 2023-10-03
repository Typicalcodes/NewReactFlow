import React, { useState } from "react";
import { Handle, Position,useStore } from "reactflow";

const connectionIdselector = (state)=>state.connectionNodeId;
const Newtextnode = ({data, id}) => {
  const connectionNodeId = useStore(connectionIdselector);
  const [modal, setModal] = useState(false);
  const [detail,setDetail]= useState("");
  const isConnecting=!!connectionIdselector;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const label = isTarget ? "Drop Here":"Draging From Here";
  
  const changemodal = (item)=>{
    setDetail(item)
  }
  const openmodal = (item)=>{
    let menu = modal ? false : true;
    setModal((prev)=>menu);
    changemodal(item);
  }
  

  return (
    <>
    
      
        <Handle type="source" id="a" position={Position.Top} />
        {modal
         && (<div className=" absolute -top-16 p-3 rounded-md bg-[#F78CA2]  text-[#D80032] z-[2000]">
           <button onClick={()=>{openmodal("")}} className="absolute top-1 right-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
           Hello
           <p>
           {detail}

           </p>
        </div>)}
          
        <div className="w-fit h-fit relative  p-2">
          
            <div onClick={()=>{openmodal("I am rectangle")}} className="nodrag abosulte bg-[#3D0C11] rounded-lg px-[60px] py-[30px]"></div>
            
            <svg
            onClick={()=>{openmodal("I am triangle")}}
              className=" absolute inset-0 top-[50%] bg-clip-content left-[50%] hover:fill-yellow-500 p-0 -translate-x-[50%] -translate-y-[50%] flex items-center  justify-center "
              fill="#D80032"
              width="40px"
              height="40px"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-2 -2 20 20"
              stroke="#F9DEC9"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
              
                <path className="cls-1 " d="M8,2L2,14H14L8,2Z"></path>
              </g>
            </svg>
          {label}
      </div>
    </>
  );
};

export default Newtextnode;
