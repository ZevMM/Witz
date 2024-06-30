import { useState } from "react"
import './index.css'
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Table from "./Table"


function Canvas({portfolio, collapse}) {

    return (
    <div style={{display: "flex", flex:"0 1", justifyContent: "center"}}>
    <div className="canvas" style={{flex:"0 1 900px"}}>
        <SortableContext items={portfolio} strategy={verticalListSortingStrategy}>
        {portfolio.map((portfolio) => {
            if (portfolio.data.length > 1) {
            return (<Table id={portfolio.id} title={portfolio.title} data={portfolio.data} open={portfolio.open} collapse={collapse} />)
        }})}
        </SortableContext>
    </div>
    </div>
    )
}

export default Canvas