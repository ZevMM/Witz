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

function SideBar({type, portfolio, setSimData, all, events}) {
  const [cat, setCat] = useState("1")
  switch (type) {
    case "Add":
      return (
        <div id="simsidebar" className="sim">
          <h3>Add Holding</h3>
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
          <form style={{width: "75%"}}>
            <div className="label">Category</div>
            <select onChange={(e) => setCat(e.target.value)}>
              <option value="1">Stock</option>
              <option value="2">Bond</option>
              <option value="3">Debt</option>
            </select>
          </form>
          <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
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
          <button onClick={() => runSim(setSimData, portfolio, all, events)}>Run</button>
      </div>)
  }
}

export default SideBar
