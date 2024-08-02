import { useState } from 'react'
import './index.css'

const toggleCharts = (isOn, name, layout, setLayout) => {
  const small = ["chart5", "chart6", "chart7", "chart8", "widget5", "widget6"]
  if (isOn) {
    const newItem = {
      i : name,
      x : (3 * layout.length % 12),
      y : Infinity,
      w : 3,
      h : small.includes(name) ? 2 : 6
    }
    setLayout(layout.concat(newItem))
  } else {
    setLayout(layout.filter(c => c.i !== name))
  }
}

const PresetCheckbox = ({view, name, id, setLayout}) => {
  return (
    <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}}>
    <input type="radio" id={id} name="analysis_preset" onClick={(e) => {
      setLayout(view)}} 
    />
    <label htmlFor={id} style={{marginLeft: "5px"}}>{name}</label>
    </div>
  )
}

const view1 = [
  {
      "w": 6,
      "h": 12,
      "x": 0,
      "y": 0,
      "i": "chart3",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 6,
      "y": 2,
      "i": "chart5",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 9,
      "y": 0,
      "i": "chart6",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 6,
      "y": 0,
      "i": "chart7",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 9,
      "y": 2,
      "i": "chart8",
      "moved": false,
      "static": false
  },
  {
      "w": 6,
      "h": 15,
      "x": 6,
      "y": 4,
      "i": "sectorchart",
      "moved": false,
      "static": false
  },
  {
      "w": 6,
      "h": 7,
      "x": 0,
      "y": 12,
      "i": "chart10",
      "moved": false,
      "static": false
  }
]

const view2 = [
  {
      "w": 5,
      "h": 6,
      "x": 3,
      "y": 0,
      "i": "riskchart",
      "moved": false,
      "static": false
  },
  {
      "w": 5,
      "h": 6,
      "x": 3,
      "y": 6,
      "i": "chart10",
      "moved": false,
      "static": false
  },
  {
      "w": 12,
      "h": 7,
      "x": 0,
      "y": 12,
      "i": "chart9",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 6,
      "x": 0,
      "y": 0,
      "i": "chart1",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 6,
      "x": 0,
      "y": 6,
      "i": "chart2",
      "moved": false,
      "static": false
  },
  {
      "w": 4,
      "h": 10,
      "x": 8,
      "y": 0,
      "i": "returnchart",
      "moved": false,
      "static": false
  },
  {
      "w": 2,
      "h": 2,
      "x": 8,
      "y": 10,
      "i": "chart5",
      "moved": false,
      "static": false
  },
  {
      "w": 2,
      "h": 2,
      "x": 10,
      "y": 10,
      "i": "chart6",
      "moved": false,
      "static": false
  }
]

const view3 = [
  {
      "w": 3,
      "h": 2,
      "x": 0,
      "y": 0,
      "i": "chart5",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 0,
      "y": 4,
      "i": "chart6",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 0,
      "y": 6,
      "i": "chart7",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 0,
      "y": 8,
      "i": "chart8",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 0,
      "y": 10,
      "i": "widget5",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 2,
      "x": 0,
      "y": 2,
      "i": "widget6",
      "moved": false,
      "static": false
  },
  {
      "w": 9,
      "h": 7,
      "x": 3,
      "y": 0,
      "i": "chart9",
      "moved": false,
      "static": false
  },
  {
      "w": 9,
      "h": 12,
      "x": 3,
      "y": 7,
      "i": "returnchart",
      "moved": false,
      "static": false
  },
  {
      "w": 3,
      "h": 7,
      "x": 0,
      "y": 12,
      "i": "chart1",
      "moved": false,
      "static": false
  }
]

const ChartCheckbox = ({id, name, layout, setLayout}) => {

  if (layout?.map(c => c.i).includes(id)) {
    return (
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px", color: "#666666"}}>
      <input type="checkbox" id={id} name={id} onChange={(e) => toggleCharts(e.target.checked, e.target.name, layout, setLayout)} checked/>
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
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setSummary(!summary)}>Charts <span style={{fontSize: "larger"}}>-</span></div>
      <ChartCheckbox id={"chart1"} name={"Value Pie-Chart"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart2"} name={"Risk Pie-Chart"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart3"} name={"Stacked Assets"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"sectorchart"} name={"Stacked Sectors"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart4"} name={"Normalized Time-Series"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"returnchart"} name={"% Change Time-Series"} layout={layout} setLayout={setLayout} />
      </>)
  }
  return <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setSummary(!summary)}>Charts <span style={{fontSize: "larger"}}>+</span> </div>
}
//add historic returns
//make "insights" it's own category
const Statistics = ({layout, setLayout, nums, setNums}) => {
  if (nums) {
    return (<>
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setNums(!nums)}>Statistics <span style={{fontSize: "larger"}}>-</span></div>
      <ChartCheckbox id={"chart5"} name={"Total Value"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart6"} name={"Volatility"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart7"} name={"Diversification Ratio"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart8"} name={"Sharpe Ratio"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"widget5"} name={"Ulcer Index"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"widget6"} name={"Return"} layout={layout} setLayout={setLayout} />
      </>)
  }
  return <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setNums(!nums)}>Statistics <span style={{fontSize: "larger"}}>+</span></div>
}

const Interactive = ({layout, setLayout, intrv, setIntrv}) => {
  if (intrv) {
    return (<>
      <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setIntrv(!intrv)}>Tables <span style={{fontSize: "larger"}}>-</span></div>
      <ChartCheckbox id={"chart9"} name={"Time-Series Table"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"chart10"} name={"Correlation Matrix"} layout={layout} setLayout={setLayout} />
      <ChartCheckbox id={"riskchart"} name={"Insights"} layout={layout} setLayout={setLayout} />
      </>)
  }
  return <div style={{ display: "inline-block", width: "75%", marginBottom: "5px"}} onClick={() => setIntrv(!intrv)}>Tables <span style={{fontSize: "larger"}}>+</span></div>
}

function SideBar({type, layout, setLayout}) {
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
        
        <PresetCheckbox view={view1} id={"preset1"} name={"Preset 1"} setLayout={setLayout} />
        <PresetCheckbox view={view2} id={"preset2"} name={"Preset 2"} setLayout={setLayout} />
        <PresetCheckbox view={view3} id={"preset3"} name={"Preset 3"} setLayout={setLayout} />

    </div>
    )
  }
}

export default SideBar
