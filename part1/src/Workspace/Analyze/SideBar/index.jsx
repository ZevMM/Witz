import { useState } from 'react'
import './index.css'

function SideBar({type}) {
  switch (type) {
    case 'Technical':
      return <div id="analyzesidebar">Preset</div>
    case 'Macro':
      return <div id="analyzesidebar">Custom</div>
    case 'Custom':
      return <div id="analyzesidebar">Animate</div>
  }
}

export default SideBar
