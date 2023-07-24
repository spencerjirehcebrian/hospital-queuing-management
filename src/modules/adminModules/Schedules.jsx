import React from 'react'
import { useNavigate } from "react-router-dom";
import ScheduleList from '../../functions/ScheduleList';

export default function Schedules() {

    const navigate = useNavigate()

  return (
    <>
      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
      <h1 className="text-3xl text-center m-14 font-bold">Manage Schedules</h1>
          <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={()=>navigate("/create-schedule")}
          >Create Schedule</button>
      </div>

      <div className="container mx-auto p-4">
        <ScheduleList />
      </div>
    </>
  )
}
