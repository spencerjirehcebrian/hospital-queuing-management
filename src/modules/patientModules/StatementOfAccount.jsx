import React from 'react'
import { useNavigate } from "react-router-dom";
import StatementOfAccountList from '../../functions/StatementOfAccountList';

export default function StatementOfAccount() {

    const navigate = useNavigate()

  return (
    <>
      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
      <h1 className="text-3xl text-center mt-6 font-bold">Statement of Account</h1>
      <p className='text-1xl text-center mt-3 font-semibold'>Your paid and unpaid hospital Bills</p>
      </div>

      <div className="container mx-auto p-4">
        <StatementOfAccountList />
      </div>
    </>
  )
}
