import { useState } from 'react'
import './index.css'


const toggleCharts = (isOn, name, layout, setLayout) => {
  const maxY = Math.max(...layout.map(c => c.y))
  const lowest = layout.find(c => c.y === maxY)
  
  if (isOn) {
    const newItem = {
      i : name,
      x : lowest.x,
      y : lowest.h + maxY,
      w : lowest.w,
      h : lowest.h
    }
    setLayout(layout.concat(newItem))
  } else {
    setLayout(layout.filter(c => c.i !== name))
  }
  console.log(layout)
}


function SideBar({type, layout, setLayout}) {
  const [cat, setCat] = useState("1")
  if (type == 'Add') {
    return (
      <div id="analyzesidebar">
        <h3>Analysis Presets</h3>
        <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          


          <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
          <input type="checkbox" id="chart1" name="chart1" onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)}/>
          <label for="chart1"> Current value pie-chart</label>
          </div>

          <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
          <input type="checkbox" id="chart2" name="chart2" onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)}/>
          <label for="chart2"> Principal value pie-chart</label>
          </div>

          <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
          <input type="checkbox" id="chart3" name="chart3" onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)} />
          <label for="chart3"> Risk pie-chart</label>
          </div>

      </div>
    )
  }
}

export default SideBar
