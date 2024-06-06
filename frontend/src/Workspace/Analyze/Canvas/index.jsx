import React from 'react'
import { useState } from "react"
import './index.css'

import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);


const Canvas = ({layout, setLayout}) => {
    return (
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1500}
          compactType={null}
          onLayoutChange={(l) => setLayout(l)}
        >
          {layout.map(cb => <div className="chartBlock" key={cb.i}>{cb.i}</div>)}
        </ReactGridLayout>
    )
}


export default Canvas