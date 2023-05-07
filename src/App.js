
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/Home';
import SignIn from './modules/SignIn';
import SignUp from './modules/SignUp';
import Profile from './modules/Profile';
import Header from './components/Header';

import PrivateRoute from './components/PrivateRoute';

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

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>

          <Route path="/create-appointment" element={<CreateAppointment/>}/>
          <Route path="/appointments" element={<Appointments/>}/>
          <Route path="/patient-history" element={<PatientHistory/>}/>
          <Route path="/statement-of-account" element={<StatementOfAccount/>}/>

          <Route path="/schedules" element={<Schedules/>}/>
          <Route path="/create-schedule" element={<CreateSchedules/>}/>
          <Route path="/edit-schedule/:scheduleID" element={<EditSchedules/>}/>

          <Route path="/patients" element={<Patients/>}/>
          <Route path="/create-patient" element={<CreatePatient/>}/>
          <Route path="/edit-patient/:patientID" element={<EditPatient/>}/>

          <Route path="/billing" element={<Billing/>}/>
          <Route path="/create-bills" element={<CreateBills/>}/>
          <Route path="/edit-bills/:billID" element={<EditBills/>}/>

          <Route path="/queue" element={<Queue/>}/>
          <Route path="/create-queue" element={<CreateQueue/>}/>
          <Route path="/edit-queue/:queueID" element={<EditQueue/>}/>

          <Route path='/profile' element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile/>}/>
          </Route>
          
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
