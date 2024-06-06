import { useState } from 'react'
import './index.css'

function SideBar({type}) {
  switch (type) {
    case 'Parameters':
      return <div id="simulatesidebar">Preset</div>
    case 'Control':
      return <div id="simulatesidebar">Custom</div>
    case 'Display':
      return <div id="simulatesidebar">Animate</div>
  }
}

export default SideBar
