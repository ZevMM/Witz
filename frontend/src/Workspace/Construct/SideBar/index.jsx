import { useState, useEffect } from 'react'
import './index.css'
import axios from 'axios'

const submitForm = (e, cat, portfolio, setPortfolio, setFilter) => {
  e.preventDefault()
  let formData = new FormData(e.target)
  formData = Array.from(formData)
  formData = formData.map(([k, v]) => v)
  
  const index = getTaskPos(cat, portfolio)
  const copy = [...portfolio]
  portfolio[index].data.push(formData)

  setPortfolio(copy)

  axios.post('http://localhost:3001/portfolioAdd', {cat: cat, data: formData})

  e.target.reset()
  setFilter("")
}

const getTaskPos = (id, portfolio) => {
  return portfolio.findIndex(element => element.alt == id)
}

const Dropdown = ({options, setFilter, setDrop}) => {

  return (<div style={{position: "absolute", background:"white", padding:"3px", width:"100%", overflowY:"auto", maxHeight:"150px", fontFamily: "Nunito", fontSize:"small", borderRadius:"10px", boxShadow:"0 5px 5px 0 lightgrey"}} >
    {options.map(o => <div className="addTicker" onClick={() => {setFilter(o)
      setDrop(false)
    }}>{o.replaceAll('_',' ')}</div>)}
  </div>)
}


const Bond = ({cat, portfolio, setPortfolio}) => {
  return (
  <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio)}>
  <div className="label">Par Value</div>
  <input type="number" name="Par Value" required/>
  <div className="label">Coupon</div>
  <input type="number" name="Coupon" required/>
  <div className="label">Maturity Date</div>
  <input type="date" name="Maturity Date" required/>
  <input type={"submit"} value="Add" />
  </form>
)}


const Inputs = ({all, cat, portfolio, setPortfolio}) => {

  const [filter, setFilter] = useState("")
  const [drop, setDrop] = useState(false)



  let options = all.filter(a => a.includes(filter))

  if (options.length === 1 && filter !== options[0]) {
    setFilter(options[0])
    setDrop(false)
  }

  if (cat == "realEstate") {
    return (
      <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio, setFilter)}>
      <div className="label">Region</div>
      <div onFocus={() => setDrop(true)}
      onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              console.log(e.currentTarget, e.relatedTarget)
              setDrop(false)
            }
            }} tabindex="-1"
          style={{position:"relative"}}>
      <input name="Symbol" id="Symbol" value={filter} onChange={(e) => setFilter(e.target.value)} autoComplete='off'/>
      {drop? <Dropdown options={options} setFilter={setFilter} setDrop={setDrop}/> : null}
      </div>
      <div className="label">Principal</div>
      <input type="number" name="Quantity"  autoComplete='off' required/>
      <div className="label">Date</div>
      <input type="date" name="date"  autoComplete='off' min='2019-07-01' max='2024-06-30' required/>
      <div className="label">Leverage</div>
      <input type="number" name="Price"  autoComplete='off' required/>
      <input type={"submit"} value="Add" />
      </form>
  )}

  if (cat == "6") {
    return (
      <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio, setFilter)}>
      <div className="label">Name</div>
      <div onFocus={() => setDrop(true)}
      onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              console.log(e.currentTarget, e.relatedTarget)
              setDrop(false)
            }
            }} tabindex="-1"
          style={{position:"relative"}}>
      <input name="Symbol" id="Symbol" value={filter} onChange={(e) => setFilter(e.target.value)} autoComplete='off'/>
      {drop? <Dropdown options={options} setFilter={setFilter} setDrop={setDrop}/> : null}
      </div>
      <div className="label">Principal</div>
      <input type="number" name="Quantity"  autoComplete='off' required/>
      <div className="label">Date</div>
      <input type="date" name="date"  autoComplete='off' min='2019-07-01' max='2024-06-30' required/>
      <div className="label">Leverage</div>
      <input type="number" name="Price"  autoComplete='off' required/>
      <input type={"submit"} value="Add" />
      </form>
  )}

  if (cat == "1") {
    return (
      <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio, setFilter)}>
      <div className="label">Type</div>
      <div onFocus={() => setDrop(true)}
      onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              console.log(e.currentTarget, e.relatedTarget)
              setDrop(false)
            }
            }} tabindex="-1"
          style={{position:"relative"}}>
      <input name="Symbol" id="Symbol" value={filter} onChange={(e) => setFilter(e.target.value)} autoComplete='off'/>
      {drop? <Dropdown options={options} setFilter={setFilter} setDrop={setDrop}/> : null}
      </div>
      <div className="label">Principal</div>
      <input type="number" name="Quantity"  autoComplete='off' required/>
      <div className="label">Date</div>
      <input type="date" name="date"  autoComplete='off' min='2019-07-01' max='2024-06-30' required/>
      <div className="label">Leverage</div>
      <input type="number" name="Price"  autoComplete='off' required/>
      <input type={"submit"} value="Add" />
      </form>
  )}

  return (
  <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio, setFilter)}>
  <div className="label" >Symbol</div>
  <div onFocus={() => setDrop(true)}
  onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setDrop(false)
        }
        }} tabindex="-1"
      style={{position:"relative"}}>
  <input name="Symbol" id="Symbol" value={filter} onChange={(e) => setFilter(e.target.value)} autoComplete='off'/>
  {drop? <Dropdown options={options} setFilter={setFilter} setDrop={setDrop}/> : null}
  </div>
  <div className="label">Principal</div>
  <input type="number" name="Quantity"  autoComplete='off' required/>
  <div className="label">Date</div>
  <input type="date" name="date"  autoComplete='off' min='2019-07-01' max='2024-06-30' required/>
  <div className="label">Leverage</div>
  <input type="number" name="Price"  autoComplete='off' required/>
  <input type={"submit"} value="Add" />
  </form>
  )

}

function SideBar({type, portfolio, setPortfolio}) {
  const [cat, setCat] = useState("monthlyStock")
  const [all, setAll] = useState([])

  useEffect(() => {
    axios
    .get(`http://localhost:3001/${cat}`)
    .then(response => {
        setAll(response.data)
    })
    }, [cat])
  if (type == 'Add') {
    return (
      <div id="constructsidebar" className="construct">
        <h3>Add Holding</h3>
        <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
        <form style={{width: "75%"}}>
          <div className="label">Category</div>
          <select onChange={(e) => setCat(e.target.value)}>
            
            <option value="1">Bonds</option>
            <option value="commodities">Commodities</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="currency">Currency</option>
            <option value="ETFs">Exchange Traded Funds</option>
            <option value="6">Hedge Funds</option>
            <option value="mutualFunds">Mutual Funds</option>
            <option value="realEstate">Real Estate</option>
            <option value="monthlyStock">Stocks</option>
            
          </select>
        </form>
        <div style={{ borderTop: "1px solid black ", width: 100, height: 2, marginTop: "15px", marginBottom: "15px"}}></div>
        <Inputs all={all} cat={cat} portfolio={portfolio} setPortfolio={setPortfolio} />
      </div>
    )
  }
}

export default SideBar
