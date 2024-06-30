import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'

const Widget1 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    
    useEffect(() => {
        axios
        .post('http://localhost:3001/totalvalue', portfolio)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [])

    return (
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
    <p style={{fontSize: "large", color: "black"}}>${data}</p>
    </div>
)}

const Widget2 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    useEffect(() => {
        axios
        .post('http://localhost:3001/volatility', portfolio)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}}>⁝⁝</span> Volatility

        <select style={{marginLeft:"30px",  borderRadius:"0", border:"1px solid #666666", fontSize:"10px", color:"#666666"}} name="cars" id="cars">
            <option value="volvo">5-year</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}</p>
    </div>
)}

const Widget3 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    useEffect(() => {
        axios
        .post('http://localhost:3001/diversificationratio', portfolio)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}}>⁝⁝</span> Diversification Ratio

        <select style={{marginLeft:"30px",  borderRadius:"0", border:"1px solid #666666", fontSize:"10px", color:"#666666"}} name="cars" id="cars">
            <option value="volvo">5-year</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}</p>
    </div>
)}

export {Widget1, Widget2, Widget3}