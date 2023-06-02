import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import GetAverageWaitTimeDepartment from '../../functions/GetAverageWaitTimeDepartment.jsx'
import { addDoc, collection, serverTimestamp, query, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function Report() {

  const [startDate, SetStartDate] = useState('')
  const [stopDate, SetStopDate] = useState('')
  const [departmentName, SetDepartmentName] = useState('')
  const [assetL, setAssetL] = useState([]);

  var reportList = []
  
  const handleClick = () => {
    GetAverageWaitTimeDepartment(departmentName, startDate, stopDate)
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
    <div className="max-w-md px-2 mx-auto mt-10" >
        
      <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
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
              <option className=" text-gray-400" value="" disabled selected hidden>--Select Hospital Department--</option>
              {assetL.map((department) => (
              <>
              <option key={department.id} className=" text-gray-700" value={department.departmentName}>{department.departmentName}</option>
              </> 
              ))}
            </select>

    <button
      onClick={handleClick}
      className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Generate Report
    </button>
    </div>
    </div>
    </>
  )
}
