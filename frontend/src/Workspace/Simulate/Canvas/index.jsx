import {
    LineChart,
    Line,
    AreaChart,
    Area,
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

const ReactGridLayout = WidthProvider(RGL);

const Open = (e, setRange, pall, setLayout) => {
  const min = e.startIndex
  const max = e.endIndex
  setRange(e)
  setLayout(pall.filter(ele => ele.x >= min & (ele.x + ele.w) <= max).map(ele => {
    let copy = {...ele}
    copy.x -= min
    return copy
  }))
}

const handleRangeChange = (e, range, setRange, mall, setMlayout) => {
  if (range.startIndex === e.startIndex & range.endIndex === e.endIndex) {return}
  
  const min = e.startIndex
  const max = e.endIndex
  setRange(e)
  setMlayout(mall.filter(ele => ele.x >= min & (ele.x + ele.w) <= max).map(ele => {
    let copy = {...ele}
    copy.x -= min
    return copy
  }))
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
    value.length > 1 ? newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`mul${key}`, static:true}) : newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`sng${key}`, static:true})
  }
  setLayout(newlayout)
}

const Collapse = (layout, setLayout, pall, range, setPall) => {
  updateAll(layout, pall, range, setPall)
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
    value.length > 1 ? newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`mul${key}`, static:true}) : newlayout.push({x: parseInt(key), y: 0, w:1, h:1, i:`sng${key}`, static:true})
  }
  setLayout(newlayout)
}

const updateAll = (l, pall, range, setPall) => {
  
  const min = range.startIndex
  const max = range.endIndex
  let adjusted = l.map(ele=> {
    let copy = {...ele}
    copy.x += min
    return copy
  })
  let newl = pall.filter(ele => ele.x < min | (ele.x + ele.w)  > max).concat(adjusted)
  setPall(newl) 
}

const Mcollapse = (mlayout, mall, range, setMall, setMlayout) => {
  console.log("collapsing", mlayout)
  updateAll(mlayout, mall, range, setMall)
  let newl = mlayout.map(ele => {
    let copy = {...ele}
    copy.y = 0
    copy.h = 1
    return copy
  })
  setMlayout(newl)
}
const colors = ["#23438a", "#5d439c", "#ffc658", "#d24c84", "#a4479f", "#23438a", "#5d439c"]
const Chart = ({view, data, range, setRange, mall, setMlayout}) => {
  if (view == "stack") {
    return (
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
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
        {Object.keys(data[0]).slice(1).map((v, i) => <Area type="linear" dataKey={v} stackId="1" stroke={colors[i % colors.length]} fill={colors[i % colors.length]}/>)}
        
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
        <YAxis style={{fontSize:"small"}}/>
        <Tooltip />
        <ReferenceLine y={0} stroke="#000" />
        <Brush dataKey="name" height={30} stroke="#8884d8" onChange={(e) => handleRangeChange(e, range, setRange, mall, setMlayout)}/>
      </AreaChart>
      </ResponsiveContainer>
    )
  } 
  return (
    <ResponsiveContainer height="100%" width="100%">
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
      {Object.keys(data[0]).slice(1).map(v => { return (v.includes("quantile") ? (<Line type="linear" dataKey={v} dot={false} stroke={"red"}/>) :
        (<Line type="linear" dataKey={v} dot={false}/>))
        })}
      
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
      <YAxis style={{fontSize:"small"}}/>
      <Tooltip />
      <ReferenceLine y={0} stroke="#000" />
      <Brush dataKey="name" height={30} stroke="#8884d8" onChange={(e) => handleRangeChange(e, range, setRange, pall, setLayout, mall, setMlayout, setMall)}/>
    </LineChart>
    </ResponsiveContainer>
  )
}

const Canvas = ({simprops}) => {

  let view, simData, mevents, mall, setMall, mlayout, setMlayout, range, setRange;
  ({view, simData, mevents, mall, setMall, mlayout, setMlayout, range, setRange} = simprops)

  return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column", overflowY:"auto", marginBottom:"100px"}}>
    <div style={{flex:"1"}}>
    
    <Chart view={view} data={simData} range={range} setRange={setRange} mall={mall} setMlayout={setMlayout} />

    </div>
    <div style={{margin:"5px", flex:"0"}} onFocus={() => Open(range, setRange, mall, setMlayout)} onBlur={() => Mcollapse(mlayout, mall, range, setMall, setMlayout)} tabIndex={-1}>
      <ReactGridLayout
            className="layout"
            layout= {mlayout}
            allowOverlap = {true}
            cols={(range.endIndex - range.startIndex + 1)}
            rowHeight={25}
            onLayoutChange={(l) => {setMlayout(l)
            }}
            style={{background:"#434343ff"}}
          >
            {mlayout.map(cb => {
              const id = cb.i
              return(<div className={(id.includes("green") ? "macro_up" : "macro_down")} key={id}>{mevents[id].subj}</div>)
          })}
      </ReactGridLayout>
    </div>
  </div>

);}

export default Canvas