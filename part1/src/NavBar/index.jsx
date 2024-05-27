import { useState } from 'react'
import './index.css'

const NavElement = ({text}) => <span className="navelement">{text}</span>

const Tools = () => {
  return (
  <span className="navelement">
    <span className="navelement">File</span>
    <span className="navelement">View</span>
    <span className="navelement">Settings</span>
    <span className="navelement">Help</span>
  </span>
  )
}

const Left = () => {
  return (
    <span className = "navelement">
      <span id="logo">Witz</span>
      <Tools/>
    </span>
  )
}

function NavBar() {

  return (
    <div id="navbar">
      <Left/>
      <NavElement text='Account'/>
    </div>
  )
}

export default NavBar
