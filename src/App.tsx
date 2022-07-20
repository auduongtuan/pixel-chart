import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { AreaChart } from './chart/Area'
import { LineChart } from './chart/Line'
import { PieChart } from './chart/Pie'
import {BarChart} from './chart/Bar'
import {MultiAxisChart} from './chart/MultiAxis'
import { DoughnutChart } from './chart/Doughnut'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <div style={{width: '640px', position: 'relative'}}>
          
          {/* <LineChart /> */}
          <BarChart></BarChart>
          {/* <PieChart></PieChart> */}
        </div>
      {/* <div style={{width: '200px', height: '300px'}}>
        <PieChart />
      </div>
      <div style={{width: '320px'}}>
        <PieChart />
      </div>
      <div style={{width: '640px'}}>
        <MultiAxisChart />
        <BarChart />
        <LineChart />
        <DoughnutChart />
      </div>
      <div style={{width: '400px'}}>
  
        <LineChart />
      </div> */}
    </div>
  )
}

export default App
