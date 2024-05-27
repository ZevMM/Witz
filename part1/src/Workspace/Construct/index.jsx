import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'
import {DndContext, closestCorners} from "@dnd-kit/core"
import { arrayMove } from '@dnd-kit/sortable'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Construct({full, setFull, portfolio, setPortfolio}) {

    const [side, setSide] = useState('')

    const collapse = (id) => {
        const copy = [...portfolio]
        const index = getTaskPos(id)
        if (copy[index].open) {
            copy[index].open = false
        } else {
            copy[index].open = true
        }
        setPortfolio(copy)
    }

    const changeSide = (active) => {
        if (side == active) {
            setSide('')
        } else {
            setSide(active)
        }
    }

    const FullButton = () => {
        if (full) {
            return <ActionElement text='Down' handleClick={() => setFull(false)} />
        }
        return <ActionElement text='Up' handleClick={() => setFull(true)} />
    }

    const getTaskPos = id => portfolio.findIndex(portfolio => portfolio.id === id)

    const handleDragEnd = event => {
        const {active, over} = event

        if (active.id == over.id) return

        setPortfolio(portfolio => {
            const originalPos = getTaskPos(active.id)
            const newPos = getTaskPos(over.id)

            return arrayMove(portfolio, originalPos, newPos)
        })
    }

    return (
      <div style={{display: "flex", height: "100%"}}>
        <div style={{display: "flex", flex: 3, flexDirection: "column"}}>
            <div id="actionbar">
                <ActionElement text='Add' handleClick={() => changeSide('Add')}/>
                <ActionElement text='Undo' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Redo' handleClick={() => changeSide('Redo')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Clear')}/>
                <FullButton />
            </div>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
              <Canvas portfolio={portfolio} collapse={collapse}/>
            </DndContext>
        </div>
        <SideBar type={side} />
      </div>
  )
}

export default Construct