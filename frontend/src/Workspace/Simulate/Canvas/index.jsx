import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Brush
  } from 'recharts';
import './index.css'
import { useState } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
"remember to handle case of clicking on elements when not in focus. Maybe just have it be on hover?"
const ReactGridLayout = WidthProvider(RGL);

const Open = (e, setRange, all, setLayout) => {
  const min = e.startIndex
  const max = e.endIndex
  setRange(e)
  setLayout(all.filter(ele => ele.x >= min & ele.x <= max))
}

const handleRangeChange = (e, range, setRange, all, setLayout) => {
  if (range.startIndex === e.startIndex & range.endIndex === e.endIndex) {return}
  const min = e.startIndex
  const max = e.endIndex
  setRange(e)
  let newl = all.filter(ele => ele.x >= min & ele.x <= max)
  CollapseNOUA(newl, setLayout)
}

const CollapseNOUA = (layout, setLayout) => {
  let byx = {}
  layout.forEach(element => {
    const xValue = element.x;
    if (byx[xValue]) {
      byx[xValue].push(element);
    } else {
      byx[xValue] = [element];
    }
  });
  
  let newlayout = []
  for (let [key, value] of Object.entries(byx)) {
    value.length > 1 ? newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`mul${key}`}) : newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`sng${key}`})
  }
  setLayout(newlayout)
}

const Collapse = (layout, setLayout, all, range, setAll) => {
  updateAll(layout, all, range, setAll)
  let byx = {}
  layout.forEach(element => {
    const xValue = element.x;
    if (byx[xValue]) {
      byx[xValue].push(element);
    } else {
      byx[xValue] = [element];
    }
  });
  
  let newlayout = []
  for (let [key, value] of Object.entries(byx)) {
    value.length > 1 ? newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`mul${key}`}) : newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`sng${key}`})
  }
  setLayout(newlayout)
}

const updateAll = (l, all, range, setAll) => {
  const min = range.startIndex
  const max = range.endIndex
  setAll(all.filter(ele => ele.x < min & ele.x > max).concat(l)) 
}

const Canvas = ({data, numSteps, all, setAll}) => {

  const [range, setRange] = useState({startIndex: 0, endIndex: numSteps})


  const [layout, setLayout] = useState([...all])

  return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{height:"80%"}}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        stackOffset="sign"
        margin={{
          top: 5,
          right: 5,
          left: -10,
          bottom: 5,
        }}
      >
        {Object.keys(data[0]).slice(1).map(v => <Line type="linear" dataKey={v} dot={false}/>)}
        
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
        <YAxis style={{fontSize:"small"}}/>
        <Tooltip />
        <ReferenceLine y={0} stroke="#000" />
        <Brush dataKey="name" height={30} stroke="#8884d8" onChange={(e) => handleRangeChange(e, range, setRange, all, setLayout, setAll)}/>
      </LineChart>
    </ResponsiveContainer>

  </div>
  <div style={{height:"20%"}} onFocus={() => Open(range, setRange, all, setLayout)} onBlur={() => Collapse(layout, setLayout, all, range, setAll)} tabIndex={-1}>
      <ReactGridLayout
            className="layout"
            layout= {layout}
            
            cols={(range.endIndex - range.startIndex + 1)}
            rowHeight={25}
            width={15}
            onLayoutChange={(l) => {setLayout(l)
              console.log("all",all)
            }}
            style={{background:"#434343ff"}}
          >
            {layout.map(cb => {
              const id = cb.i
              return(<div className={id.includes("mul") ? "mul" : "sng"} key={id}></div>)
          })}
      </ReactGridLayout>
    </div>
  </div>

);}

export default Canvas