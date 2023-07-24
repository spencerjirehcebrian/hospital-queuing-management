import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import EditQueueModal from '../modules/adminModules/EditQueueModal';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';


function WaitingQueueList(props) {

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [modifyKey, setModifyKey] = useState('');

    useEffect(() => {
        setLoading(true)
        const q = query(
            collection(db, 'queue'),
            orderBy('waitingQueueNumber', 'asc'),
            where('queueStatus', '==', 'Checked In'),
            where('waitingQueueNumber', '!=', props.queueNumber),
            )

          const unsubscribe = onSnapshot(q, (snapshot) => {
          const schedulesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQueues(schedulesData);
          setLoading(false)
        });
        
        return unsubscribe;

    }, [props.queueNumber]);

    const [isModifyOpen, setIsModifyOpen] = useState(false);

    function closeModifyModal() {
        setIsModifyOpen(false);
    }
  
    function openModifyModal(id) {
        setIsModifyOpen(true);
        setModifyKey(id)
    }
  
  
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>openModifyModal(queue.id)}>
            <h2 className="text-xl font-semibold">Queue Number: {queue.waitingQueueNumber}</h2>
            <p><span className="font-semibold">Appointment Number: </span> {queue.queueNumber}</p>
            <p><span className="font-semibold">Patient Name: </span> {queue.patientName}</p>
            <p><span className="font-semibold">Attending Doctor: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} to {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            
        
        </div>

        ))}
      </div>
    </div>

    <Transition appear show={isModifyOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModifyModal}
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
            <div className="inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  onClick={closeModifyModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Modify Appointment
              </Dialog.Title> 

              <EditQueueModal id={modifyKey} closeModifyModal={closeModifyModal}/>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    </>
  )
}

export default WaitingQueueList
