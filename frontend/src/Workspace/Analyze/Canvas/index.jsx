import React from 'react'
import { useState } from "react"
import './index.css'
import RenderBarChart from './Charts/BarChart';
import RenderLineChart from './Charts/LineChart.jsx';
import RenderPieChart from './Charts/PieChart.jsx';
import RenderAreaChart from './Charts/AreaChart.jsx';
import {Widget1, Widget2, Widget3} from './Charts/Widget.jsx';

import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);


const Canvas = ({layout, setLayout, report}) => {
    console.log("rendering canvas", report["data6"])
    const chartMap = {
      "chart1" : <RenderLineChart data={report["data1"]}/>,
      "chart2" : <RenderBarChart data={report["data2"]}/>,
      "chart3" : <RenderPieChart data={report["data3"]}/>,
      "chart4" : <Widget1 data={report["data4"]}/>,
      "chart5" : <Widget2 data={report["data5"]}/>,
      "chart6" : <Widget3 data={report["data6"]}/>,
      "chart7" : <RenderAreaChart/>,
      "chart8" : <Widget3 data={report["data6"]}/>,
      "chart9" : <Widget2 data={report["data5"]}/>
    }

    return (
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1500}
          onLayoutChange={(l) => setLayout(l)}
        >
          {layout.map(cb => {
            const id = cb.i
            return(<div className="chartBlock" key={id}>{chartMap[id]}</div>)
        })}
        </ReactGridLayout>
    )
}


export default Canvas