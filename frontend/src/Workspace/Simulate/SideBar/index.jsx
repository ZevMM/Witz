import { useState } from 'react'
import './index.css'
import axios from 'axios'

const submitForm = (e, cat, portfolio, setPortfolio) => {
  e.preventDefault()
  let formData = new FormData(e.target)
  formData = Array.from(formData)
  formData = formData.map(([k, v]) => v)
  
  const index = getTaskPos(parseInt(cat), portfolio)
  const copy = [...portfolio]
  portfolio[index].data.push(formData)

  setPortfolio(copy)
  
  e.target.reset()
}

const getTaskPos = (id, portfolio) => {
  return portfolio.findIndex(element => element.id == id)
}

const runSim = (e, setSimData, all, events, setView, levs) => {
  e.preventDefault()
  let numsteps = e.target.numsteps.value
  let type = e.target.type.value
  let rebalance = e.target.rebalance.checked
  let numsims = (type == "montecarlo") ? e.target.numsims.value : 1
  console.log(all)

  let formatted = {}
  let names = {}
  let count = 0
  all.forEach(ele => {
    let s = events[ele.i].subj
    let p = events[ele.i].pct
    if (p > 0) {
      p = ((1+p) ** (1 / ele.w)) - 1
    } else {
      p = -(((1-p) ** (1 / ele.w)) - 1)
    }
    
    
    if (!names[s]) {
      names[s] = count
      count++
    }
    let dur = Array(ele.w).fill(ele.x).map((v,i) => v + i)
    dur.forEach((v) => {
      if (formatted[v]) { formatted[v][names[s]] = p }
      else { formatted[v] = {[names[s]] : p}}
    })
  });
  const ordered = Array(count).fill(0)
  for (const [key, value] of Object.entries(names)) {
    ordered[value] = key
  }
  console.log(formatted)
  axios
  .post('http://localhost:3001/simulate', {levs: levs, events: formatted, names: ordered, numsims: numsims, numsteps: numsteps, rebalance: rebalance})
  .then(response => {
    console.log(response)
    setSimData(response.data)
    setView(type)
  })
}

const limToggle = (lim) => {
  if (lim) {
    return (<div>
      <div className="label">Price</div>
      <input type="number" />
      <div className="label">Expiration (days until)</div>
      <input type="number" />
    </div>)
  }
}



const handleSubmit = (e, id, setID, mevents, mall, setMevents, setMall, mlayout, setMlayout, range) => {
  e.preventDefault()
  let idx = e.target.idx.value
  let pct = e.target.pct.value
  let color = (pct > 0) ? "green" : "red"
  setMevents({...mevents, [`${color}${id}`] : {subj:idx, pct:pct}})
  setMlayout([...mlayout, {x: 0, y: 0, w:1, h:1, i:`${color}${id}`}])
  setMall([...mall, {x: range.startIndex, y: 0, w:1, h:1, i:`${color}${id}`}])
  setID(id + 1)
}

//should query the database to figure out all the names but not gonna add much more so this is fine for now
const indices = ["PNRGINDEXM",	"USEPUINDXD",	"GEPUCURRENT",	"CPIAUCSL",	"CORESTICKM159SFRBATL",	"AMBOR30",	"AMERIBOR",	"MORTGAGE30US",	"FEDFUNDS",	"SP500",	"DJIA",	"APU0000704111",	"DEXUSEU",	"BOGMBASE",	"COMPOUT",	"IHLIDXUSTPSOFTDEVE",	"BBKMGDP",	"WEI",	"ACTLISCOUUS"]


function SideBar({type, portfolio, simprops, levs}) {
  console.log("levs", levs)
  let range, setSimData, mall, mevents, setMall, setMevents, mlayout, setMlayout, setView;
  ({range, setSimData, mall, mevents, setMall, setMevents, mlayout, setMlayout, setView} = simprops)
  const [id, setID] = useState(0)
  const [ismc, setIsmc] = useState(false)
  console.log("mall",mall)
  switch (type) {
    case "Add":
      return (
        <div id="simsidebar" className="sim">
          <h3>Add Event</h3>
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          <form style={{width: "75%"}} onSubmit={(e) => handleSubmit(e, id, setID, mevents, mall, setMevents, setMall, mlayout, setMlayout, range)}>
            <div className="label">Index</div>
            <select className="simselect" name="idx">
              {indices.map(i => (<option value={i}>{i}</option>))}
            </select>
            <div className="label">Percent Change</div>
            <input type="number" name="pct" className="siminput" required/>
            <input type="submit" value="Add" className="siminput"/>
          </form>          
        </div>
      )
    case "Control":
      return (<div id="simsidebar" className='sim' >
          <h3>Control Panel</h3>
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>

          <form style={{width:"75%"}} onSubmit={(e) => runSim(e, setSimData, mall, mevents, setView, levs)}>
          <div className="label">Time Steps</div>
          <input type="number" name="numsteps"  className="siminput" required/>
          <div className="label">Type</div>

          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <input type="radio" id="stack" name="type" value="stack" onClick={() => setIsmc(false)}/>
            <label for="stack" style={{marginLeft:"5px"}}>Stacked</label>
            
          </div>

          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <input type="radio" id="sep" name="type" value="sep" onClick={() => setIsmc(false)}/>
            <label for="sep" style={{marginLeft:"5px"}}>Separate</label>
            
          </div>

          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <input type="radio" id="montecarlo" name="type" value="montecarlo" onClick={() => setIsmc(true)}/>
            <label for="montecarlo" style={{marginLeft:"5px"}}>Monte Carlo</label>
            
          </div>
          {ismc? (<><div className="label">Simulations</div><input name="numsims" className={"siminput"} type="number"/></>)
           : null}



          <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", marginTop:"7px"}}>
          <label for="rebalance" style={{marginRight:"5px"}}>Rebalance?</label>
          <input type="checkbox" name="rebalance" id="rebalance"/>
          
          </div>
          

          <input className={"siminput"} type="submit" value="Run" />
          </form> 
    </div>  )
  }
}

export default SideBar
