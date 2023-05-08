import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

import { useAuthStatus } from '../hooks/useAuthStatus';
import useAuthAdminStatus from "../hooks/useAuthAdminStatus"
import Spinner from './Spinner';

export default function AdminRoute() {
    const {loggedIn, checkingStatus, isAdmin } = useAuthStatus();

    console.log("meow", loggedIn, checkingStatus, isAdmin)
    if (checkingStatus) {
      return <Spinner />
  }
    
  return isAdmin && loggedIn ? <Outlet /> : <Navigate to="/" />;
}
