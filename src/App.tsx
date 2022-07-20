import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Chart, { chartColors } from './Chart'
function App() {
  const [count, setCount] = useState(0)
  // const labels = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  // ];
  const labels = [
    '<10',
    '10-20',
    '20-30',
    '30-40',
    '50-60',
    '>60',
  ];
  const data2 = {
    labels,
    datasets: [
      {
        label: 'Staff',
        data: [8,22,28,5,2,1],
        backgroundColor: chartColors.CO4,
      },
      {
        label: 'Candidate',
        data: [3,15,22,4,1,1],
        backgroundColor: chartColors.CB5,
      },
    ],
  };
  const data3 = {
    labels,
    datasets: [
      {
        label: 'Import',
        data: [997, 232, 629, 90, 565, 988, 162],
        backgroundColor: chartColors.CO4,
      },
      {
        label: 'Export',
        data: [222, 223, 824, 489, 375, 158, 914],
        backgroundColor: chartColors.CB5,
      },
    ],
  };
  return (
    <div className="App">
      aa
        <div style={{width: '380px', position: 'relative'}}>
        <Chart
          type="bar"
          data={data2}
          options={{
            plugins: {
              // title: {
              //   display: true,
              //   text: 'Stacked Bar Chart',
              // },
              // subtitle: {
              //   display: true,
              //   text: 'x and y scales',
              // },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          }}
        />
        </div>
    
    </div>
  )
}

export default App
