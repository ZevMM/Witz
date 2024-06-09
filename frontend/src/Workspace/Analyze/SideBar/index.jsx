import { useState } from 'react'
import './index.css'

const toggleCharts = (isOn, name, layout, setLayout) => {
  if (isOn) {
    const newItem = {
      i : name,
      x : (3 * layout.length % 12),
      y : Infinity,
      w : 3,
      h : 6
    }
    setLayout(layout.concat(newItem))
  } else {
    setLayout(layout.filter(c => c.i !== name))
  }
  console.log(layout)
}

const PresetCheckbox = ({view, name, id, setLayout}) => {
  return (
    <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
    <input type="radio" id={id} name="analysis_preset" onClick={(e) => {
      console.log(view)
      setLayout(view)}} 
    />
    <label htmlFor={id}>{name}</label>
    </div>
  )
}

const view1 = [{ i: "chart1", x: 0, y: 0, w: 1, h: 2 },
{ i: "chart2", x: 1, y: 0, w: 3, h: 2 },
{ i: "chart3", x: 4, y: 0, w: 1, h: 2 }]

const view2 = [{ i: "chart1", x: 6, y: 0, w: 1, h: 2 },
{ i: "chart2", x: 6, y: 4, w: 4, h: 4}]

const view3 = [{ i: "chart1", x: 0, y: 0, w: 2, h: 2 },
{ i: "chart2", x: 10, y: 0, w: 2, h: 2},
{ i: "chart3", x: 4, y: 4, w: 4, h: 4 }]

const ChartCheckbox = ({id, name, layout, setLayout}) => {

  if (layout?.map(c => c.i).includes(id)) {
    return (
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
      <input type="checkbox" id={id} name={id} onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)} checked/>
      <label htmlFor={id}>{name}</label>
      </div>
    )
  }
  return (
    <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
    <input type="checkbox" id={id} name={id} onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)}/>
    <label htmlFor={id}>{name}</label>
    </div>
  )
}


function SideBar({type, layout, setLayout}) {
  const [cat, setCat] = useState("1")
  if (type == 'Custom') {
    return (
      <div id="analyzesidebar">
        <h3>Analysis Elements</h3>
        <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          
          <ChartCheckbox id={"chart1"} name={"Current value pie-chart"} layout={layout} setLayout={setLayout} />
          <ChartCheckbox id={"chart2"} name={"Principal value pie-chart"} layout={layout} setLayout={setLayout} />
          <ChartCheckbox id={"chart3"} name={"Risk pie-chart"} layout={layout} setLayout={setLayout} />

      </div>
    )
  } else if (type == 'Preset') {
    return (
      <div id="analyzesidebar">
      <h3>Analysis Presets</h3>
      <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
        
        <PresetCheckbox view={view1} id={"preset1"} name={"Interesting name"} setLayout={setLayout} />
        <PresetCheckbox view={view2} id={"preset2"} name={"Intriguing title"} setLayout={setLayout} />
        <PresetCheckbox view={view3} id={"preset3"} name={"Inviting label"} setLayout={setLayout} />

    </div>
    )
  }
}

export default SideBar
