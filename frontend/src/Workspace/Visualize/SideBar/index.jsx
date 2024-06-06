import { useState } from 'react'
import './index.css'

function SideBar({type}) {
  switch (type) {
    case 'Preset':
      return <div id="visualizesidebar">Preset</div>
    case 'Custom':
      return <div id="visualizesidebar">Custom</div>
    case 'Animate':
      return <div id="visualizesidebar">Animate</div>
    case 'Export':
      return <div id="visualizesidebar">Export</div>
  }
}

export default SideBar
