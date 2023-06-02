import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

import { useAuthStatus } from '../hooks/useAuthStatus';

import Spinner from './Spinner';

export default function DoctorRoute() {
    const {loggedIn, checkingStatus, isDoctor } = useAuthStatus();

  
    if (checkingStatus) 
    {
      return <Spinner />
    }
    
  return isDoctor && loggedIn ? <Outlet /> : <Navigate to="/" />;
}
