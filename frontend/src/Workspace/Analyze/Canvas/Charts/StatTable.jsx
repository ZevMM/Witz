import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'


const CheckboxDropdown = ({all, assets, setAssets}) => {
    
    return(
    <div style={{position:"absolute", top:"20px", background:"white", width:"100%", borderRadius:"10px", boxShadow:"0px 5px 5px #888"}}>
        <div style={{maxHeight:"150px", overflowY:"auto", fontSize: "12px", color:"#666666", display:"flex", flexDirection:"column"}}>
        {
            all.map(a => {

                const isChecked = assets.filter(b => b[0] === a[0])

                if (isChecked.length > 0) {
                    return(
                        <div>
                            <input type="checkbox" id={`tst${a[0]}`} onChange={(e) => {
                                setAssets(assets.filter(b => b[0] !== a[0]))}} checked/>
                            <label for={`tst${a[0]}`}>{a[0]}</label>
                        </div>
                    )
                }
                
                return(
                    <div>
                        <input type="checkbox" id={`tst${a[0]}`} onChange={(e) => {
  
                            setAssets([...assets, a])}
                         } />
                        <label for={`tst${a[0]}`}>{a[0]}</label>
                    </div>
                )

            })
        }
        
        </div>
    </div>
)}




const AssetSelect = ({portfolio, assets, setAssets, filter, setFilter}) => {
    const [active, setActive] = useState(false)
    let toShow = portfolio[0]["data"].slice(1).filter(a => a[0].includes(filter))
 
    return (
    <div style={{position:"relative", display:"flex", alignItems:"center", marginLeft:"30px", height:"20px"}}
    onFocus={() => {
        setFilter("")
        setActive(true)
    }}
    onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setFilter("Select")
            setActive(false)
        }
        }} tabIndex={-1}>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} style={{width:"60px", borderRadius:"0", border:"1px solid rgb(102, 102, 102)", color: "rgb(102, 102, 102)", fontSize:"12px", height:"20px", paddingLeft: "4px" }} />
        
        {active? <CheckboxDropdown all={toShow} assets={assets} setAssets={setAssets}/> : null}
    </div>
)}

function convertDateFormat(dateString) {
    // Split the input date string
    const [year, month, day] = dateString.split('-');
    
    // Convert year to 2-digit format
    const shortYear = year.slice(2);
    
    // Return the date in mm-dd-yy format
    return `${month}-${day}`;
}


const StatTable = ({portfolio}) => {
    
    const [data, setData] = useState(null)
    const [range, setRange] = useState(251)
    const [freq, setFreq] = useState(21)
    const [assets, setAssets] = useState(portfolio[0]["data"].slice(1))
    const [filter, setFilter] = useState("Select")

    useEffect(()=> {
        axios
        .post('http://localhost:3001/tstable', portfolio)
        .then((response) => {

            setData(response.data)

        })
    }, [])
    
    

    if (!data) {
        return (<div>Loading...</div>)
    }



    return (
        <>
        <div style={{color: "black", padding:"10px", display: "flex", alignItems: "center"}}>
            <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> 
            <span>Time-Series Table</span>
            
            <AssetSelect portfolio={portfolio} assets={assets} setAssets={setAssets} filter={filter} setFilter={setFilter}/>


            <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}} name="range" id="range"
            onChange={(e) => setRange(parseInt(e.target.value))}>
                <option value="251">1Y</option>
                <option value="126">6M</option>
                <option value="63">3M</option>
                <option value="21">1M</option>
            </select>



            <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}} name="frequency" id="frequency"
            onChange={(e) => setFreq(parseInt(e.target.value))}>
                <option value="21">Monthly</option>
                <option value="10">Bimonthly</option>
                <option value="5">Weekly</option>
                <option value="1">Daily</option>
            </select>

        </div>


        <div style={{width:"100%", overflowX:"auto"}}>
            <table className="assettable" style={{width:"100%", height:"100%"}} >
                <thead>
                <tr>
                    <th>Asset</th>
                    {data["Date"].slice(-range).map((d, i) => {
                        if((i % freq) === 0) {
                            return <th>{convertDateFormat(d)}</th>
                        }
                    })}
    
                </tr>
                </thead>
                <tbody>

                    {assets.map(a => {

                        let temp = []
                        for (let i = data[a[0]].length - range; i < data[a[0]].length; i+=freq) {
                            temp.push(data[a[0]][i])
                        }

                        return(
                            <tr>
                                <td>{a[0]}</td>
                                {temp.map(v => <td>{v}</td>)}
                            </tr>
                        )
                    })}

                    </tbody>
            </table>
        </div>
    </>)
}

export default StatTable