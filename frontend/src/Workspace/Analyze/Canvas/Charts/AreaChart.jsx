import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import axios from 'axios';
import { useState, useEffect } from 'react';

const CheckboxDropdown = ({all, assets, setAssets}) => {
    
  return(
  <div style={{position:"absolute", top:"20px", background:"white", width:"120%", borderRadius:"10px", boxShadow:"0px 5px 5px #888", zIndex:"5"}}>
      <div style={{maxHeight:"150px", overflowY:"auto", fontSize: "12px", color:"#666666", display:"flex", flexDirection:"column"}}>
      {
          all.map(a => {

              const isChecked = assets.includes(a)

              if (isChecked) {
                  return(
                      <div>
                          <input type="checkbox" id={`tst${a}`} onChange={(e) => {
                              setAssets(assets.filter(b => b != a))}} checked/>
                          <label for={`tst${a}`}>{a}</label>
                      </div>
                  )
              }
              
              return(
                  <div>
                      <input type="checkbox" id={`tst${a}`} onChange={(e) => {

                          setAssets([...assets, a])}
                       } />
                      <label for={`tst${a}`}>{a}</label>
                  </div>
              )

          })
      }
      
      </div>
  </div>
)}

const AssetSelect = ({filter, setFilter, allnames, active, setActive}) => {
  const [showDrop, setShowDrop] = useState(false)

  return (
  <div style={{position:"relative", display:"flex", alignItems:"center", marginLeft:"30px", height:"20px"}}
  onFocus={() => {
      setFilter("")
      setShowDrop(true)
  }}
  onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
          setFilter("Select")
          setShowDrop(false)
      }
      }} tabIndex={-1}>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} style={{width:"80px", borderRadius:"0", border:"1px solid rgb(102, 102, 102)", color: "rgb(102, 102, 102)", fontSize:"12px", height:"20px", paddingLeft: "4px" }} />
      
      {showDrop? <CheckboxDropdown all={allnames.filter(a => a.includes(filter))} assets={active} setAssets={setActive}/> : null}
  </div>
)}

const RenderAreaChart = ({portfolio}) => {
  const [data, setData] = useState(null)
  const [showing, setShowing] = useState(null)
  const [allnames, setAllNames] = useState([])
  const [active, setActive] = useState([])
  const [filter, setFilter] = useState('Select')

  useEffect(() => {
    axios.get('https://witz-zjkz.onrender.com/myportfolio')
    .then(response => {
      setAllNames(response.data)
      setActive(response.data.slice(0,5))
    })
  }, [])

  useEffect(() => {
    axios
    .post('https://witz-zjkz.onrender.com/areachart', portfolio)
    .then(response => {
        setData(response.data)
        setShowing(response.data)
    })
  }, [])

    const colors = ["#024959ff", "#f2e205ff", "#f2b705ff", "#f28705ff", "#f26430ff", "#f29c50ff", "#99d9f2ff", "#5eadf2ff", "#0476d9ff", "#0460d9ff"]


    return (
        <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>

          <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)", display:"flex", flexDirection:"row", alignItems:"center"}}>
            <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Value by Asset
            
            <AssetSelect filter={filter} setFilter={setFilter} allnames={allnames} active={active} setActive={setActive}/>

            <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color: "#666666"}} name="range" id="range" onChange={(e) => setShowing(data.slice(parseInt(e.target.value)))}>
              <option value="-60">5Y</option>
              <option value="-36">3Y</option>
              <option value="-12">1Y</option>
            </select>

          </div>

        <div style={{flex:"1", minHeight: 0}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={showing}
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
            {active.map((s, i) => <Area type="linear" dataKey={s} stackId="1" stroke={colors[i % colors.length]} fill={colors[i % colors.length]}/>)}
            <Legend iconType="circle" />
          </AreaChart>
        </ResponsiveContainer>
        </div>

        </div>
      );
    }

export default RenderAreaChart