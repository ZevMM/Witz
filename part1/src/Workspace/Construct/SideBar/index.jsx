import { useState } from 'react'
import './index.css'

function SideBar({type}) {
  if (type == 'Add') {
    return (
      <div id="constructsidebar">
        <h3>Add Holding</h3>
        <div style={{ borderTop: "1px solid black ", width: 200, height: 2, marginTop: "15px"}}></div>
        <form>
          <input type={"select"} />
        </form>
        <div style={{ borderTop: "1px solid black ", width: 200, height: 2, marginTop: "15px"}}></div>
        <form style={{display: "flex", flexDirection: "column"}}>
          <input type={"select"} />
          <input type={"select"} />
          <button type={"submit"}> Add </button>
        </form>
      </div>
    )
  }
}

export default SideBar
