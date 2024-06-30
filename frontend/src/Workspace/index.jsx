import { useState, useEffect } from 'react'
import './index.css'
import Analyze from './Analyze'
import Visualize from './Visualize'
import Simulate from './Simulate'
import Construct from './Construct'

function Workspace({mode, full, setFull}) {

  const [portfolio, setPortfolio] = useState([
    { id: 1, title: "Stocks", data: [["Symbol", "Quantity", "Leverage"]], open: true},
    { id: 2, title: "Bonds", data: [["Term", "Quantity", "Price"]], open: true},
    { id: 3, title: "Debt", data: [["Interest", "Principal", "Term"]], open: true},
    { id: 4, title: "Cryptocurrency", data: [["Interest", "Principal", "Term"]], open: true}
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
      return <Simulate />
  }
}

export default Workspace
