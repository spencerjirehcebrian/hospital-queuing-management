import React from 'react'
import { useNavigate } from "react-router-dom";
import BillingList from '../../functions/BillingList';

export default function Schedules() {

    const navigate = useNavigate()

  return (
    <>
      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
      <h1 className="text-3xl text-center mt-14 font-bold">Billing Records</h1>
      <p className='text-1xl text-center mt-2 font-semibold'>View and update the Status of bills charged by the hospital</p>
          {/* <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={()=>navigate("/create-bills")}
          >Bill a Patient</button> */}

      </div>

      <div className="container mx-auto p-4">
        <BillingList />
      </div>
    </>
  )
}
