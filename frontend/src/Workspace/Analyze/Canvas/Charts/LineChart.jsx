import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import axios from 'axios';
import { useState, useEffect } from 'react';


const RenderLineChart = ({portfolio}) => {
  const [data, setData] = useState(null)
  const colors = ["#23438a", "#5d439c", "#ffc658", "#d24c84", "#a4479f", "#23438a", "#5d439c"]

  useEffect(() => {
    axios
    .post('http://localhost:3001/linegraph', portfolio)
    .then((response) => {
      console.log(response.data)
      setData(response.data)
    })
  }, [])

  if (!data) {
    return
  }

  return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
   <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Value by Sector
   <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666"}} name="cars" id="cars">
    <option value="volvo">Add</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
    </select>
  </div>
  <div style={{flex:"1", minHeight: 0}}>
    <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 0, right: 5, bottom: 0, left: -10 }}>
      {Object.keys(data[0]).slice(0, -1).map((k)=> <Line type="linear" dataKey={k} stroke={colors[k % colors.length]} dot={false}/>)}
      
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
      <YAxis style={{fontSize:"small"}}/>

      <Tooltip />
    </LineChart>
    </ResponsiveContainer>
    </div>
    </div>
  );}

export default RenderLineChart