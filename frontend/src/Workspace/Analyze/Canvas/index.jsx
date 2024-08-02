import React from 'react'
import { useState } from "react"
import './index.css'
import RenderBarChart from './Charts/BarChart';
import {RenderLineChart, RenderReturnChart} from './Charts/LineChart.jsx';
import RenderPieChart from './Charts/PieChart.jsx';
import RenderAreaChart from './Charts/AreaChart.jsx';
import {Widget1, Widget2, Widget3, Widget4, Widget5, Widget6} from './Charts/Widget.jsx';
import StatTable from './Charts/StatTable.jsx';
import RenderRiskChart from './Charts/RiskChart.jsx';
import CorrTable from './Charts/CorrTable.jsx';
import RenderSectorChart from './Charts/SectorAreaChart.jsx';
import Risks from'./Charts/Insights.jsx';

import RGL, { WidthProvider } from "react-grid-layout";
import { AreaChart } from 'recharts';

const ReactGridLayout = WidthProvider(RGL);


const Canvas = ({layout, setLayout, report, portfolio}) => {
  console.log(layout)
    const chartMap = {
      "chart1" : <RenderPieChart portfolio={portfolio}/>,
      "chart2" : <RenderRiskChart portfolio={portfolio} />,
      "chart3" : <RenderAreaChart portfolio={portfolio} />,
      "chart4" : <RenderLineChart portfolio={portfolio} />,
      "chart5" : <Widget1 portfolio={portfolio}/>,
      "chart6" : <Widget2 portfolio={portfolio}/>,
      "chart7" : <Widget3 portfolio={portfolio}/>,
      "chart8" : <Widget4 portfolio={portfolio}/>,
      "widget5" : <Widget5 portfolio={portfolio} />,
      "chart9" : <StatTable portfolio={portfolio}/>,
      "chart10" : <CorrTable portfolio={portfolio}/>,
      "chart11" : <CorrTable/>,
      "sectorchart" : <RenderSectorChart portfolio={portfolio} />,
      "widget6" : <Widget6 />,
      "returnchart": <RenderReturnChart portfolio={portfolio} />,
      "riskchart" : <Risks />
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