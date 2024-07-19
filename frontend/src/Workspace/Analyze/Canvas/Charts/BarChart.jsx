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
  const min = e.startIndex
  const max = e.endIndex
  setRange((max - min + 1))
  setLayout(all.filter(ele => ele.x >= min & ele.x <= max))
}

const RenderBarChart = ({data}) => {
  
  const [range, setRange] = useState([7])

  const [all, setAll] = useState([
    {x: 0, y: 0, w:1, h:1, i:"block0"},
    {x: 1, y: 0, w:1, h:1, i:"block1"},
    {x: 2, y: 0, w:1, h:1, i:"block2"}
  ])
  
  const [layout, setLayout] = useState([...all])

  return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
   <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Value by Sector
  </div>
  <div style={{flex:"1", minHeight: 0}}>
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
      <ReactGridLayout
            className="layout"
            layout= {layout}
            cols={range}
            rowHeight={30}
            width={15}
            onLayoutChange={(l) => setLayout(l)}
          >
            {layout.map(cb => {
              const id = cb.i
              return(<div style={{color:"black", background:"green"}} key={id}>"Test"</div>)
          })}
      </ReactGridLayout>
    </div>

);}

export default RenderBarChart