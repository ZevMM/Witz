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
} from 'recharts';

const RenderBarChart = ({data}) => {return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
   <span style={{color: "black", paddingRight:"10px"}}>⁝⁝</span> Value by Sector
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
        <Bar dataKey="pv" fill="#d24c8499" stackId="stack" />
        <Bar dataKey="uv" fill="#f5804a99" stackId="stack" />
      </BarChart>
    </ResponsiveContainer>
    </div>
    </div>
);}

export default RenderBarChart