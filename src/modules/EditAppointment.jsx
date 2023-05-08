import {useEffect, useState} from 'react'
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp,query,orderBy,limit,getDocs,where, onSnapshot, doc, getDoc, Firestore, updateDoc,deleteDoc } from "firebase/firestore";
import { app, db } from "../firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';
import SelectPatientList from '../functions/SelectPatientList';
import SelectScheduleList from '../functions/SelectScheduleList';


export default function EditAppointment() {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        queueNumber: "",
        patientID: "",
        patientName: "",
        patientEmail: "",
        queueDate: "",
        queueDescription: "",
        scheduleID: "",
        doctorName: "",
        scheduleStartTime: "",
        scheduleEndTime: "",
        queueStatus: ""
      });

    const {
        queueNumber,
        patientID,
        patientName,
        patientEmail,
        queueDate,
        queueDescription,
        scheduleID,
        doctorName,
        scheduleStartTime,
        scheduleEndTime,
        queueStatus
    } = formData;

    const params =  useParams();

    useEffect(() => {
        setLoading(true);

        async function fetchListing() {
          const docRef = doc(db, "queue", params.appointmentID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              setFormData({...docSnap.data()});
            setLoading(false);
          } else {
            navigate("/queue");
            toast.error("Appointment does not exist");
          }
        }

        fetchListing();
    }, [navigate, params.appointmentID]);

    useEffect(() => {
        if (scheduleID) {
            const q = query(collection(db, 'schedules'), where('__name__', '==', scheduleID));
            getDocs(q).then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0].data();

            const newData = {
              ...formData,
                scheduleStartTime: doc.startTime,
                scheduleEndTime: doc.endTime,
                doctorName: doc.doctorName
            };
            setFormData(newData);

            } else {
              //console.log(`No document found with ID ${scheduleID}`);
              
              const newData = {
                ...formData,
                scheduleStartTime: "",
                scheduleEndTime: "",
                doctorName: ""
                }
              setFormData(newData);
            }
          }).catch((error) => {
            console.error('Error fetching document:', error);
          });
        }

    }, [scheduleID]);
    
    useEffect(() => {
        if (patientID) {
            const q = query(collection(db, 'users'), where('__name__', '==', patientID));
            getDocs(q).then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0].data();
              //setResult(`Found document with ID ${patientID}. Field1: ${doc.name}, Field2: ${doc.email}`);

            const newData = {
                ...formData,
                patientName: doc.name,
                patientEmail: doc.email
            }
            setFormData(newData)
            } else {
              //console.log(`No document found with ID ${scheduleID}`);
              
              const newData = {
                ...formData,
                patientName: "",
                patientEmail: ""
                }
                setFormData(newData)
            }
          }).catch((error) => {
            console.error('Error fetching document:', error);
          });
        }

    }, [patientID]);

    function onChange(e) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        setLoading(true);
        try {
          
          const docRef = doc(db, "queue", params.appointmentID);
            await updateDoc(docRef, {
            ...formData,
            });
          setLoading(false);
          toast.success("Changes Saved");
          navigate("/appointments")
          }

        catch (error) {
          console.log(error)
          toast.error("Changes Failed\n" + error);
          setLoading(false);
        }
    }

    async function onClickDelete() {
        setLoading(true);
        try {
            const documentRef = doc(db, 'queue', params.queueID);
            await deleteDoc(documentRef);
              toast.success("Successfully remove from Queue");
              navigate("/appointments");
              setLoading(false);
            }catch (error){
              toast.error("Error deleting document: ", error);
              setLoading(false);
            }

    }

    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    function closeScheduleModal() {
        setIsScheduleOpen(false);
    }

    function openScheduleModal() {
        setIsScheduleOpen(true);
    }

    function getScheduleID (e){
        setFormData({
          ...formData,
          scheduleID: e
      })
    }



    if (loading) {
        return <Spinner />;
      }
  return (
    <>
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Appointment</h1>
      <form onSubmit={onSubmit}>
        
        <p className="text-lg mt-6 font-semibold">Queue Number</p>
        <input
          type="text"
          id="queueNumber"
          value={queueNumber}
          
          placeholder="Queue Number"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

<div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
        <p className="text-lg font-semibold">Patient ID</p>
        <input
          type="text"
          id="patientID"
          value={patientID}
          onChange={onChange}
          placeholder="Patient ID"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Patient Name</p>
        <input
          type="text"
          id="patientName"
          value={patientName}
          onChange={onChange}
          placeholder="Patient Name"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Patient Email</p>
        <input
          type="text"
          id="patientEmail"
          value={patientEmail}
          onChange={onChange}
          placeholder="Patient Email"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2"
        />
        </div>

        <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
        <p className="text-lg font-semibold">Appointment Date</p>
        <input
          type="date"
          id="queueDate"
          dateFormat="MM/dd/yyyy"
          value={queueDate}
          selected={queueDate}
          onChange={onChange}
          placeholder="Appointment Date"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />



        <p className="text-lg font-semibold">Schedule ID</p>
        <input
          type="text"
          id="scheduleID"
          value={scheduleID}
          onChange={onChange}
          placeholder="Schedule ID"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        
        <p className="text-lg font-semibold">Doctor Name</p>
        <input
          type="text"
          id="doctorName"
          value={doctorName}
          onChange={onChange}
          placeholder="Doctor Name"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Schedule Start Time</p>
        <TimePicker
          id="scheduleStartTime"
          name="scheduleStartTime"
          onChange={onChange}
          format="hh:mm a"
          value={scheduleStartTime}
          clearIcon={null}
          required
          disabled
          className="w-full mb-6 h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />



        <p className="text-lg font-semibold">Schedule End Time</p>
        <TimePicker
          id="scheduleEndTime"
          name="scheduleEndTime"
          onChange={onChange}
          format="hh:mm a"
          value={scheduleEndTime}
          clearIcon={null}
          required
          disabled
          className="w-full mb-6 h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />

<button
         type="button"
         onClick={openScheduleModal}
            className="mb-6 w-full px-7 py-2 bg-amber-700 text-white font-medium text-sm uppercase rounded shadow-md
                hover:bg-amber-800 hover:shadow-lg focus:bg-amber-800 focus:shadow-lg
                active:bg-amber-950 active:shadow-lg transition duration-150 ease-in-out"
            >
            Select Schedule & Doctor
        </button>
      
        </div>

        <p className="text-lg font-semibold">Appointment Description</p>
        <textarea
          type="text"
          id="queueDescription"
          value={queueDescription}
          onChange={onChange}
          placeholder="Appointment Description"
          maxLength="32"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />


        {/* <p className="text-lg font-semibold">Queue Status</p>
        <select
        id="queueStatus"
        value={queueStatus}
        onChange={onChange}
        className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
         `}
      >
        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Status--</option>
        <option className=" text-gray-700" value="Pending">Pending</option>
        <option className=" text-gray-700" value="Set">Set</option>
        <option className=" text-gray-700" value="Completed">Completed</option>
        <option className=" text-gray-700" value="Missed">Missed</option>
      </select> */}
        
      

    <button
      type="submit"
      className="mb-4 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Submit Appointment Request
    </button>
      </form>
      <button
      onClick={onClickDelete}
      className='mb-6 w-full bg-amber-700 text-white px-7 py-2 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
    >
      Delete from Queue
    </button>
    </main>

    <Transition appear show={isScheduleOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeScheduleModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  onClick={closeScheduleModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Choose Schedules and Doctors Availiable
              </Dialog.Title> 
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  The following are the availiable schedules and doctors on the chosen date
                </p>
                {/* Insert your content here */}
                {isScheduleOpen && <SelectScheduleList closeScheduleModal={closeScheduleModal} getScheduleID={getScheduleID} />}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

    </>
  )
  
}


