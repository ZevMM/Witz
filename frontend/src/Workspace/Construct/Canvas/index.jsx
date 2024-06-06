import { useState } from "react"
import './index.css'
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Table from "./Table"


function Canvas({portfolio, collapse}) {

    return (
    <div className="canvas">
        <SortableContext items={portfolio} strategy={verticalListSortingStrategy}>
        {portfolio.map((portfolio) => {
            if (portfolio.data.length > 1) {
            return (<Table id={portfolio.id} title={portfolio.title} data={portfolio.data} open={portfolio.open} collapse={collapse} />)
        }})}
        </SortableContext>
    </div>
    )
}

export default Canvas