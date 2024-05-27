import { useState } from 'react'
import './index.css'

function SideBar({type}) {
  switch (type) {
    case 'Add':
      return <div id="constructsidebar">Preset</div>
    case 'Undo':
      return <div id="constructsidebar">Custom</div>
    case 'Redo':
      return <div id="constructsidebar">Animate</div>
    case 'Clear':
      return <div id="constructsidebar">Export</div>
  }
}

export default SideBar
