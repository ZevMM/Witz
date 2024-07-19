import { useState } from 'react'
import './index.css'

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

const Dropdown = ({options, setFilter, setDrop}) => {

  return (<div style={{position: "absolute", background:"white", padding:"3px", width:"100%", overflowY:"auto", maxHeight:"150px", fontFamily: "Nunito", fontSize:"small", borderRadius:"10px", boxShadow:"0 5px 5px 0 lightgrey"}} >
    {options.map(o => <div className="addTicker" onClick={() => {setFilter(o)
      setDrop(false)
    }}>{o}</div>)}
  </div>)
}

const Stock = ({cat, portfolio, setPortfolio}) => {
  const [filter, setFilter] = useState("")
  const [drop, setDrop] = useState(false)
  const all = ["AAPL", "GOOG", "META", "MSFT", "NVDA", "AMZN", "TSLA"]
  let options = all.filter(a => a.includes(filter))

  if (options.length === 1 && filter !== options[0]) {
    setFilter(options[0])
    setDrop(false)
  }

  return (
  <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio)}>
  <div className="label" >Symbol</div>
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
  <div className="label">Quantity</div>
  <input type="number" name="Quantity"  autoComplete='off' required/>
  <div className="label">Leverage</div>
  <input type="number" name="Price"  autoComplete='off' required/>
  <input type={"submit"} value="Add" />
  </form>
)}

const Debt = ({cat, portfolio, setPortfolio}) => {
  return (
  <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio)}>
  <div className="label">Interest</div>
  <input name="Interest" required/>
  <div className="label">Principal</div>
  <input name="Principal" required/>
  <div className="label">Term</div>
  <input name="Term" required/>
  <input type={"submit"} value="Add" />
  </form>
)}

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

const Inputs = (cat, portfolio, setPortfolio) => {
  switch (cat) {
    case "1":
      return <Stock cat={cat} portfolio={portfolio} setPortfolio={setPortfolio}/>
    case "2":
      return <Bond cat={cat} portfolio={portfolio} setPortfolio={setPortfolio} />
    case "3":
      return <Debt cat={cat} portfolio={portfolio} setPortfolio={setPortfolio}/>
  }
}

function SideBar({type, portfolio, setPortfolio}) {
  const [cat, setCat] = useState("1")
  if (type == 'Add') {
    return (
      <div id="constructsidebar" className="construct">
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
        {Inputs(cat, portfolio, setPortfolio)}
      </div>
    )
  }
}

export default SideBar
