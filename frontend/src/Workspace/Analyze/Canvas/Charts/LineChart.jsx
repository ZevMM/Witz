import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';

const RenderLineChart = ({data}) => {return (
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
      <Line type="monotone" dataKey="uv" stroke="#feb570ff" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <YAxis style={{fontSize:"small"}}/>

      <Tooltip />
    </LineChart>
    </ResponsiveContainer>
    </div>
    </div>
  );}

export default RenderLineChart