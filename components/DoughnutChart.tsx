"use client"; //since a client directive

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



const DoughnutChart = ({ accounts }: DoughnutChartProps  ) => {

    const accountNames = accounts.map((a) => a.name);  // iterate through account retrieve only account names in an array
    const balances = accounts.map((a) => a.currentBalance); // retrieve only current balance in an array


    const data = {
        datasets: [
            {
                label: 'Banks',
                data: balances,
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
            }
        ],
        labels:[accountNames]
    }; 

    return (
        <Doughnut 
           data={data}
           options= {{
            cutout: '55%', //width of colored pie
            plugins: {
                legend: {
                    display: false //disable key
                }
            }
           }}
        />
    )
}

export default DoughnutChart