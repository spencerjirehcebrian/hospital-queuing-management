import React from 'react'
import { useNavigate } from "react-router-dom";
import DoctorScheduleList from '../../functions/DoctorScheduleList';

export default function DoctorSchedules() {

    const navigate = useNavigate()

  return (
    <>
          <h1 className="text-3xl text-center mt-6 font-bold">Your Schedules</h1>
      <p className='text-1xl text-center mt-3 font-semibold'>Modify your schedules and their vailability</p>

      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
          <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={()=>navigate("/create-doctor-schedule")}
          >Create Schedule</button>

      </div>

      <div className="container mx-auto p-4">
        <DoctorScheduleList />
      </div>
    </>
  )
}
