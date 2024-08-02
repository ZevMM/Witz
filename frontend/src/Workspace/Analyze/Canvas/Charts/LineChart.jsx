import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, YAxis, XAxis, Legend } from 'recharts';
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
const colors = ["#23438a", "#5d439c", "#ffc658", "#d24c84", "#a4479f", "#23438a", "#5d439c"]

const RenderLineChart = ({portfolio}) => {
  const [data, setData] = useState(null)
  const [showing, setShowing] = useState(null)
  const [allnames, setAllNames] = useState([])
  const [active, setActive] = useState([])
  const [filter, setFilter] = useState('Select')
  
  useEffect(() => {
    axios.get('http://localhost:3001/myportfolio')
    .then(response => {
      setAllNames(response.data)
      setActive(response.data.slice(0,5))
    })
  }, [])

  useEffect(() => {
    axios
    .post('http://localhost:3001/linegraph', portfolio)
    .then((response) => {
      setData(response.data)
      setShowing(response.data)
    })
  }, [])

  if (!data) {
    return
  }

  return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)", display:"flex", flexDirection:"row", alignItems:"center"}}>
   <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Normalized Asset Values
    <AssetSelect filter={filter} setFilter={setFilter} allnames={allnames} active={active} setActive={setActive} />
    
    <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color: "#666666"}} name="range" id="range" onChange={(e) => setShowing(data.slice(parseInt(e.target.value)))}>
              <option value="-60">5Y</option>
              <option value="-36">3Y</option>
              <option value="-12">1Y</option>
    </select>
  
  </div>
  <div style={{flex:"1", minHeight: 0}}>
    <ResponsiveContainer width="100%" height="100%">
    <LineChart data={showing} margin={{ top: 0, right: 5, bottom: 0, left: -10 }}>
      {active.map((k, i)=> <Line type="linear" dataKey={k} stroke={colors[i % colors.length]} dot={false}/>)}
      
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
      <YAxis style={{fontSize:"small"}}/>
      <Legend iconType='circle'/>
      <Tooltip />
    </LineChart>
    </ResponsiveContainer>
    </div>
    </div>
);}

const RenderReturnChart = ({portfolio}) => {
  const [data, setData] = useState(null)
  const [start, setStart] = useState('2019-07-01')
  const [allnames, setAllNames] = useState([])
  const [active, setActive] = useState([])
  const [filter, setFilter] = useState('Select')
  
  useEffect(() => {
    axios.get('http://localhost:3001/myportfolio')
    .then(response => {
      setAllNames(response.data)
      setActive(response.data.slice(0,7))
    })
  }, [])

  useEffect(() => {
    axios
    .get(`http://localhost:3001/returngraph/${start}`)
    .then((response) => {
      setData(response.data)
    })
  }, [start])

  if (!data) {
    return
  }

  return (
  <div style={{display:"flex", width:"100%", height:"100%", flexDirection:"column"}}>
  <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)", display:"flex", flexDirection:"row", alignItems:"center"}}>
   <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Asset Returns
    <AssetSelect filter={filter} setFilter={setFilter} allnames={allnames} active={active} setActive={setActive} />
    
    <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color: "#666666"}} name="range" id="range" onChange={(e) => setStart((e.target.value))}>
              <option value="2019-07-01">5Y</option>
              <option value="2021-07-01">3Y</option>
              <option value="2023-07-01">1Y</option>
    </select>
  
  </div>
  <div style={{flex:"1", minHeight: 0}}>
    <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 0, right: 5, bottom: 0, left: -10 }}>
      {active.map((k, i)=> <Line type="linear" dataKey={k} stroke={colors[i % colors.length]} dot={false}/>)}
      
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="date" fontSize={"small"} minTickGap={40} interval={"equidistantPreserveStart"}/>
      <YAxis style={{fontSize:"small"}}/>
      <Legend iconType='circle'/>
      <Tooltip />
    </LineChart>
    </ResponsiveContainer>
    </div>
    </div>
);}

export {RenderLineChart, RenderReturnChart}