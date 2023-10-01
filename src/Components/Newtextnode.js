import React from 'react'
import { Handle , Position} from 'reactflow'

const Newtextnode = () => {
  return (
    <>
    <div style={{backgroundColor:"#F9DEC9", padding: "25px 25px"}}>
        <Handle type="source" id="a" position={Position.Top}/>
        <div>
        <label htmlFor='ss'>Hello</label>
        <input type="text" name="ss" className='nodrag'/>
        </div>
        </div>
        </>
  )
}

export default Newtextnode