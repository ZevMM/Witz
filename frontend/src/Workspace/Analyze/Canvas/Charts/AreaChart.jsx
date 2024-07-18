import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useState, useEffect } from 'react';


const RenderAreaChart = ({portfolio}) => {
  const [data, setData] = useState(null)
  const [active, setActive] = useState(portfolio[0]["data"].slice(1))
  const [timespan, setTimespan] = useState(-250)

  useEffect(() => {
    axios
    .post('http://localhost:3001/areachart', portfolio)
    .then(response => {
        console.log(response.data)
        setData(response.data.slice(timespan))
    })
    }, [timespan, active])

    const colors = ["#23438a", "#5d439c", "#ffc658", "#d24c84", "#a4479f", "#23438a", "#5d439c"]


    return (
        <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
        <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
         <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Value by Sector
         
         <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color: "#666666"}} name="range" id="range" onChange={(e) => setTimespan(parseInt(e.target.value))}>
          <option value="-250">1Y</option>
          <option value="-125">6M</option>
          <option value="-60">3M</option>
          <option value="-20">1M</option>
        </select>

        </div>

        <div style={{flex:"1", minHeight: 0}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
            <YAxis style={{fontSize: "small"}}/>
            <Tooltip />
            {active.map((s, i) => <Area type="linear" dataKey={i} stackId="1" stroke={colors[i % colors.length]} fill={colors[i % colors.length]}/>)}
          </AreaChart>
        </ResponsiveContainer>
        </div>

        
        <div style={{color: "black", padding:"5px", flex:"0", display:"flex", justifyContent:"space-around", alignItems:"center", paddingLeft:"10%", paddingRight:"10%"}}>
          {active.map((s, i) => <div><span class="dot" style={{backgroundColor:colors[i % colors.length], marginRight:"5px"}}></span>{s[0]}</div>)}
        </div>
        </div>
      );
    }

export default RenderAreaChart