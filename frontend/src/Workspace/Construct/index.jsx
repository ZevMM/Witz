import { useState } from 'react'
import './index.css'
import SideBar from './SideBar'
import Canvas from './Canvas'
import {DndContext, closestCorners} from "@dnd-kit/core"
import { arrayMove } from '@dnd-kit/sortable'

const ActionElement = ({text, handleClick}) => <span className="actionelement" onClick={handleClick}>{text}</span>

function Construct({username, full, setFull, portfolio, setPortfolio, levs, setLevs}) {
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
            return <ActionElement text='∨' handleClick={() => setFull(false)} />
        }
        return <ActionElement text='∧' handleClick={() => setFull(true)} />
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

    //options: ↩↪↶↷↺↻
    //more options: ⨇⨈⩔⩕⩖⩢⩣⩠⩞Ø🚫➕✖️🟰✕⇊⇈

    return (
      <div style={{display: "flex", height: "100%"}}>
        <div style={{display: "flex", flex: "4 4", flexDirection: "column"}}>
            <div id="actionbar">
                <div>
                <ActionElement text='Add' handleClick={() => changeSide('Add')}/>
                <ActionElement text='Clear' handleClick={() => changeSide('Clear')}/>
                <ActionElement text='Undo' handleClick={() => changeSide('Undo')}/>
                <ActionElement text='Redo' handleClick={() => changeSide('Redo')}/>
                <ActionElement text='Collapse' handleClick={() => changeSide('Clear')}/>
                </div>
                <FullButton />
            </div>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
              <Canvas portfolio={portfolio} collapse={collapse}/>
            </DndContext>
        </div>
        <SideBar username={username} type={side} portfolio={portfolio} setPortfolio={setPortfolio} levs={levs} setLevs={setLevs} />
      </div>
  )
}

export default Construct