import React from 'react'

const Dropper = () => {
    const dragstart = (event, nodeType, color)=>{
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.setData('application/reactflowcolor', color)
        event.dataTransfer.effectAllowed = 'move'
    }
  return (
    <div>
      <div className='bg-[#F78CA2] p-2 text-black font-bold ' onDrag={(event)=>dragstart(event, )}> Pink Node</div>
    </div>
  )
}

export default Dropper