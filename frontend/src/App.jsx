import { useState, useEffect } from 'react'
import './App.css'
import NavBar from './NavBar'
import ModeBar from './ModeBar'
import Workspace from './Workspace'
import axios from 'axios'

function App() {

  const [mode, setMode] = useState('')
  const [full, setFull] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Run your cleanup or logging function here
      console.log('Window is closing!');

      axios
      .post('http://localhost:3001/deleteuser', {name: "user123"})
      
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

  }, []);

  useEffect(() => {
      axios
      .post('http://localhost:3001/adduser', {name: "user123"})
  }, []);

  const [mall, setMall] = useState(Array(50).fill(0).map((a,i) => { return {
    "w": 1,
    "h": 1,
    "x": i,
    "y": 0,
    "i": `invis${i}`,
    "moved": false,
    "static": true
}}))
  const [view, setView] = useState("sep")
  const [mlayout, setMlayout] = useState( Array(50).fill(0).map((a,i) => { return {
    "w": 1,
    "h": 1,
    "x": i,
    "y": 0,
    "i": `invis${i}`,
    "moved": false,
    "static": true
}}))
  const [mevents, setMevents] = useState({})
  const [simData, setSimData] = useState(Array(50).fill({
      "name": "Page A",
      "value": 0,
  }))
  const [range, setRange] = useState({startIndex: 0, endIndex: 50})


  const simprops = {mall: mall, setMall: setMall, view: view, setView: setView, mlayout: mlayout, setMlayout: setMlayout, mevents: mevents, setMevents: setMevents, simData: simData, setSimData: setSimData, range: range, setRange: setRange}
  const [levs, setLevs] = useState([])
  const [portfolio, setPortfolio] = useState([
    { id: 1, alt: "1", title: "Bonds", data: [["Type", "Principal", "Date", "Leverage"]], open: true},
    { id: 2, alt: "commodities", title: "Commodities", data: [["Term", "Principal", "Date", "Leverage"]], open: true},
    { id: 3, alt:"crypto", title: "Cryptocurrency", data: [["Name", "Principal", "Date", "Leverage"]], open: true},
    { id: 4, alt:"currency", title: "Currency", data: [["Symbol", "Principal", "Date", "Leverage"]], open: true},
    { id: 5, alt:"ETFs", title: "Exchange Traded Funds", data: [["Symbol", "Principal", "Date", "Leverage"]], open: true},
    { id: 6, alt:"6", title: "Hedge Funds", data: [["Name", "Principal", "Date", "Leverage"]], open: true},
    { id: 7, alt:"mutualFunds", title: "Mutual Funds", data: [["Name", "Principal", "Date", "Leverage"]], open: true},
    { id: 8, alt:"realEstate", title: "Real Estate", data: [["Region", "Principal", "Date", "Leverage"]], open: true},
    { id: 9, alt:"monthlyStock", title: "Stocks", data: [["Symbol", "Principal", "Date", "Leverage"]], open: true},
  ])

  return (
    <div id="container">
      <NavBar full={full} setPortfolio={setPortfolio} setLevs={setLevs}/>
      <ModeBar mode={mode} setMode={setMode} full={full}/>
      <Workspace mode={mode} full={full} setFull={setFull} simprops={simprops} levs={levs} setLevs={setLevs} portfolio={portfolio} setPortfolio={setPortfolio}/>
    </div>
  )
}

export default App
