
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/publicModules/Home';
import SignIn from './modules/publicModules/SignIn';
import SignUp from './modules/publicModules/SignUp';
import Profile from './modules/publicModules/Profile';
import Header from './components/Header';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import DoctorRoute from './components/DoctorRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Schedules from './modules/adminModules/Schedules';
import CreateSchedules from './modules/adminModules/CreateSchedule';
import EditSchedules from './modules/adminModules/EditSchedule';

import Patients from './modules/adminModules/Patients';
import CreatePatient from './modules/adminModules/CreatePatient';
import EditPatient from './modules/adminModules/EditPatient';

import Billing from './modules/adminModules/Billing';
import CreateBills from './modules/adminModules/CreateBills';
import EditBills from './modules/adminModules/EditBills';

import Doctors from './modules/adminModules/Doctors';
import CreateDoctors from './modules/adminModules/CreateDoctors';
import EditDoctors from './modules/adminModules/EditDoctors';

import Queue from './modules/adminModules/Queue';
import CreateQueue from './modules/adminModules/CreateQueue';
import EditQueue from './modules/adminModules/EditQueue';
import CreateAppointment from './modules/patientModules/CreateAppointment';
import Appointments from './modules/patientModules/Appointments';
import PatientHistory from './modules/patientModules/PatientHistory';
import StatementOfAccount from './modules/patientModules/StatementOfAccount';
import EditAppointment from './modules/patientModules/EditAppointment';
import ShowHistory from './modules/patientModules/ShowHistory';
import ShowStatementOfAccount from './modules/patientModules/ShowStatementOfAccount';

import CheckIn from './modules/patientModules/CheckIn';
import SelectCheckIn from './modules/patientModules/SelectCheckIn';
import ConfirmCheckIn from './modules/patientModules/ConfirmCheckIn.jsx';

import WaitingQueue from './modules/adminModules/WaitingQueue';

import DoctorSchedule from './modules/doctorModules/DoctorSchedule';
import CreateDoctorSchedule from './modules/doctorModules/CreateDoctorSchedule';
import EditDoctorSchedule from './modules/doctorModules/EditDoctorSchedule';

import DoctorAppointment from './modules/doctorModules/DoctorAppointments';

import Report from './modules/adminModules/Report';

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

          <Route path="/check-in" element={<PrivateRoute />}><Route path="/check-in" element={<CheckIn/>}/></Route>
          <Route path="/check-in-select" element={<PrivateRoute />}><Route path="/check-in-select"  element={<SelectCheckIn/>}/></Route>
          <Route path="/check-in-confirm/:appointmentID" element={<PrivateRoute />}><Route path="/check-in-confirm/:appointmentID" element={<ConfirmCheckIn/>}/></Route>

          {/* Doctor */}
          <Route path="/doctor-schedule" element={<DoctorRoute />}><Route path="/doctor-schedule" element={<DoctorSchedule/>}/></Route>
          <Route path="/create-doctor-schedule" element={<DoctorRoute />}><Route path="/create-doctor-schedule" element={<CreateDoctorSchedule/>}/></Route>
          <Route path="/edit-doctor-schedule/:doctorscheduleID" element={<DoctorRoute />}><Route path="/edit-doctor-schedule/:doctorscheduleID" element={<EditDoctorSchedule/>}/></Route>

          <Route path="/doctor-appointments" element={<DoctorRoute />}><Route path="/doctor-appointments" element={<DoctorAppointment/>}/></Route>
          
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
          
         <Route path="/waiting-queue" element={<AdminRoute />}><Route path="/waiting-queue" element={<WaitingQueue/>}/></Route>
          <Route path="/create-queue" element={<AdminRoute />}><Route path="/create-queue" element={<CreateQueue/>}/></Route>
          <Route path="/edit-queue/:queueID" element={<AdminRoute />}><Route path="/edit-queue/:queueID" element={<EditQueue/>}/></Route>

          <Route path="/doctors" element={<AdminRoute />}><Route path="/doctors" element={<Doctors/>}/></Route>
          <Route path="/create-doctor" element={<AdminRoute />}><Route path="/create-doctor" element={<CreateDoctors/>}/></Route>
          <Route path="/edit-doctor/:doctorID" element={<AdminRoute />}><Route path="/edit-doctor/:doctorID" element={<EditDoctors/>}/></Route>

          <Route path="/report" element={<AdminRoute />}><Route path="/report" element={<Report/>}/></Route>


    
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
