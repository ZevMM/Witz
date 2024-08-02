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

const CorrTable = () => {
    
    const [data, setData] = useState(null)
    const [assets, setAssets] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3001/myportfolio')
        .then(response =>
          setAssets(response.data)
        )
      }, [])

    useEffect(()=> {
        
        axios
        .get('http://localhost:3001/corrmatrix')
        .then((response) => {
            
            setData({corr: response.data.corr,
                lag: response.data.lag
            })
        })
    }, [])
    
    

    if (!data) {
        return (<div>Loading...</div>)
    }



    return (
        <>
        <div style={{color: "black", padding:"10px", display: "flex", alignItems: "center"}}>
            <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> 
            <span>Correlation Matrix</span>
        </div>


        <div style={{width:"100%", overflowX:"auto"}}>
            <table className="corrmatrix" style={{width:"100%", height:"100%"}} >
                <thead>
                <tr>
                    <th>Name</th>
                    {assets.map((d, i) => {{return <th>{d}</th>}})}
    
                </tr>
                </thead>
                <tbody>

                    {data.corr.map((row, i) => {
                        return(
                            <tr>
                                <td style={{color:"black", fontWeight:"400"}}>{assets[i]}</td>
                                {row.map((v,x) => <td className={`td${data.lag[i][x]}`} style={data.lag[i][x] == 0? {color:`rgb(0,0,0,${v})`}:{color:`rgb(255,255,255,${v})`}}>{v}</td>)}
                            </tr>
                        )
                    })}

                    </tbody>
            </table>
        </div>
    </>)
}

export default CorrTable