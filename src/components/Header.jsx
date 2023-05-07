import React from 'react'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import exampleImage from './/header_logo.png';
import { useAuthStatus } from '../hooks/useAuthStatus';



export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()

    const [pageState, setPageState] = useState("Sign in")

    function pathMatchRoute(route) {
        if (route === location.pathname) return true
    }

    const {loggedIn, checkingStatus, isAdmin} = useAuthStatus();

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setPageState("Profile");
        } else {
            setPageState("Sign in");
        }
        });
    }, [auth]);


  return (
    <div className='bg-green-100 border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl  mx-auto'>
            <div className='flex cursor-pointer' 
            onClick={() => navigate("/")}>
                <img src={exampleImage} alt="logo"className='h-6 px-1'/>
                <h1 className='h-5 '>Hospital Queuing Management System</h1>
            </div>

            <div>
                <ul className='flex space-x-5'>

                    {loggedIn && (isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                    ${pathMatchRoute("/queue") && "text-gray-900 border-b-green-500"}`}
                    onClick={()=> navigate("/queue")}>Appointment Queue</li>))}

                    {loggedIn && (isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/schedules") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/schedules")}>Schedule Management</li>))}
                        
                    {loggedIn && (isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/patients") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/patients")}>Patient Management</li>))}

                    {loggedIn && (isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/billing") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/billing")}>Billing</li>))}


                    
                    {loggedIn && (!isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/create-appointment") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/create-appointment")}>Schedule an Appointment</li>))}

                    {loggedIn && (!isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/appointments") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/appointments")}>Your Appointments</li>))}

                    {loggedIn && (!isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/patient-history") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/patient-history")}>History</li>))}

                    {loggedIn && (!isAdmin && (<li className={`py-3 text-sm text-center font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                        ${pathMatchRoute("/statement-of-account") && "text-gray-900 border-b-green-500"}`}
                        onClick={()=> navigate("/statement-of-account")}>Statement of Account</li>))}



                    
                    <li className={`py-3 text-sm font-semibold text-center text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                    ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-gray-900 border-b-green-500"}`}
                    onClick={()=> navigate("/profile")}>{pageState}</li>

                    {!loggedIn && (<li className={`py-3 text-sm font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                    ${pathMatchRoute("/sign-up") && "text-gray-900 border-b-green-500"}`}
                    onClick={()=> navigate("/sign-up")}>Sign Up</li>)}

                </ul>
            </div>
        </header>
      
    </div>
  )
}
