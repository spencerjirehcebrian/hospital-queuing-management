import React, { useEffect, useRef } from 'react';

import { db } from "../firebase/firebase";
import { collection, getDocs, where, query } from 'firebase/firestore';
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const ChartComponent = () => {

   var chartRef = useRef(null);

  useEffect(() => {

    const fetchData = async () => {

      var dataRef;
      
      //console.log(departmentFilter)

      // if (departmentFilter == "" || departmentFilter == "All"){
      //   dataRef =  query(collection(db, 'reports'));
      // }
      // else{
      //   dataRef =  query(collection(db, 'reports'), where('departmentName', '==', departmentFilter));
      // }

      dataRef =  query(collection(db, 'reports'));
      const snapshot = await getDocs(dataRef);
      const data = snapshot.docs.map((doc) => doc.data());

      const labels = data.map((item) => item.departmentName);
      const values = data.map((item) => item.averageWaitTime);
      
      var canvas = document.getElementById('myChart');
      const ctx = canvas.getContext('2d');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Average Wait Time in Minutes',
              data: values,
              backgroundColor: ['#B0D7CB', '#88B2AF', '#658D93', '#486A76', '#2F4858'],
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Generated Report of Average Wait Times per Selected Departments',
            }
          },
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              label: "Minutes"
            },
          },
        },
      });
    };

    fetchData();
  }, []);

  return <canvas id="myChart" ref={chartRef} />;

};

export default ChartComponent;