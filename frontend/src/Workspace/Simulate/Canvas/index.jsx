import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Brush
  } from 'recharts';
  import { useState } from 'react';
  import RGL, { WidthProvider } from "react-grid-layout";
  const ReactGridLayout = WidthProvider(RGL);
  
  const handleRangeChange = (e, setRange, all, setLayout) => {
    console.log("in focus", all)
    const min = e.startIndex
    const max = e.endIndex
    setRange(e)
    setLayout(all.filter(ele => ele.x >= min & ele.x <= max))
  }

  const Collapse = (layout, setLayout, all, range, setAll) => {
    console.log("out of focus")
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
  
  const Canvas = ({data}) => {

    const [range, setRange] = useState({startIndex: 0, endIndex: 6})
  
    const [all, setAll] = useState([
      {x: 0, y: 0, w:1, h:1, i:"block0"},
      {x: 1, y: 0, w:1, h:1, i:"block1"},
      {x: 2, y: 0, w:1, h:1, i:"block2"}
    ])
    
    const [layout, setLayout] = useState([...all])

    return (
    <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
    <div style={{height:"80%"}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          <CartesianGrid strokeDasharray="3 3" />
          
          <YAxis style={{fontSize:"small"}}/>
          <Tooltip />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="name" height={30} stroke="#8884d8" onChange={(e) => handleRangeChange(e, setRange, all, setLayout)}/>
          <Bar dataKey="pv" fill="#d24c8499" stackId="stack" />
          <Bar dataKey="uv" fill="#f5804a99" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div style={{height:"20%"}} onFocus={() => handleRangeChange(range, setRange, all, setLayout)} onBlur={() => Collapse(layout, setLayout, all, range, setAll)} tabIndex={-1}>
        <ReactGridLayout
              className="layout"
              layout= {layout}
              cols={(range.endIndex - range.startIndex + 1)}
              rowHeight={25}
              width={15}
              onLayoutChange={(l) => setLayout(l)}
              style={{background:"black"}}
            >
              {layout.map(cb => {
                const id = cb.i
                return(<div style={{color:"black", background:"green"}} className={id.includes("mul") ? "mul" : ""} key={id}>"Test"</div>)
            })}
        </ReactGridLayout>
      </div>
    </div>
  
  );}
  
  export default Canvas