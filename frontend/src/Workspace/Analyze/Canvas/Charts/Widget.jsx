const Widget1 = ({data}) => {return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}}>⁝⁝</span> Total Value

        <select style={{marginLeft:"30px",  borderRadius:"0", border:"1px solid #666666", fontSize:"10px", color:"#666666"}} name="cars" id="cars">
            <option value="volvo">5-year</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>${data},000,000</p>
    </div>
)}

const Widget2 = ({data}) => {return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}}>⁝⁝</span> Total Value

        <select style={{marginLeft:"30px",  borderRadius:"0", border:"1px solid #666666", fontSize:"10px", color:"#666666"}} name="cars" id="cars">
            <option value="volvo">5-year</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>${data},000,000</p>
    </div>
)}
/*
const Widget3 = ({data}) => {return (
    <div style={{width:"100%", height:"100%", borderRadius:"2px", backgroundColor:"#faac34", padding:"3px"}}>
    <h2>${data}</h2>
    <h4>Total Value</h4>
    </div>
)}
*/

const Widget3 = ({data}) => {
    return (
    <>
    <div style={{color: "black", padding:"10px"}}>
    <span style={{color: "black", paddingRight:"10px"}}>⁝⁝</span> Time-Series Table
    <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666"}} name="cars" id="cars">
    <option value="volvo">Add</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
    </select>
    <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666"}} name="cars" id="cars">
    <option value="volvo">Timespan</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
    </select>
    <select style={{marginLeft:"30px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666"}} name="cars" id="cars">
    <option value="volvo">Frequency</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
    </select>
    </div>
    <div style={{width:"100%"}}>
        <table className="assettable" style={{width:"100%", height:"100%"}}>
            <thead>
            <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>

            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
                </tr>
                <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
                </tr>
                <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
                </tr>
                <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
                </tr>
                </tbody>
        </table>
    </div>
    </>)
}
export {Widget1, Widget2, Widget3}