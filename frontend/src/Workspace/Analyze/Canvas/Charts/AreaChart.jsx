import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];


const RenderAreaChart = () => {
    return (
        <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
        <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
         <span style={{color: "black", paddingRight:"10px"}}>⁝⁝</span> Value by Sector
         <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color: "#666666"}} name="cars" id="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
          </select>
          <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color: "#666666"}} name="cars" id="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
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
            <XAxis dataKey="name" style={{fontSize: "small"}}/>
            <YAxis style={{fontSize: "small"}}/>
            <Tooltip />
            <Area type="monotone" dataKey="uv" stackId="1" stroke="#23438a" fill="#23438a" />
            <Area type="monotone" dataKey="pv" stackId="1" stroke="#5d439c" fill="#5d439c" />
            <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" />
          </AreaChart>
        </ResponsiveContainer>
        </div>

        
        <div style={{color: "black", padding:"5px", flex:"0", display:"flex", justifyContent:"space-around", alignItems:"center", paddingLeft:"10%", paddingRight:"10%"}}>
          <div><span class="dot" style={{backgroundColor:"#d24c84", marginRight:"5px"}}></span>Key</div>
          <div><span class="dot" style={{backgroundColor:"#a4479f", marginRight:"5px"}}></span>Key</div>
          <div><span class="dot" style={{backgroundColor:"#5d439c", marginRight:"5px"}}></span>Key</div>
          <div><span class="dot" style={{backgroundColor:"#23438a", marginRight:"5px"}}></span>Key</div>
        </div>


        </div>
      );
    }

export default RenderAreaChart