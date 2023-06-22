import React from 'react'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import exampleImage from './/header_logo.png';
import { useAuthStatus } from '../hooks/useAuthStatus';



export default function Sidebar() {
  return (
    <div className="sidebar bg-gray-800 text-white">
        <ul className="p-4">
          <li className="py-2">Home</li>
          <li className="py-2">About</li>
          <li className="py-2">Contact</li>
        </ul>
      </div>
  )
}
