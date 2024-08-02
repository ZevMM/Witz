import { useState } from "react"
import './index.css'
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Table from "./Table"


function Canvas({portfolio, collapse}) {
    return (
    <div style={{display: "flex", flex:"0 1 100%", justifyContent: "center", overflowY:"auto", paddingBottom:"50px"}}>
    <div className="canvas" style={{flex:"0 1 900px"}}>
        <SortableContext items={portfolio} strategy={verticalListSortingStrategy}>
        {portfolio.map((p) => {
            if (p.data.length > 1) {
            return (<Table id={p.id} title={p.title} data={p.data} open={p.open} collapse={collapse} />)
        }})}
        </SortableContext>
    </div>
    </div>
    )
}

export default Canvas