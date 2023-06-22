import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp, query, onSnapshot, getFirestore, deleteDoc, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Spinner from "../../components/Spinner";
import ChartComponent from "../../components/ChartComponent";
import {toast} from 'react-toastify'

export default function Report() {

  const [startDate, SetStartDate] = useState('')
  const [stopDate, SetStopDate] = useState('')
  const [departmentName, SetDepartmentName] = useState('')
  const [assetL, setAssetL] = useState([]);

  const [forceUpdate, setForceUpdate] = useState(false);

  const calculateTimeDifference = async (department, startDateFunctionIn, stopDateFunctionIn) => {
    var averages = []

    const startDate1 = new Date(startDateFunctionIn);
    startDate1.setHours(0, 0, 0, 0);
    const stopDate1 = new Date(stopDateFunctionIn);
    stopDate1.setHours(23, 59, 59, 999);

    var output = 0;

    const q = query(
        collection(db, 'queue'),
        orderBy('timeCompleted'),
        where('departmentName', "==", department),
        where('timeCompleted', '>=', startDate1),
        where('timeCompleted', '<=', stopDate1)
        );

        const snapshot = await getDocs(q);
    
        snapshot.forEach(doc => {
            const timeCheckIn = doc.data().timeCheckIn.toDate();
            const timeCompleted = doc.data().timeCompleted.toDate();

            // console.log("found", timeCheckIn, timeCompleted)

            const difference =  timeCompleted.getTime() - timeCheckIn.getTime();
            averages.push(difference)
            const averageCalculated = averages.reduce((total, num) => total + num, 0) / averages.length;
            const minutes = Math.ceil(averageCalculated / 60000);

            output = parseFloat(minutes)
        });
      send(department, output)
  }

  const calculateTimeDifferenceMultiple = async () => {
    assetL.forEach((value) => {
      calculateTimeDifference(value.departmentName, startDate, stopDate)
    });
  };

  const send = async (dept, min) => {
    const newData = {
        departmentName: dept,
        averageWaitTime: min,
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
  
      //console.log('All documents in the collection have been deleted.');
    } catch (error) {
      console.error('Error deleting documents from the collection:', error);
    }
  };

  const handleReload = () => {
    window.location.reload();
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
    console.log(departmentName)
    toast.success("Report Generated")
    handleReload()
    } catch(error) {
      toast.error("Error updating document:", error)
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
    <div className='px-[8%] py-10'>
      <ChartComponent/>
    </div>

    <div className="max-w-md px-2 mx-auto mt-1" >
      <form onSubmit={handleClick}>
      
      <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
      <p className="text-lg font-bold text-center">Report Options</p>
        <p className="text-lg font-semibold">Date Minimum</p>
        <input
          type="date"
          id="startDate"
          dateFormat="MM/dd/yyyy"
          value={startDate}
          onChange={(event) => SetStartDate(event.target.value)}
          placeholder="Appointment Date"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Date Maximum</p>
        <input
          type="date"
          id="stopDate"
          dateFormat="MM/dd/yyyy"
          value={stopDate}
          onChange={(event) => SetStopDate(event.target.value)}
          placeholder="Appointment Date"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

      <select
              id="departmentName"
              value={departmentName}
              required
              onChange={(event) => SetDepartmentName(event.target.value)}
              className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
              ${departmentName|| "text-gray-700"}`}
            >
              {/* <option className=" text-gray-400" value="" disabled selected hidden>--Select Hospital Department--</option> */}
              <option className="text-gray-700" value="All Departments (Default)" selected>All Departments (Default)</option>
              {assetL.map((department) => (
              <>
              <option key={department.id} className=" text-gray-700" value={department.departmentName}>{department.departmentName}</option>
              </> 
              ))}
            </select>

    <button
      
      className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Generate Report
    </button>
    </div>
    </form>
    </div>
    

    </>
  )
}
