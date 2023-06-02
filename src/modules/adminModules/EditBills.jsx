import {useEffect, useState} from 'react'
import { toast } from "react-toastify";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

import SelectPatientList from '../../functions/SelectPatientList';
import SelectQueueList from '../../functions/SelectQueueList';

export default function CreateBills() {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        billName: "",
        queueID: "",
        patientID: "",
        patientName: "",
        patientEmail: "",
        totalDue: 0,
        billDescription: "",
        billStatus: ""
      });

    const {
        billName,
        queueID,
        patientID,
        patientName,
        patientEmail,
        totalDue,
        billDescription,
        billStatus
    } = formData;

    function onChange(e) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
      }

      const params =  useParams();

      useEffect(() => {
          setLoading(true);
          async function fetchListing() {
            const docRef = doc(db, "bills", params.billID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setFormData({...docSnap.data()});
              setLoading(false);
            } else {
              navigate("/billing");
              toast.error("Bill does not exist");
            }
          }
          fetchListing();
      }, [navigate, params.billID]);
  
      async function onDeleteClick() {
          try {
          const documentRef = doc(db, 'bills', params.billID);
          await deleteDoc(documentRef);
            toast.success("Bill successfully deleted!");
            navigate("/billing");
          }catch (error){
            toast.error("Error deleting bills: ", error);
          }
        }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);


        try {

        await addDoc(collection(db, "bills"), formData);
        setLoading(false);
        toast.success("Customer Charged");
        navigate("/billing")
        }

        catch (error) {
          console.log(error)
          toast.error("Billing Failed\n" + error);
        }
    }

  // useEffect(() => {
  //     if (queueID) {
  //         const q = query(collection(db, 'schedules'), where('__name__', '==', queueID));
  //         getDocs(q).then((querySnapshot) => {
  //         if (!querySnapshot.empty) {
  //           const doc = querySnapshot.docs[0].data();

  //         const newData = {
  //           ...formData,
  //             scheduleStartTime: doc.startTime,
  //             scheduleEndTime: doc.endTime,
  //             doctorName: doc.doctorName
  //         };
  //         setFormData(newData);

  //         } else {
            
  //           // const newData = {
  //           //   ...formData,
  //           //   scheduleStartTime: "",
  //           //   scheduleEndTime: "",
  //           //   doctorName: ""
  //           //   }
  //           // setFormData(newData);
  //         }
  //       }).catch((error) => {
  //         console.error('Error fetching document:', error);
  //       });
  //     }

  // }, [queueID]);
  
  useEffect(() => {
      if (patientID) {
          const q = query(collection(db, 'users'), where('__name__', '==', patientID));
          getDocs(q).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0].data();

          const newData = {
              ...formData,
              patientName: doc.name,
              patientEmail: doc.email
          }
          setFormData(newData)
          } else {
            
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

  const [isPatientOpen, setIsPatientOpen] = useState(false);

    function closePatientModal() {
        setIsPatientOpen(false);
    }

    function openPatientModal() {
        setIsPatientOpen(true);
    }

    const [isQueueOpen, setIsQueueOpen] = useState(false);

    function closeQueueModal() {
        setIsQueueOpen(false);
    }

    function openQueueModal() {
        setIsQueueOpen(true);
    }

    function getPatientID (e){
        setFormData({
          ...formData,
          patientID: e
      })
    }

    function getQueueID (e){
        setFormData({
          ...formData,
          queueID: e
      })
    }


  return (
    <>
      <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">Update Bill Details</h1>
        <form onSubmit={onSubmit}>
          
          <p className="text-lg mt-6 font-semibold">Bill Name</p>
          <input
            type="text"
            id="billName"
            value={billName}
            onChange={onChange}
            placeholder="Schedule Name"
            maxLength="32"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
            rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />

          <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
          <p className="text-lg font-semibold">Appointment ID</p>
          <input
            type="text"
            id="queueID"
            value={queueID}
            onChange={onChange}
            placeholder="Appointment ID"
            maxLength="32"
            required
            disabled
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
            rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />

          <button
              type="button"
              onClick={openQueueModal}
                className="mb-6 w-full px-7 py-2 bg-amber-700 text-white font-medium text-sm uppercase rounded shadow-md
                  hover:bg-amber-800 hover:shadow-lg focus:bg-amber-800 focus:shadow-lg
                  active:bg-amber-950 active:shadow-lg transition duration-150 ease-in-out"
                  >

            Select Appointment to Bill
          </button>
          </div>

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
            id="patientEmail"
            value={patientEmail}
            onChange={onChange}
            placeholder="Patient Name"
            maxLength="32"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
            rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />

          <p className="text-lg font-semibold">Patient Email</p>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={onChange}
            placeholder="Patient Email"
            maxLength="32"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
            rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />

        <button
            type="button"
            onClick={openPatientModal}
              className="mb-6 w-full px-7 py-2 bg-amber-700 text-white font-medium text-sm uppercase rounded shadow-md
                hover:bg-amber-800 hover:shadow-lg focus:bg-amber-800 focus:shadow-lg
                active:bg-amber-950 active:shadow-lg transition duration-150 ease-in-out"
                >

          Select Patient
        </button>
        </div>

          <p className="text-lg font-semibold">Total Due</p>
          <input
            type="number"
            id="totalDue"
            value={totalDue}
            onChange={onChange}
            placeholder="Total Due"
            maxLength="32"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
            rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />

          <p className="text-lg font-semibold">Bill Description</p>
          <textarea
            type="text"
            id="billDescription"
            value={billDescription}
            onChange={onChange}
            placeholder="Bill Description"
            required
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
            rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />

          <p className="text-lg font-semibold">Bill Status</p>
          <select
          id="billStatus"
          value={billStatus}
          onChange={onChange}
          className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
          `}
        >
          <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Status--</option>
          <option className=" text-gray-700" value="Unpaid">Unpaid</option>
          <option className=" text-gray-700" value="Paid">Paid</option>
        </select>
          
        

      <button
        type="submit"
        className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
          hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
          active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Update Bill
      </button>
        </form>

        <button
        onClick={onDeleteClick}
        className="mb-6 w-full px-7 py-2 bg-amber-700 text-white font-medium text-sm uppercase rounded shadow-md
          hover:bg-amber-800 hover:shadow-lg focus:bg-amber-800 focus:shadow-lg
          active:bg-amber-900 active:shadow-lg transition duration-150 ease-in-out"
      >
        Delete Bill from Records
      </button>
      </main>

      <Transition appear show={isPatientOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closePatientModal}
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
                    onClick={closePatientModal}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Choose Patien
                </Dialog.Title> 
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    The following are all patients registered in the system
                  </p>
                  {/* Insert your content here */}
                  {isPatientOpen && <SelectPatientList closePatientModal={closePatientModal} getPatientID={getPatientID} />}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
    </Transition>

    <Transition appear show={isQueueOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeQueueModal}
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
                  onClick={closeQueueModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Choose Appointment to Bill
              </Dialog.Title> 
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  The following are all the appointments request and set in the hospital
                </p>
                {/* Insert your content here */}
                {isQueueOpen && <SelectQueueList closeQueueModal={closeQueueModal} getQueueID={getQueueID} />}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    </>
  )
  
}

