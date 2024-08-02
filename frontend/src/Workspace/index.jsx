import { useState, useEffect } from 'react'
import './index.css'
import Analyze from './Analyze'
import Simulate from './Simulate'
import Construct from './Construct'

function Workspace({mode, full, setFull, simprops, levs, setLevs, portfolio, setPortfolio}) {

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

  const [layout, setLayout] = useState([])

  const [isUpdated, setIsUpdated] = useState(false)

  useEffect(() => setIsUpdated(false), [portfolio])

  switch (mode) {
    case "Construct":
      return <Construct full={full} setFull={setFull} portfolio={portfolio} setPortfolio={setPortfolio} levs={levs} setLevs={setLevs}/>
    case "Analyze":
      return <Analyze isUpdated= {isUpdated} layout={layout} setLayout={setLayout} full={full} setFull={setFull} portfolio={portfolio} setIsUpdated={setIsUpdated} report={report} setReport={setReport}/>
    case "Simulate":
      return <Simulate full={full} setFull={setFull} report={report} portfolio={portfolio} simprops={simprops} levs={levs}/>
  }
}

export default Workspace
