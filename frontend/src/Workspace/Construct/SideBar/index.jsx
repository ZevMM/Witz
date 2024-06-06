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

const Stock = ({cat, portfolio, setPortfolio}) => {
  return (
  <form style={{display: "flex", flexDirection: "column", width: "75%"}} onSubmit={(e) => submitForm(e, cat, portfolio, setPortfolio)}>
  <div className="label">Symbol</div>
  <input name="Symbol" required/>
  <div className="label">Quantity</div>
  <input name="Quantity" required/>
  <div className="label">Price</div>
  <input name="Price" required/>
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
  <div className="label">Term</div>
  <input name="Term" required/>
  <div className="label">Quantity</div>
  <input name="Quantity" required/>
  <div className="label">Price</div>
  <input name="Price" required/>
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
