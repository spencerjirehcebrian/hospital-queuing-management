import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp, query, onSnapshot, getFirestore, deleteDoc, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Spinner from "../../components/Spinner";
import {toast} from 'react-toastify'

import WaitTimeChartComponent2 from "../../components/WaitTimeChartComponent2";
import ServiceTimeChartComponent from "../../components/ServiceTimeChartComponent";

export default function Report() {

  const [startDate, SetStartDate] = useState('')
  const [stopDate, SetStopDate] = useState('')
  const [departmentName, SetDepartmentName] = useState('')
  const [assetL, setAssetL] = useState([]);

  const [forceUpdate, setForceUpdate] = useState(false);

  const [refresh, setRefresh] = useState(1)

  const [chartType, SetChartType] = useState('')
  const [ageFilter, setAgeFilter] = useState('')
  const [medicalConditionFilter, setMedicalConditionFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')

  const calculateTimeDifference = async (department, startDateFunctionIn, stopDateFunctionIn) => {
    var waitAverages = []
    var serviceAverages = []

    const startDate1 = new Date(startDateFunctionIn);
    startDate1.setHours(0, 0, 0, 0);
    const stopDate1 = new Date(stopDateFunctionIn);
    stopDate1.setHours(23, 59, 59, 999);

    var averageOutput = 0;
    var serviceOutput = 0;

    const averageQueryFilters = [
      where('departmentName', '==', department),
      where('timeServiceStart', '>=', startDate1),
      where('timeServiceStart', '<=', stopDate1)
    ];
    

    if (genderFilter != '') {
      averageQueryFilters.push(where('patientSex', '==', genderFilter));
    }
    
    if (medicalConditionFilter != '') {
      averageQueryFilters.push(where('medicalCondition', '==', medicalConditionFilter));
    }
    
    if (ageFilter != '') {
      averageQueryFilters.push(where('patientAge', '==', ageFilter));
    }

    const averageQuery = query(
      collection(db, 'queue'),
      ...averageQueryFilters, orderBy('timeServiceStart')
      );

    const averageQuerySnapshot = await getDocs(averageQuery);

    averageQuerySnapshot.forEach(doc => {
      const timeCheckIn = doc.data().timeCheckIn.toDate();
      const timeServiceStart = doc.data().timeServiceStart.toDate();

      //console.log("found", timeCheckIn, timeServiceStart)

      const difference =  timeServiceStart.getTime() - timeCheckIn.getTime();
      waitAverages.push(difference)
      const averageCalculated = waitAverages.reduce((total, num) => total + num, 0) / waitAverages.length;
      const minutes = Math.ceil(averageCalculated / 60000);

      averageOutput = parseFloat(minutes)
    });

    const serviceQueryFilters = [
      where('departmentName', '==', department),
      where('timeComplete', '>=', startDate1),
      where('timeComplete', '<=', stopDate1)
    ];
    

    if (genderFilter != '') {
      serviceQueryFilters.push(where('patientSex', '==', genderFilter));
    }
    
    if (medicalConditionFilter != '') {
      serviceQueryFilters.push(where('medicalCondition', '==', medicalConditionFilter));
    }
    
    if (ageFilter != '') {
      serviceQueryFilters.push(where('patientAge', '==', ageFilter));
    }

    const serviceQuery = query(
      collection(db, 'queue'),
      ...serviceQueryFilters, orderBy('timeComplete')
    );

    const serviceQuerySnapshot = await getDocs(serviceQuery);

    serviceQuerySnapshot.forEach(doc => {
      const timeServiceStart = doc.data().timeServiceStart.toDate();
      const timeComplete = doc.data().timeComplete.toDate();

      // console.log("found", timeServiceStart, timeComplete)

      const difference =  timeComplete.getTime() - timeServiceStart.getTime();
      serviceAverages.push(difference)
      const averageCalculated = serviceAverages.reduce((total, num) => total + num, 0) / serviceAverages.length;
      const minutes = Math.ceil(averageCalculated / 60000);

      serviceOutput = parseFloat(minutes)
      });

    send(department, averageOutput, serviceOutput)
  }

  const calculateTimeDifferenceMultiple = async () => {
    assetL.forEach((value) => {
      calculateTimeDifference(value.departmentName, startDate, stopDate)
    });
  };

  const send = async (dept, min, serviceMin) => {
    const newData = {
        departmentName: dept,
        averageWaitTime: min,
        averageServiceTime: serviceMin,
      };
    const collectionRef = collection(db, 'reports');
    addDoc(collectionRef, newData)
}
  
  const deleteAllDocumentsInCollection = async () => {
    const querySnapshot = await getDocs(collection(db, "reports"));
  
    try {
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
  
    } catch (error) {
      console.error('Error deleting documents from the collection:', error);
    }
  };

  const handleReload = () => {
      //window.location.reload();
  };

  const handleClick = async (e) => {
    e.preventDefault()

    try {
    await deleteAllDocumentsInCollection()

    if (departmentName == "All Departments (Default)" || departmentName == ""){
      await calculateTimeDifferenceMultiple()
    }
    else {
      await calculateTimeDifference(departmentName, startDate, stopDate)
    }
    // console.log(departmentName, chartType)
    toast.success("Report Generated")
    handleReload()
    } catch(error) {
      toast.error("Error updating document:", error)
      console.error("Error updating document:", error)
    }
  }


  useEffect(() => {
    const q = query(collection(db, 'departments'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const departmentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    setAssetL(departmentData);

    });
    return unsubscribe;
    
  }, []);


  return (
    <>
    <h1 className="text-3xl text-center mt-14 font-bold">Reports</h1>
    <div className='block px-[6%] py-14'>

    <div className="w-10/12 px-2 mx-auto mt-1" >
      <form onSubmit={handleClick}>
      
      <div className="border gap-4 border-gray-400 px-4 py-3 rounded-lg mb-5" >
      <p className="text-lg font-bold mb-3 text-left">Report Settings</p>
        <div className='grid grid-cols-4 gap-4'>
        <div>
        <p className="text-lg font-semibold">Date Minimum</p>
        <input
          type="date"
          id="startDate"
          dateformat="MM/dd/yyyy"
          value={startDate}
          onChange={(event) => SetStartDate(event.target.value)}
          placeholder="Appointment Date"
          required
          className="w-full   text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
        />
        </div>

        <div>
        <p className="text-lg font-semibold">Date Maximum</p>
        <input
          type="date"
          id="stopDate"
          dateformat="MM/dd/yyyy"
          value={stopDate}
          onChange={(event) => SetStopDate(event.target.value)}
          placeholder="Appointment Date"
          required
          className="w-full   text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
        />
        </div>

        <div>
      <p className="text-lg font-semibold">Department Filter</p>
      <select
              id="departmentName"
              value={departmentName}
              required
              onChange={(event) => SetDepartmentName(event.target.value)}
              className={`w-full     text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
              ${departmentName|| "text-gray-700"}`}
            >
              
              <option className="text-gray-700" value="All Departments (Default)" defaultValue>All Departments (Default)</option>
              {assetL.map((department) => (
              <>
              <option key={department.id} className=" text-gray-700" value={department.departmentName}>{department.departmentName}</option>
              </> 
              ))}
            </select>
            </div>

            <div>
            <p className="text-lg font-semibold">Age Filter</p>
            <input
                type="number"
              id="ageFilter"
              placeholder='Age'
              value={ageFilter}
              onChange={(event) => setAgeFilter(event.target.value)}
             
              className={`w-full     text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out`}
            />
            </div>

            <div>
            <p className="text-lg font-semibold">Gender Filter</p>
            <select
              id="genderFilter"
              value={genderFilter}
              onChange={(event) => setGenderFilter(event.target.value)}
             
              className={`w-full     text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out`}
            >

              <option className="text-gray-700" value="" defaultValue>No Gender Filter</option>
              <option className=" text-gray-700" value="male" >Male</option>
              <option className=" text-gray-700" value="female" >Female</option>
            </select>
            </div>

            <div>
            <p className="text-lg font-semibold">Medical Condition Filter</p>
              <input
                type="text"
                id="medicalConditionFilter"
                value={medicalConditionFilter}
                onChange={(event) => setMedicalConditionFilter(event.target.value)}

                placeholder="(Case Sensitive)"
                className="w-full   text-lg text-gray-700 bg-white border border-gray-300 
                rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600  "
              />
              </div>

              <div>
            <p className="text-lg font-semibold">Chart Type</p>
            <select
              id="chartType"
              value={chartType}
              onChange={(event) => SetChartType(event.target.value)}
             
              className={`w-full     text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out`}
            >
              <option className="text-gray-700" value="column" defaultValue>Column Graph (Default)</option>
              <option className="text-gray-700" value="bar" defaultValue>Bar Graph</option>
              <option className=" text-gray-700" value="line" >Line Graph</option>
              <option className=" text-gray-700" value="pie" >Pie Graph</option>
            </select>
            </div>
            </div>

    <button
      
      className="  w-full my-6 px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Generate Reports
    </button>
      </div>
    </form>
    </div>
    
    <div className='mx-auto w-10/12 my-10 rounded-lg bg-white'>
      <WaitTimeChartComponent2 startDate={startDate} stopDate={stopDate} chartType={chartType}/>
    </div>

    <div className='mx-auto w-10/12 my-10 rounded'>
      <ServiceTimeChartComponent startDate={startDate} stopDate={stopDate} chartType={chartType}/>
    </div>
    
    

    </div>
    </>
  )
}
