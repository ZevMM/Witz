import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'


const CheckboxDropdown = ({all, assets, setAssets}) => {
    
    return(
    <div style={{position:"absolute", top:"20px", background:"white", width:"120%", borderRadius:"10px", boxShadow:"0px 5px 5px #888"}}>
        <div style={{maxHeight:"150px", overflowY:"auto", fontSize: "12px", color:"#666666", display:"flex", flexDirection:"column"}}>
        {
            all.map(a => {

                const isChecked = assets.includes(a)

                if (isChecked) {
                    return(
                        <div>
                            <input type="checkbox" id={`tst${a}`} onChange={(e) => {
                                setAssets(assets.filter(b => b != a))}} checked/>
                            <label for={`tst${a}`}>{a}</label>
                        </div>
                    )
                }
                
                return(
                    <div>
                        <input type="checkbox" id={`tst${a}`} onChange={(e) => {
  
                            setAssets([...assets, a])}
                         } />
                        <label for={`tst${a}`}>{a}</label>
                    </div>
                )

            })
        }
        
        </div>
    </div>
)}




const AssetSelect = ({activeAssets, setActiveAssets, assets, filter, setFilter}) => {
    const [active, setActive] = useState(false)
    
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
        <input value={filter} onChange={(e) => setFilter(e.target.value)} style={{width:"80px", borderRadius:"0", border:"1px solid rgb(102, 102, 102)", color: "rgb(102, 102, 102)", fontSize:"12px", height:"20px", paddingLeft: "4px" }} />
        
        {active? <CheckboxDropdown all={assets.filter(a => a.includes(filter))} assets={activeAssets} setAssets={setActiveAssets}/> : null}
    </div>
)}

function convertDateFormat(dateString) {
    // Split the input date string
    const [year, month, day] = dateString.split('-');
    
    // Convert year to 2-digit format
    const shortYear = year.slice(2);
    
    // Return the date in mm-dd-yy format
    return `${month}-${day}-${shortYear}`;
}


const StatTable = ({portfolio}) => {
    
    const [data, setData] = useState(null)
    const [range, setRange] = useState(36)
    const [freq, setFreq] = useState(3)
    const [assets, setAssets] = useState([])
    const [activeAssets, setActiveAssets] = useState([])
    const [filter, setFilter] = useState("Select")

    useEffect(() => {
        axios.get('http://localhost:3001/myportfolio')
        .then(response => {
          setAssets(response.data)
          setActiveAssets(response.data)
        })
      }, [])

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
            
            <AssetSelect activeAssets={activeAssets} setActiveAssets={setActiveAssets} assets={assets} filter={filter} setFilter={setFilter}/>


            <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}} name="range" id="range"
            onChange={(e) => setRange(parseInt(e.target.value))}>
              <option value="60">5Y</option>
              <option value="36" selected>3Y</option>
              <option value="12">1Y</option>
            </select>



            <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}} name="frequency" id="frequency"
            onChange={(e) => setFreq(parseInt(e.target.value))}>
                <option value="12">Yearly</option>
                <option value="3" selected>Quarterly</option>
                <option value="1">Monthly</option>
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

                    {activeAssets.map(a => {

                        let temp = []
                        for (let i = data[a].length - range; i < data[a].length; i+=freq) {
                            temp.push(data[a][i])
                        }

                        return(
                            <tr>
                                <td>{a}</td>
                                {temp.map(v => <td>{v.toFixed(2)}</td>)}
                            </tr>
                        )
                    })}

                    </tbody>
            </table>
        </div>
    </>)
}

export default StatTable