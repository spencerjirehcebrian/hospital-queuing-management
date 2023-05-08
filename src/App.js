
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/Home';
import SignIn from './modules/SignIn';
import SignUp from './modules/SignUp';
import Profile from './modules/Profile';
import Header from './components/Header';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Schedules from './modules/Schedules';
import CreateSchedules from './modules/CreateSchedule';
import EditSchedules from './modules/EditSchedule';

import Patients from './modules/Patients';
import CreatePatient from './modules/CreatePatient';
import EditPatient from './modules/EditPatient';

import Billing from './modules/Billing';
import CreateBills from './modules/CreateBills';
import EditBills from './modules/EditBills';

import Queue from './modules/Queue';
import CreateQueue from './modules/CreateQueue';
import EditQueue from './modules/EditQueue';
import CreateAppointment from './modules/CreateAppointment';
import Appointments from './modules/Appointments';
import PatientHistory from './modules/PatientHistory';
import StatementOfAccount from './modules/StatementOfAccount';
import EditAppointment from './modules/EditAppointment';
import ShowHistory from './modules/ShowHistory';
import ShowStatementOfAccount from './modules/ShowStatementOfAccount';

import { Helmet } from 'react-helmet';

function App() {
  return (
    <>
    <Helmet>
        <title>Hospital Queueing Management System</title>
      </Helmet>

      <Router>
        <Header/>
        <Routes>

          {/* Any User */}
          <Route path="/" element={<Home/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>

          {/* Login */}
          <Route path='/profile' element={<PrivateRoute />}><Route path="/profile" element={<Profile/>}/></Route>

          {/* Patient */}
          <Route path="/appointments" element={<PrivateRoute />}><Route path="/appointments" element={<Appointments/>}/></Route>
          <Route path="/create-appointment" element={<PrivateRoute />}><Route path="/create-appointment" element={<CreateAppointment/>}/></Route>
          <Route path="/edit-appointment/:appointmentID" element={<PrivateRoute />}><Route path="/edit-appointment/:appointmentID" element={<EditAppointment/>}/></Route>

          <Route path="/patient-history" element={<PrivateRoute />}><Route path="/patient-history" element={<PatientHistory/>}/></Route>
          <Route path="/show-history/:appointmentID" element={<PrivateRoute />}><Route path="/show-history/:appointmentID" element={<ShowHistory/>}/></Route>

          <Route path="/statement-of-account" element={<PrivateRoute />}><Route path="/statement-of-account" element={<StatementOfAccount/>}/></Route>
          <Route path="/show-statement-of-account/:billID" element={<PrivateRoute />}><Route path="/show-statement-of-account/:billID" element={<ShowStatementOfAccount/>}/></Route>

          {/* Admin */}
          <Route path="/schedules" element={<AdminRoute />}><Route path="/schedules" element={<Schedules/>}/></Route>
          <Route path="/create-schedule" element={<AdminRoute />}><Route path="/create-schedule" element={<CreateSchedules/>}/></Route>
          <Route path="/edit-schedule/:scheduleID" element={<AdminRoute />}><Route path="/edit-schedule/:scheduleID" element={<EditSchedules/>}/></Route>
          
          <Route path="/patients" element={<AdminRoute />}><Route path="/patients" element={<Patients/>}/></Route>
          <Route path="/create-patient" element={<AdminRoute />}><Route path="/create-patient" element={<CreatePatient/>}/></Route>
          <Route path="/edit-patient/:patientID" element={<AdminRoute />}><Route path="/edit-patient/:patientID" element={<EditPatient/>}/></Route>

          <Route path="/billing" element={<AdminRoute />}><Route path="/billing" element={<Billing/>}/></Route>
          <Route path="/create-bills" element={<AdminRoute />}><Route path="/create-bills" element={<CreateBills/>}/></Route>
          <Route path="/edit-bills/:billID" element={<AdminRoute />}><Route path="/edit-bills/:billID" element={<EditBills/>}/></Route>

          <Route path="/queue" element={<AdminRoute />}><Route path="/queue" element={<Queue/>}/></Route>
          <Route path="/create-queue" element={<AdminRoute />}><Route path="/create-queue" element={<CreateQueue/>}/></Route>
          <Route path="/edit-queue/:queueID" element={<AdminRoute />}><Route path="/edit-queue/:queueID" element={<EditQueue/>}/></Route>
    
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    </>
  );
}

export default App;
