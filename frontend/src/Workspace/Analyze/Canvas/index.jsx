import React from 'react'
import { useState } from "react"
import './index.css'
import RenderBarChart from './Charts/BarChart';
import RenderLineChart from './Charts/LineChart.jsx';
import RenderPieChart from './Charts/PieChart.jsx';
import RenderAreaChart from './Charts/AreaChart.jsx';
import {Widget1, Widget2, Widget3} from './Charts/Widget.jsx';
import StatTable from './Charts/StatTable.jsx';
import RenderRiskChart from './Charts/RiskChart.jsx';

import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);


const Canvas = ({layout, setLayout, report, portfolio}) => {
    const chartMap = {
      "chart1" : <RenderLineChart portfolio={portfolio}/>,
      "chart2" : <RenderBarChart data={report["data2"]}/>,
      "chart3" : <RenderPieChart portfolio={portfolio}/>,
      "chart4" : <Widget1 portfolio={portfolio}/>,
      "chart5" : <Widget2 portfolio={portfolio}/>,
      "chart6" : <Widget3 portfolio={portfolio}/>,
      "chart7" : <RenderAreaChart portfolio={portfolio}/>,
      "chart8" : <StatTable portfolio={portfolio}/>,
      "chart9" : <RenderRiskChart portfolio={portfolio}/>
    }

    return (
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1500}
          onLayoutChange={(l) => setLayout(l)}
          draggableHandle='.MyDragHandleClassName'
        >
          {layout.map(cb => {
            const id = cb.i
            return(<div className="chartBlock" key={id}>{chartMap[id]}</div>)
        })}
        </ReactGridLayout>
    )
}


export default Canvas