import React, { useCallback, useEffect } from 'react'
import { Background, Handle, Position, useOnSelectionChange } from 'reactflow'



const Newnode = ({data, id, selected}) => {
 

  
  return (
    <>
    <div className={`${selected && "ring-2 ring-offset-1 rounded-md"}`}>
        <Handle type="source" id="c1" position={Position.Top}/>
        <div className={`hover:bg-black  border-2 border-white font-bold  rounded-md p-2 my-2 text-white `}  style={{ backgroundColor: data.color }}>{data.label}</div>
    </div>
        <Handle type="target" id="c2" position={Position.Bottom}/>    
    </>
  )
}

export default Newnode