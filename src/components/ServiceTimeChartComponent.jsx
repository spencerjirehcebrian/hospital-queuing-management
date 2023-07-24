import React, { useEffect, useState } from 'react';

import { db } from "../firebase/firebase";
import { collection, getDocs, onSnapshot, where, query } from 'firebase/firestore';
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ServiceTimeChartComponent = (props) => {
  const [data, setData] = useState([]);
  const [chartTypeHolder, setChartTypeHolder] = useState('column');

  useEffect(() => {

    const unsubscribe = onSnapshot(
      query(collection(db, 'reports')),
      (snapshot) => {
        const schedulesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        const updatedArray = schedulesData.map(({ id, averageWaitTime, ...rest }) => rest);

        const updatedArray2 = updatedArray.map(({ departmentName, averageServiceTime }) => ({
          name: departmentName,
          y: averageServiceTime,
        }));

        // console.log(data)
        // console.log(schedulesData)
        // console.log(updatedArray2)
        setData(updatedArray2);
        setChartTypeHolder(props.chartType)


      }
    );
    return unsubscribe;
  }, [props.chartType]);

  const options = {
    chart: {
      type: chartTypeHolder,
      backgroundColor: '#dcfce7',
      borderRadius: 10,
    },
    title: {
      text: `Generated Report of Average Service Times per Selected Departments`,
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'Minutes',
      },
    },
    series: [
      {
        name: 'Minutes',
        data: data,
        color: '#22c55e',
        borderWidth: 0,
        borderRadius: 5,
      },
    ],
  };


  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ServiceTimeChartComponent;