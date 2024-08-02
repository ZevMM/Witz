import { useState} from 'react'
import axios from 'axios'
import './index.css'

const NavElement = ({text}) => <span className="navelement">{text}</span>

const FileMenu = ({cur, setCur, setPortfolio, setLevs}) => {
  if (cur == 'file') {
    return(
      <div style={{position:"absolute", zIndex:"5", background:"white", color:"black", padding:"4px 8px 4px 4px", borderRadius:"1px", boxShadow:"0px 5px 5px #888"}}>
        <div>
        <label for="import" style={{margin:"20px 10px 10px 10px"}}>Import Portfolio</label>
        <input type="file" style={{opacity:0, position:"absolute"}} id="import" onChange={(e) => handleImport(e, setCur, setPortfolio, setLevs)}/>
        </div>
        <div>
        <label style={{margin:"10px"}}>Import Simulation</label>
        </div>
        <div>
        <label style={{margin:"10px"}}>Download Portfolio</label>
        </div>
        <div>
        <label style={{margin:"10px"}}>Download Simulation</label>
        </div>
        
      </div>
    )
  }
}

/*
([
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
*/

const handleImport = (e, setCur, setPortfolio, setLevs) => {
  axios
  .post('http://localhost:3001/adduser', {name: "user123"})
  .then(() => {var reader = new FileReader();
  reader.readAsText(e.target.files[0], "UTF-8");
  reader.onload = (e) => {
    let portfolio = JSON.parse(e.target.result)
    setPortfolio(portfolio)
    let levs = []
    portfolio.forEach((a) => {
      
      if (a.data.length > 1) {
        a.data.slice(1).forEach((r) => {
          axios.post('http://localhost:3001/portfolioAdd', {cat: a.alt, data: r})
          .then(levs.push(r[3]))
        })
      }
    })
    setLevs(levs)
  }})
  setCur("") 
}

const Tools = ({cur, setCur, setPortfolio, setLevs}) => {
  let [uploading, setUploading] = useState(false)
  return (
  <span className="navelement" style={{display: "flex", flexDirection:"row", alignItems:"center"}}>
    <div className="navelement"
      style={(cur == 'file' ? {color:"black"}:{})}
      onBlur={(e) => console.log(e.relatedTarget)}
      >
      <span onClick={() => {cur =='file' ? setCur("") : setCur("file")}} style={cur == 'file' ? {background:"white", padding:"2px 5px 5px 5px", borderRadius:"1px", boxShadow:"0px 5px 5px #888"}:{padding:"5px"} }>File</span>
      <FileMenu cur={cur} setCur={setCur} setPortfolio={setPortfolio} setLevs={setLevs}/>
    </div>
    <div className="navelement"><span style={{padding:"5px"}}>View</span></div>
    <span className="navelement"><span style={{padding:"5px"}}>Settings</span></span>
    <span className="navelement"><span style={{padding:"5px"}}>Help</span></span>
  </span>
  )
}

const toggleCur = (n, cur, setCur) => {
  if (n==cur) {
    setCur("")
  } else {setCur(n)}
}

const Left = ({cur, setCur, setPortfolio, setLevs}) => {
  return (
    <div className = "navelement" style={{display: "flex", flexDirection:"row", alignItems:"center", padding:"20px"}}>
      <span id="logo">Witz</span>
      <Tools cur={cur} setCur={setCur} setPortfolio={setPortfolio} setLevs={setLevs}/>
    </div>
  )
}

function NavBar({full, setPortfolio, setLevs}) {
  let [cur, setCur] = useState('')
  if (full) {return}

  return (
    <div id="navbar">
      <Left cur={cur} setCur={setCur} setPortfolio={setPortfolio} setLevs={setLevs} />
      <NavElement text='Account'/>
    </div>
  )
}

export default NavBar
