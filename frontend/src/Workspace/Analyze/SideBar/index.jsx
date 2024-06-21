import { useState } from 'react'
import './index.css'

const toggleCharts = (isOn, name, layout, setLayout) => {
  const small = ["chart4", "chart5", "chart6"]
  if (isOn) {
    const newItem = {
      i : name,
      x : (3 * layout.length % 12),
      y : Infinity,
      w : small.includes(name) ? 2 : 3,
      h : small.includes(name) ? 3 : 6
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

const view1 = [ {w: 2, h: 3, x: 1, y: 0, i: 'chart6'}, 
  {w: 2, h: 3, x: 3, y: 0, i: 'chart5'},
  {w: 2, h: 3, x: 5, y: 0, i: 'chart4'},
  {w: 3, h: 9, x: 7, y: 0, i: 'chart3'}, 
  {w: 3, h: 6, x: 1, y: 3, i: 'chart2'}, 
  {w: 3, h: 6, x: 4, y: 3, i: 'chart1'}]

const view2 = [{w: 3, h: 3, x: 0, y: 0, i: 'chart5'},
{w: 3, h: 3, x: 0, y: 3, i: 'chart4'},
{w: 3, h: 6, x: 3, y: 0, i: 'chart3'},
{w: 6, h: 12, x: 6, y: 0, i: 'chart2'},
{w: 3, h: 6, x: 3, y: 6, i: 'chart1'}]

const view3 = [{w: 3, h: 3, x: 6, y: 0, i: 'chart6'},
  {w: 3, h: 3, x: 9, y: 6, i: 'chart4'},
  {w: 3, h: 6, x: 9, y: 0, i: 'chart3'},
  {w: 6, h: 9, x: 0, y: 0, i: 'chart2'},
  {w: 3, h: 6, x: 6, y: 3, i: 'chart1'}]

const ChartCheckbox = ({id, name, layout, setLayout}) => {

  if (layout?.map(c => c.i).includes(id)) {
    return (
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px", color: "#666666"}}>
      <input type="checkbox" id={id} name={id} onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)} checked/>
      <label htmlFor={id} style={{marginLeft: "5px"}}>{name}</label>
      </div>
    )
  }
  return (
    <div style={{ display: "inline-block", width: "75%", marginBottom: "5px", color: "#666666"}}>
    <input type="checkbox" id={id} name={id} onClick={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)}/>
    <label htmlFor={id} style={{marginLeft: "5px"}}>{name}</label>
    </div>
  )
}

const SummaryCharts = ({layout, setLayout, summary, setSummary}) => {
  if (summary) {
    return (<>
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setSummary(!summary)}>Summary Charts <span style={{fontSize: "larger"}}>-</span></div>
      <ChartCheckbox id={"chart1"} name={"Current value pie-chart"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart2"} name={"Principal value pie-chart"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart3"} name={"Risk pie-chart"} layout={layout} setLayout={setLayout} />
      </>)
  }
  return <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setSummary(!summary)}>Summary Charts <span style={{fontSize: "larger"}}>+</span> </div>
}

const Statistics = ({layout, setLayout, nums, setNums}) => {
  if (nums) {
    return (<>
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setNums(!nums)}>Statistics <span style={{fontSize: "larger"}}>-</span></div>
      <ChartCheckbox id={"chart4"} name={"Total Value"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart5"} name={"Initial Investment"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart6"} name={"Historic return"} layout={layout} setLayout={setLayout} />
      </>)
  }
  return <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setNums(!nums)}>Statistics <span style={{fontSize: "larger"}}>+</span></div>
}

const Interactive = ({layout, setLayout, intrv, setIntrv}) => {
  if (intrv) {
    return (<>
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setIntrv(!intrv)}>Interactive <span style={{fontSize: "larger"}}>-</span></div>
      <ChartCheckbox id={"chart7"} name={"Should be table"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart8"} name={"Should be table"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart9"} name={"Should be table"} layout={layout} setLayout={setLayout} />
      </>)
  }
  return <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setIntrv(!intrv)}>Interactive <span style={{fontSize: "larger"}}>+</span></div>
}

function SideBar({type, layout, setLayout}) {
  console.log(layout)
  const [summary, setSummary] = useState(true)
  const [nums, setNums] = useState(true)
  const [intrv, setIntrv] = useState(true)


  if (type == 'Custom') {
    return (
      <div id="analyzesidebar">
        <h3 style={{fontFamily: "Georgia"}}>Analysis Elements</h3>
        <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          
          <SummaryCharts layout={layout} setLayout={setLayout} summary={summary} setSummary={setSummary}/>
          <Statistics layout={layout} setLayout={setLayout} nums={nums} setNums={setNums} />
          <Interactive layout={layout} setLayout={setLayout} intrv={intrv} setIntrv={setIntrv} />

      </div>
    )
  } else if (type == 'Preset') {
    return (
      <div id="analyzesidebar">
      <h3 style={{fontFamily: "Georgia"}}>Analysis Presets</h3>
      <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
        
        <PresetCheckbox view={view1} id={"preset1"} name={"Interesting name"} setLayout={setLayout} />
        <PresetCheckbox view={view2} id={"preset2"} name={"Intriguing title"} setLayout={setLayout} />
        <PresetCheckbox view={view3} id={"preset3"} name={"Inviting label"} setLayout={setLayout} />

    </div>
    )
  }
}

export default SideBar
