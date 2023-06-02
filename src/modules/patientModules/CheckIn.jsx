import React, {useState, useEffect} from 'react'
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { getFirestore, collection, onSnapshot, updateDoc, doc, getDoc, query, where, getDocs, FieldValue } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";
import PublicWaitingQueueList from '../../functions/PublicWaitingQueueList.jsx';
import Spinner from '../../components/Spinner';


import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

import CheckInList from '../../functions/CheckInList';

import { toast } from "react-toastify";

import { UpdateAverageWaitTime } from '../../functions/UpdateAverageWaitTime.jsx';

export default function CheckIn() {


    const auth = getAuth();

    const navigate = useNavigate()

    const [queues, setQueues] = useState([]);
    const [empty, setEmpty] = useState(true);

    const [value, setValue] = useState(0);

    const [loading, setLoading] = useState(false);
    const [checkedIn, setCheckedIn] = useState(false);
    const [userAppointmentID, setUserAppointmentID] = useState("");

    const [isCheckInListOpen, setIsCheckInListOpen] = useState(false);

    const avg = UpdateAverageWaitTime()

    useEffect(() => {
        setLoading(true)
        
        const fetchData = async () => {

        const docRef1 = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef1);
        const data1 = docSnap.data();
        setCheckedIn(data1.isCheckedIn)
        setUserAppointmentID(data1.appointmentID)

        const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');
        const snapshot = await getDoc(docRef);

        const data = snapshot.data();
        const retrievedValue = data.currentQueueNumber;
        setValue(data.currentQueueNumber)

        const q = query(
            collection(db, 'queue'),
            where('queueStatus', "in", ["Checked In"]),
            where('waitingQueueNumber', '==', data.currentQueueNumber)
        );
        
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
            setEmpty(true)
            setLoading(false)
            
        } else {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const queuesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }));
                setEmpty(false)
                setQueues(queuesData)
                setLoading(false)
            
                return unsubscribe;
            })
        }
    
  
      };
  
        fetchData()
      }, [isCheckInListOpen, checkedIn]);


  async function setAsSet() {
    const collectionName = "queue";
    const documentId = userAppointmentID; 
    const fieldToUpdate = "queueStatus";
    const updatedValue = "Set";

    const documentRef = doc(db, collectionName, documentId);
    const updateData = {
      [fieldToUpdate]: updatedValue
    };

    updateDoc(documentRef, updateData)
      .then(() => {
        
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });


    const documentRef1 = doc(db, "users", auth.currentUser.uid);
    const updateData1 = {
    isCheckedIn: false,
    appointmentID: null
    };

    updateDoc(documentRef1, updateData1)
    .then(() => {
        setCheckedIn(false)
        toast.success("Checked Out")
    })
    .catch((error) => {
        console.error("Error updating document:", error);
    });
    };



  function closeCheckInListModal() {
    setIsCheckInListOpen(false);
  }

  function openCheckInListModal() {
    setIsCheckInListOpen(true);
  }

  
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
     
      <div className="w-full md:w-[100%] flex flex-col justify-between mt-20 px-[25%]" >
        <div class="flex flex-grow space-x-5 items-center">
            <h1 className="text-2xl text-center font-bold m-auto">Currently Serving</h1>
        </div>
        <div class="flex flex-grow space-x-5 items-center">
            <p class="m-auto">Queue Number</p>
        </div>
        <div class="flex flex-grow space-x-5 items-center mt-12  mb-10 font-bold text-8xl">
        <p class="m-auto">{value}</p>
        </div>
        
        

        <div class="flex flex-grow space-x-5 mb-5 items-center">
        <p className="m-auto">Estimated Wait Time until Next Appointment: <span className="font-semibold text-xl">{avg}</span> minutes</p>

        </div>

        {empty && (<div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex justify-center">
        <h2 className='items-center mt-12 mb-10 text-2xl'>No Appointment Checked into this Number</h2>
        </div>

        <hr class="border border-gray-300 m-5"></hr>
          </div>
      
      )}

        {!empty &&(<div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div>
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-appointment/${queue.id}`)}>
            <p><span className="font-semibold">Patient Name: </span> {queue.patientName}</p>
            <p><span className="font-semibold">Attending Doctor: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} to {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            <p><span className="font-semibold">Status: </span> {queue.waitingQueueNumber}</p>
            </div>
            
        
       <hr class="border border-gray-300 m-5"></hr>


          </div>
        ))}


      </div>)}

      {checkedIn &&(<div class="flex flex-grow space-x-5 mb-5 items-center">
      <p className="m-auto">Estimated Wait Time until Your Appointment: <span className="font-semibold text-xl">{(queues.length * avg)}</span> minutes</p>

        </div>)}

      {!checkedIn && (<div class="flex flex-grow space-x-5 mt-2">
            
        <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
              hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
              onClick={openCheckInListModal}
              >Check-In your Appointment into the Queue</button>
    
            </div> )}
    
            {checkedIn && (<div class="flex flex-grow space-x-5 ">
    
           
              <button className='mb-6 w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
                hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
              onClick={setAsSet}
              >Check-Out of Queue</button>
    
              
              </div>)}
    
              <hr class="border border-gray-300 m-5"></hr>
      <div class="flex flex-grow space-x-5">
    
</div>

</div>
    <div className="container mx-auto p-1">
    
    <h1 className="text-2xl text-center font-bold m-auto mb-3">Public Appointments In Queue</h1>
    
        {!loading && (<PublicWaitingQueueList queueNumber={value}/>)}
      </div>


    
      <Transition appear show={isCheckInListOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeCheckInListModal}
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
                  onClick={closeCheckInListModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Choose One of Your Appointments to Check-In
              </Dialog.Title> 
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  The following are your appointments that have not been Completed or Checked-In
                </p>
                {/* Insert your content here */}
                {isCheckInListOpen && <CheckInList closeCheckInListModal={closeCheckInListModal}/>}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

    </>


  )
}
