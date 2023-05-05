import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import exampleImage from './/header_logo.png';



export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()

    function pathMatchRoute(route) {
        if (route === location.pathname) return true
    }

  return (
    <div className='bg-green-100 border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div className='flex cursor-pointer' 
            onClick={() => navigate("/")}>
                <img src={exampleImage} alt="logo"className='h-6 px-1'/>
                <h1 className='h-5 '>Hospital Queuing Management System</h1>
            </div>

            <div>
                <ul className='flex space-x-10 '>
                    <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300 
                    ${pathMatchRoute("/") && "text-gray-900 border-b-green-500"}`}
                    onClick={()=> navigate("/")}>Home</li>

                    <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                    ${pathMatchRoute("/sign-in") && "text-gray-900 border-b-green-500"}`}
                    onClick={()=> navigate("/sign-in")}>Sign In</li>

                    <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[5px] cursor-pointer border-transparent transition duration-300
                    ${pathMatchRoute("/sign-up") && "text-gray-900 border-b-green-500"}`}
                    onClick={()=> navigate("/sign-up")}>Sign Up</li>
                </ul>
            </div>
        </header>
      
    </div>
  )
}
