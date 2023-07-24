import React from 'react';

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStatus } from '../hooks/useAuthStatus';

import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import AddToQueueOutlinedIcon from '@mui/icons-material/AddToQueueOutlined';
import RemoveFromQueueOutlinedIcon from '@mui/icons-material/RemoveFromQueueOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';

import {HiQueueList} from 'react-icons/hi2';
import { FaUserDoctor } from "react-icons/fa6";

import logoImage from './/header_logo.png';

const Sidebars = (props) => {
    const { collapseSidebar } = useProSidebar();

    const location = useLocation()
    const navigate = useNavigate()

    const [pageState, setPageState] = useState("Sign in")

    function pathMatchRoute(route) {
        if (route === location.pathname) return true
    }

    const {loggedIn, checkingStatus, isAdmin, isDoctor} = useAuthStatus();

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setPageState("Profile");
        } else {
            setPageState("Sign In");
        }
        });
    }, [auth]);


    return (
      <div className='flex'>
      {/* <div className='bg-green-100 border-b shadow-sm sticky top-0 z-10'>
        <div className='flex items-center justify-start px-3 w-screen'>
            <div className='flex cursor-pointer pl-10 py-4' 
            onClick={() => collapseSidebar()}>
                <img src={logoImage} alt="logo"className='text-center h-6 px-1'/>
                <h1 className='h-5 '>Hospital Queuing Management System</h1>
            </div>
        </div>
      </div> */}

      <div id="app" className='fixed z-50' >
        <Sidebar 
        width='300px'
        defaultCollapsed="true"
        backgroundColor="rgb(187,247,208)"
        onBackdropClick={() => {collapseSidebar();}}
      >
          <Menu className='h-screen'>
            <MenuItem
              icon={<img src={logoImage} alt="logo"className='text-center h-6 px-1'/>}
              onClick={() => {
                collapseSidebar();
                props.handleSidebarToggle()
              }}
              style={({textAlign: "center"},  {height: "25vh"})}>

              <h1 className='text-center text-xl'>Hospital Queuing <br />Management System</h1>
            </MenuItem>

            {/* Home */}
            {/* <MenuItem
            onClick={()=> navigate("/")}
            className={`${pathMatchRoute("/") && "text-gray-900 border-b-green-500"}`}
            icon={<HomeOutlinedIcon />}>Home</MenuItem> */}

            {/* Admin Routes */}
            {!isDoctor &&(<>

            {loggedIn && (isAdmin && (<MenuItem
            icon={<AddToQueueOutlinedIcon />}
            onClick={()=> navigate("/waiting-queue")}>Waiting Queue</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<RemoveFromQueueOutlinedIcon />}
            onClick={()=> navigate("/service-queue")}>Service Queue</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<CalendarMonthOutlinedIcon />}
            onClick={()=> navigate("/queue")}>Appointments</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<ScheduleOutlinedIcon />}
            onClick={()=> navigate("/schedules")}>Schedules</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<GroupOutlinedIcon />}
            onClick={()=> navigate("/patients")}>Patients</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<MedicalServicesOutlinedIcon />}
            onClick={()=> navigate("/resources")}>Resources & Pricing</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<SafetyDividerIcon />}
            onClick={()=> navigate("/departments")}>Departments</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<FaUserDoctor />}
            onClick={()=> navigate("/doctors")}>Doctors</MenuItem>))}
                
            {loggedIn && (isAdmin && (<MenuItem
            icon={<AttachMoneyOutlinedIcon />}
            onClick={()=> navigate("/billing")}>Billing</MenuItem>))}

            {loggedIn && (isAdmin && (<MenuItem
            icon={<EqualizerOutlinedIcon />}
            onClick={()=> navigate("/report")}>Reports</MenuItem>))}                   
            
            </>)}
            
            {/* Patient Routes */}
            {!isDoctor &&(<>
            {loggedIn && (!isAdmin && (<MenuItem
            icon={<AddToQueueOutlinedIcon />}
            onClick={()=> navigate("/check-in")}>Check In</MenuItem>))}

            {loggedIn && (!isAdmin && (<MenuItem
            icon={<EditCalendarOutlinedIcon />}
            onClick={()=> navigate("/create-appointment")}>Schedule Appointment</MenuItem>))}

            {loggedIn && (!isAdmin && (<MenuItem
            icon={<CalendarTodayOutlinedIcon />}
            onClick={()=> navigate("/appointments")}>Your Appointments</MenuItem>))}

            {loggedIn && (!isAdmin && (<MenuItem
            icon={<HistoryOutlinedIcon />}
            onClick={()=> navigate("/patient-history")}>History</MenuItem>))}

            {loggedIn && (!isAdmin && (<MenuItem
            icon={<AttachMoneyOutlinedIcon />}
            onClick={()=> navigate("/statement-of-account")}>Hospital Bills</MenuItem>))}
            </>)}

            {/* Doctor Routes */}
            {loggedIn && (isDoctor && (<MenuItem
            icon={<EventOutlinedIcon />}
            onClick={()=> navigate("/doctor-appointments")}>Your Upcomming Appointments</MenuItem>))}

            {loggedIn && (isDoctor && (<MenuItem
            icon={<ScheduleOutlinedIcon />}
            onClick={()=> navigate("/doctor-schedule")}>Your Schedule</MenuItem>))}

            {/* Public Routes */}
            <MenuItem className={`${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) }`}
            onClick={()=> navigate("/profile")}
            icon={<AccountCircleOutlinedIcon />}>{pageState}</MenuItem>

            {!loggedIn && (<MenuItem
            icon={<AssignmentIndOutlinedIcon />}
            onClick={()=> navigate("/sign-up")}
            >Sign Up</MenuItem>)}


          </Menu>
        </Sidebar>
      </div>
      </div>
    );
};

export default Sidebars;
