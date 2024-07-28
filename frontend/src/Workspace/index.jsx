import { useState, useEffect } from 'react'
import './index.css'
import Analyze from './Analyze'
import Simulate from './Simulate'
import Construct from './Construct'

function Workspace({mode, full, setFull}) {

  const [mall, setMall] = useState([])
  const [view, setView] = useState("sep")
  const [mlayout, setMlayout] = useState([...mall])
  const [mevents, setMevents] = useState({})
  const [simData, setSimData] = useState(Array(50).fill({
      "name": "Page A",
      "value": 0,
  }))
  const [range, setRange] = useState({startIndex: 0, endIndex: 50})
  const simprops = {mall: mall, setMall: setMall, view: view, setView: setView, mlayout: mlayout, setMlayout: setMlayout, mevents: mevents, setMevents: setMevents, simData: simData, setSimData: setSimData, range: range, setRange: setRange}

  const [portfolio, setPortfolio] = useState([
    { id: 1, alt: "1", title: "Bonds", data: [["Type", "Principal", "Date", "Leverage"]], open: true},
    { id: 2, alt: "commodities", title: "Commodities", data: [["Term", "Quantity", "Price"]], open: true},
    { id: 3, alt:"crypto", title: "Cryptocurrency", data: [["Interest", "Principal", "Term"]], open: true},
    { id: 4, alt:"currency", title: "Currency", data: [["Interest", "Principal", "Term"]], open: true},
    { id: 5, alt:"ETFs", title: "Exchange Traded Funds", data: [["Symbol", "Quantity", "Leverage"]], open: true},
    { id: 6, alt:"6", title: "Hedge Funds", data: [["Name", "Principal", "Date", "Leverage"]], open: true},
    { id: 7, alt:"mutualfunds", title: "Mutual Funds", data: [["Name", "Principal", "Date", "Leverage"]], open: true},
    { id: 8, alt:"realestate", title: "Real Estate", data: [["Region", "Principal", "Date", "Leverage"]], open: true},
    { id: 9, alt:"stocks", title: "Stocks", data: [["Symbol", "Quantity", "Leverage"]], open: true},
  ])

  const [localStorage, setLocalStorage] = useState(null) //TO-DO. add to when data is requested, reset when portfolio is updated

  const [report, setReport] = useState({
    data0 : null,
    data1 : null,
    data2 : null,
    data3 : null,
    data4 : null,
    data5 : null,
    data6 : null
  })

  const [layout, setLayout] = useState([
  ])

  const [isUpdated, setIsUpdated] = useState(false)

  useEffect(() => setIsUpdated(false), [portfolio])

  switch (mode) {
    case "Construct":
      return <Construct full={full} setFull={setFull} portfolio={portfolio} setPortfolio={setPortfolio}/>
    case "Analyze":
      return <Analyze isUpdated= {isUpdated} layout={layout} setLayout={setLayout} full={full} setFull={setFull} portfolio={portfolio} setIsUpdated={setIsUpdated} report={report} setReport={setReport}/>
    case "Simulate":
      return <Simulate full={full} setFull={setFull} report={report} portfolio={portfolio} simprops={simprops}/>
  }
}

export default Workspace
