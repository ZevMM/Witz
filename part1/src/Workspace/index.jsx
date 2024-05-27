import { useState } from 'react'
import './index.css'
import Analyze from './Analyze'
import Visualize from './Visualize'
import Simulate from './Simulate'
import Construct from './Construct'

function Workspace({mode, full, setFull}) {

  const [portfolio, setPortfolio] = useState([
    { id: 1, title: "Stocks", data: [["Symbol", "Quantity", "Price"],["AAPL", 1000, 200],["NVDA", 9000, 150]], open: true},
    { id: 2, title: "Bonds", data: [["Term", "Quantity", "Price"],["5-year", 200, 1000]], open: true},
    { id: 3, title: "Debt", data: [["Interest", "Principal", "Term"],["3.5%", 5000, "10-year"]], open: true},
    { id: 4, title: "Cryptocurrency", data: [["Interest", "Principal", "Term"]], open: true}
  ])

  switch (mode) {
    case "Construct":
      return <Construct full={full} setFull={setFull} portfolio={portfolio} setPortfolio={setPortfolio}/>
    case "Visualize":
      return <Visualize />
    case "Analyze":
      return <Analyze />
    case "Simulate":
      return <Simulate />
  }
}

export default Workspace
