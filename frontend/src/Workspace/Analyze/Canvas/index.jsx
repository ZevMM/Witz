import React from 'react'
import { useState } from "react"
import './index.css'
import renderBarChart from './Charts/BarChart';
import Widget from './Charts/Widget.jsx';

import RGL, { WidthProvider } from "react-grid-layout";
import { PieChart, Pie, LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, 
{name: 'Page B', uv: 300, pv: 2400, amt: 2400},
{name: 'Page C', uv: 300, pv: 2400, amt: 2400},
{name: 'Page D', uv: 200, pv: 2400, amt: 2400},
{name: 'Page E', uv: 278, pv: 2400, amt: 2400},
{name: 'Page F', uv: 189, pv: 2400, amt: 2400}];

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const data02 = [
  { name: 'A1', value: 100 },
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
  { name: 'B3', value: 40 },
  { name: 'B4', value: 30 },
  { name: 'B5', value: 50 },
  { name: 'C1', value: 100 },
  { name: 'C2', value: 200 },
  { name: 'D1', value: 150 },
  { name: 'D2', value: 50 },
];

const renderLineChart = (
  <ResponsiveContainer width="100%" height="100%">
  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="uv" stroke="#feb570ff" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

    <Tooltip />
  </LineChart>
  </ResponsiveContainer>
);

const renderPieChart = (
  <ResponsiveContainer width="100%" height="100%">
  <PieChart width="100%" height="100%">
    <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={"48%"} fill="#fe8070ff" />
    <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={"64%"} outerRadius={"83%"} fill="#7aa5e2ff" label />
  </PieChart>
  </ResponsiveContainer>
)

const chartMap = {
  "chart1" : renderLineChart,
  "chart2" : renderBarChart,
  "chart3" : Widget
}

const ReactGridLayout = WidthProvider(RGL);


const Canvas = ({layout, setLayout}) => {
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