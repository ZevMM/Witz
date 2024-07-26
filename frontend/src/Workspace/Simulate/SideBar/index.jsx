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

const runSim = (setSimData, portfolio, all, events) => {
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
  .post('http://localhost:3001/simulate', {portfolio: portfolio, events: formatted, names: ordered})
  .then(response => {
    console.log(response)
    setSimData(response.data)
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

const addMevent = (e) => {
  e.preventDefault
  console.log(e.target.value)

}

function SideBar({type, portfolio, setSimData, pall, pevents, mall, mevents, setPall, setMall, setPevents, setMevents}) {
  const [cat, setCat] = useState("1")
  const [lim, setLim] = useState(false)
  console.log("mall",mall)
  switch (type) {
    case "Add":
      return (
        <div id="simsidebar" className="sim">
          <h3>Add Event</h3>
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          <div style={{ fontFamily:"Nunito"}}>Macro Event</div>
          <form style={{width: "75%"}}>
            <div className="label">Index</div>
            <select onChange={(e) => setCat(e.target.value)}>
              <option value="1">Stock</option>
              <option value="2">Bond</option>
              <option value="3">Debt</option>
            </select>
            <div className="label">Percent Change</div>
            <input type="number" />
            <input type="submit" value="Add" onClick={(e) => addMevent(e)}/>
          </form>

          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>

          <div style={{ fontFamily:"Nunito"}}>Portfolio Event</div>
          <form style={{width: "75%"}}>
            <div className="label">Asset</div>
            <select onChange={(e) => setCat(e.target.value)}>
              <option value="1">Stock</option>
              <option value="2">Bond</option>
              <option value="3">Debt</option>
            </select>
            <div className="label">Quantity</div>
            <input type="number" />

            <div className="label">Side</div>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"start"}}>
              <div style={{display:"flex", flexDirection:"row", alignItems: "center", marginLeft:"10%"}}>
                <input type="radio" id="buy" name="side" value="buy" />
                <label for="buy">Buy</label>
              </div>
              <div style={{display:"flex", flexDirection:"row", alignItems: "center", marginLeft:"10%"}}>
                <input type="radio" id="sell" name="side" value="sell" />
                <label for="sell">Sell</label>
              </div>
            </div>

            <div className="label">Type</div>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"start"}}>
              <div style={{display:"flex", flexDirection:"row", alignItems: "center", marginLeft:"10%"}}>
                <input type="radio" id="market" name="type" value="market" onClick={()=>setLim(false)}/>
                <label for="market">Market</label>
              </div>
              <div style={{display:"flex", flexDirection:"row", alignItems: "center", marginLeft:"10%"}}>
                <input type="radio" id="limit" name="type" value="limit" onClick={()=>setLim(true)}/>
                <label for="limit">Limit</label>
              </div>
            </div>
              {limToggle(lim)}

            <input type="submit" value="Add"/>
          </form>
          
        </div>
      )
    case "Control":
      return (<div id="simsidebar">
          <h3>Control Panel</h3>
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          <div className="label">Start</div>
          <input type="date" name="Start" required/>
          <div className="label">End</div>
          <input type="date" name="End" required/>
          <div className="label">Step Size (days)</div>
          <input type="number" name="Step" required/>
          <input type={"submit"} value="Set" />
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          <button onClick={() => runSim(setSimData, portfolio, mall, mevents)}>Run</button>
      </div>)
  }
}

export default SideBar
