import { useState } from 'react'
import './index.css'
import { useSortable } from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"

function Table({id, title, data, open, collapse}) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const isOpen = (open, data) => {
        if (open) {
            return (
                <table className="assettable">
                    <thead>
                        <tr>
                            {data[0].map((head) => <th>{head}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(1).map((row) => <tr>{row.map((ele) => <td>{ele}</td>)}</tr>)}
                    </tbody>
                </table>
            )
        }
    }

    const openSymbol = (open) => {
        if (open) {
            return "-"
        }
        return "+"
    }

    return (
        <div ref={setNodeRef} className="table" key={id} style={style}>
        <div style={{display: "flex", alignItems: "center"}}>
        <button  {...attributes} {...listeners} className="handle">⁝⁝</button>
        {title}
        <button onClick={() => collapse(id)} className="openSymbol"> {openSymbol(open)} </button>
        </div>
            {isOpen(open, data)}
        </div>
    )
}

export default Table