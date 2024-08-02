//your portfolio is (high/moderate)ly susceptible to ____
//You could become more diversified by investing in ____
//one for risk, one for opportunities
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'

const Risks = ({}) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:3001/risks')
        .then((response) => {
            console.log(response.data)
            setData(response.data)
        })
    }, [])

    if (!data) {
        return <div style={{color:"black"}}>Loading...</div>
    }

    return(
    <>
    <div style={{color: "black", padding:"10px", flex:"0", backgroundColor:"#f3f3f3ff", margin:"3px", boxShadow: "0 2px 2px -2px rgb(0, 0, 0)"}}>
    <span style={{color: "black", paddingRight:"10px"}} className="MyDragHandleClassName">⁝⁝</span> Insights
    </div>
    <div style={{color:"black", padding:"15px 5px 10px 20px"}}>
        <h3>Your portfolio is highly susceptible to changes in:</h3>
        <ul style={{paddingLeft:"40px"}}>
            {data.high.map(d=> <li><b>{d.name}</b></li>)}
        </ul>
        <h3 style={{paddingTop:"15px"}}>Your portfolio is moderately susceptible to changes in:</h3>
        <ul style={{paddingLeft:"40px"}}>
            {data.moderate.map(d=> <li><b>{d.name}</b></li>)}
        </ul>
        
    </div>
    </>
)
}

export default Risks