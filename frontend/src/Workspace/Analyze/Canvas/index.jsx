import React from 'react'
import { useState } from "react"
import './index.css'

import RGL, { WidthProvider } from "react-grid-layout";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, 
{name: 'Page B', uv: 300, pv: 2400, amt: 2400},
{name: 'Page C', uv: 300, pv: 2400, amt: 2400},
{name: 'Page D', uv: 200, pv: 2400, amt: 2400},
{name: 'Page E', uv: 278, pv: 2400, amt: 2400},
{name: 'Page F', uv: 189, pv: 2400, amt: 2400}];

const renderLineChart = (
  <ResponsiveContainer width="100%" height="100%">
  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

    <Tooltip />
  </LineChart>
  </ResponsiveContainer>
);


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
          {layout.map(cb => <div className="chartBlock" key={cb.i}>{renderLineChart}</div>)}
        </ReactGridLayout>
    )
}


export default Canvas