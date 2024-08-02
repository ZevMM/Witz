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
        <span style={{color: "black", marginRight:"2px"}} className="MyDragHandleClassName">⁝⁝</span> Total Value

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>${data}</p>
    </div>
)}

const Widget2 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    const [start, setStart] = useState('2019-07-01')

    useEffect(() => {
        console.log("re-requesting volatility", start)
        axios
        .get(`http://localhost:3001/volatility/${start}`)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [start])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}} className="MyDragHandleClassName">⁝⁝</span> Volatility

        <select style={{marginLeft:"10px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}}
            onChange={(e) => setStart(e.target.value)}>
              <option value="2019-07-01" selected>5Y</option>
              <option value="2021-07-01">3Y</option>
              <option value="2023-07-01">1Y</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}</p>
    </div>
)}

const Widget3 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    const [start, setStart] = useState('2019-07-01')

    useEffect(() => {
        axios
        .get(`http://localhost:3001/diversificationratio/${start}`)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [start])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}} className="MyDragHandleClassName">⁝⁝</span> Diversification Ratio

        <select style={{marginLeft:"10px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}}
            onChange={(e) => setStart(e.target.value)}>
              <option value="2019-07-01" selected>5Y</option>
              <option value="2021-07-01">3Y</option>
              <option value="2023-07-01">1Y</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}</p>
    </div>
)}

const Widget4 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    const [start, setStart] = useState('2019-07-01')

    useEffect(() => {
        axios
        .get(`http://localhost:3001/sharpe/${start}`)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [start])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}} className="MyDragHandleClassName">⁝⁝</span> Sharpe Ratio


        <select style={{marginLeft:"10px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}}
            onChange={(e) => setStart(e.target.value)}>
              <option value="2019-07-01" selected>5Y</option>
              <option value="2021-07-01">3Y</option>
              <option value="2023-07-01">1Y</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}</p>
    </div>
)}

const Widget5 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    const [start, setStart] = useState('2019-07-01')

    useEffect(() => {
        axios
        .get(`http://localhost:3001/ulcer/${start}`)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [start])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}} className="MyDragHandleClassName">⁝⁝</span> Ulcer Index

        <select style={{marginLeft:"10px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}}
            onChange={(e) => setStart(e.target.value)}>
              <option value="2019-07-01" selected>5Y</option>
              <option value="2021-07-01">3Y</option>
              <option value="2023-07-01">1Y</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}</p>
    </div>
)}

const Widget6 = ({portfolio}) => {
    const [data, setData] = useState("loading...")
    const [start, setStart] = useState('2019-07-01')

    useEffect(() => {
        axios
        .get(`http://localhost:3001/return/${start}`)
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
    }, [start])

    return (
    <div>
    
    <div style={{fontSize: "small", color:"black"}}>
        <span style={{color: "black", marginRight:"2px"}} className="MyDragHandleClassName">⁝⁝</span> Return

        <select style={{marginLeft:"10px", borderRadius:"0", border:"1px solid #666666", fontSize:"12px", color:"#666666", height:"21.6px"}}
            onChange={(e) => setStart(e.target.value)}>
              <option value="2019-07-01" selected>5Y</option>
              <option value="2021-07-01">3Y</option>
              <option value="2023-07-01">1Y</option>
        </select>

    </div>
    <div style={{width:"95%", height:"1px", backgroundColor: "black"}}/>
    <p style={{fontSize: "large", color: "black"}}>{data}%</p>
    </div>
)}

export {Widget1, Widget2, Widget3, Widget4, Widget5, Widget6}