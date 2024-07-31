import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';


const RenderRiskChart = ({portfolio}) => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    axios
    .get('http://localhost:3001/riskpiechart')
    .then(response => {
        console.log(response.data)
        setData(response.data)
    })
    }, [])
  
  if (!data) {
    return (<div>Loading...</div>)
  }

  return (

  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{color: "black", padding:"10px", flex:"0", margin:"3px", backgroundColor:"#f3f3f3ff", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
   <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span>
   Risk Allocation
   <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666"}} name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
    </select>
  </div>


  <div style={{flex:"1", minHeight: 0, display:"flex"}}>
    <div style={{color: "black", padding:"5px", flex:"0", display:"flex", justifyContent:"space-around", paddingTop:"15%", paddingBottom:"15%", flexDirection:"column"}}>
          <div style={{display:"flex", alignItems:"center"}}><span class="dot" style={{backgroundColor:"#f5804a", marginRight:"5px"}}></span>Key</div>
          <div style={{display:"flex", alignItems:"center"}}><span class="dot" style={{backgroundColor:"#d24c84", marginRight:"5px"}}></span>Key</div>
          <div style={{display:"flex", alignItems:"center"}}><span class="dot" style={{backgroundColor:"#ffdb44", marginRight:"5px"}}></span>Key</div>
    </div>

    <div style={{flex:"1", minHeight: 0}}>
    <ResponsiveContainer width="100%" height="100%">
    <PieChart width="100%" height="100%">
      <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={"65%"} fill="#f5804a" />
      <Tooltip />
    </PieChart>
    </ResponsiveContainer>
    </div>
    </div>
    </div>
);}


export default RenderRiskChart