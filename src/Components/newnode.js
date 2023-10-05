import React from 'react'
import { Background, Handle, Position } from 'reactflow'

const newnode = ({data}) => {

  return (
    <>
    <div>
        <Handle type="source" id="c1" position={Position.Top}/>
        <div className={`hover:bg-black  border-2 border-white font-bold  rounded-md p-2 my-2 text-white `}  style={{ backgroundColor: data.color }}>{data.label}</div>
    </div>
        <Handle type="target" id="c2" position={Position.Bottom}/>    
    </>
  )
}

export default newnode