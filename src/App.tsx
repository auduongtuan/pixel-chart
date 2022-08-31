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
  const labels2 = [
    'Q1 2014',
    'Q2 2014',
    'Q3 2014',
    'Q4 2014',
    'Q1 2015',
    'Q2 2015',
    'Q3 2015',
    'Q4 2015',
    'Q1 2016',
    'Q2 2016',
    'Q3 2016',
    'Q4 2016',
    'Q1 2017',
    'Q2 2017',
    'Q3 2017',
    'Q4 2017',
    'Q1 2018',
    'Q2 2018',
    'Q3 2018',
    'Q4 2018'
  ];
  const data4 = {
    labels: labels2,
    datasets: [
      {
        label: 'Mac',
        data: [4837, 4136, 4413, 5520, 5519, 4563, 4796, 5709, 5312, 4034, 4252, 4886, 5374, 4199, 4292, 5386, 5112, 4078, 3720, 5299],
        backgroundColor: chartColors.CO4,
      }
    ]
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

        <div style={{width: '800px', position: 'relative'}}>
        <Chart
          type="bar"
          data={data4}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Sales of Apple Mac Computers',
                align: 'center',
              },
              subtitle: {
                display: true,
                text: 'Source: Apple',
                align: 'center',
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Sales (in thousand units)'
                },
              }
            },
          }}
        />
        </div>
    
    </div>
  )
}

export default App
