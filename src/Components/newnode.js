import React from 'react'
import { Handle, Position } from 'reactflow'

const newnode = () => {
  return (
    <>
    <div>
        <Handle type="target" id="c1" postion={Position.Top}/>
        <div className='bg-[#F78CA2] p-2 text-black font-bold '> Pink Node</div>
    </div>
    </>
  )
}

export default newnode