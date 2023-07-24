import {useEffect, useState} from 'react'
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp ,query,orderBy,limit,getDocs,where, onSnapshot, doc, getDoc, Firestore } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

import SelectPatientList from '../../functions/SelectPatientList';
import SelectScheduleList from '../../functions/SelectScheduleList';
import SelectResourceList from '../../functions/SelectResourceList';


export default function CreateQueueModal(props) {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()

    const [newQueueNum, setNewQueueNum] = useState(0);

    const [highestValue, setHighestValue] = useState(0)

    const [formData, setFormData] = useState({
        queueNumber: newQueueNum,
        patientID: "",
        patientName: "",
        patientEmail: "",
        patientSex: "",
        patientAge:"",
        queueDate: "",
        queueDescription: "",
        scheduleID: "",
        doctorName: "", 
        departmentName: "",
        scheduleStartTime: "",
        scheduleEndTime: "",
        medicalCondition: "",
        queueStatus: ""
      });

    const {
        queueNumber,
        patientID,
        patientName,
        patientEmail,
        patientSex,
        patientAge,
        queueDate,
        queueDescription,
        scheduleID,
        doctorName,
        departmentName,
        scheduleStartTime,
        scheduleEndTime,
        medicalCondition,
        queueStatus
    } = formData;

    const [dataArray, setDataArray] = useState([]);

    const addElement = (newElement) => {
      setDataArray((prevDataArray) => [...prevDataArray, newElement]);
    };

    const removeElement = (index) => {
      const updatedArray = dataArray.filter((_, i) => i !== index);
      setDataArray(updatedArray);
    };
  


    useEffect(() => {
      const getUsers = async () => {
        try {
          setLoading(true);
          const usersRef = collection(db, "queue");
          const q = query(usersRef, orderBy("queueNumber", "desc"), limit(1));
          const q1 = doc(db, "users", auth.currentUser.uid);
          const [queueSnapshot, userSnapshot] = await Promise.all([
            getDocs(q),
            getDoc(q1)
          ]);

          if (queueSnapshot.size === 0) {
              const newData = {
                  ...formData,
                  queueNumber: 1,
                  };
              setFormData(newData);
          } else {
              if (userSnapshot.exists()) {
                  const highestScore = queueSnapshot.docs[0].data().queueNumber;
                  const newNum1 = highestScore + 1;

                  const newData = {
                      ...formData ,
                          queueNumber: newNum1
                      };
                  setFormData(newData);
                  }
          }
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      getUsers();
    }, []);

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
                doctorName: doc.doctorName,
                departmentName: doc.departmentName 
            };
            setFormData(newData);

            } else {

              const newData = {
                ...formData,
                scheduleStartTime: "",
                scheduleEndTime: "",
                doctorName: "",
                departmentName: ""  
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

            const newData = {
                ...formData,
                patientName: doc.name,
                patientEmail: doc.email,
                patientSex: doc.sex,
                patientAge: doc.age
            }
            setFormData(newData)
            } else {

              const newData = {
                ...formData,
                patientName: "",
                patientEmail: "",
                patientSex: "",
                patientAge:""
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
        setLoading(true)
        e.preventDefault()

        const q = query(
        collection(db, "queue")
        );

        const fieldValues = []

        getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            fieldValues.push(doc.data().waitingQueueNumber);
          });
          const integersOnly = fieldValues.filter((value) => Number.isInteger(value));

          const maxQueueingNumber = (Math.max(...integersOnly)) + 1

          var formDataCopy;

          if (queueStatus == 'Checked In'){
            formDataCopy = {...formData}
            formDataCopy.waitingQueueNumber = maxQueueingNumber;
            formDataCopy.timeCheckIn = serverTimestamp();
          }

          try {
            addDoc(collection(db, "queue"), formDataCopy)
              .then((docRef) => {
                dataArray.forEach(async (element) => {
                  const updatedElement = { ...element,
                    billAppointmentID: docRef.id,
                    billAppointmentDate: queueDate,
                    billPatientName: patientName,
                    billPatientEmail: patientEmail,};
                  addDoc(collection(db, "bills"), updatedElement)
                  .then((docRef1) => {

                  })
                  .catch((error) => {
                    toast.error('Error adding document:', error);
                    console.error('Error adding document:', error);
                    props.closeDialogModal()
                  });
                });

                toast.success("Appointment Created");
                setLoading(false);
                props.closeDialogModal()

              })
              .catch((error) => {
                toast.error('Error adding document:', error);
                console.error('Error adding document:', error);
              });
            }

          catch (error) {
            console.log(error)
            toast.error("Appointment Failed\n" + error);
          }

        })
        .catch((error) => {
          console.error("Error getting documents:", error);
        });


        
    }

    const [isPatientOpen, setIsPatientOpen] = useState(false);

    function closePatientModal() {
        setIsPatientOpen(false);
    }

    function openPatientModal() {
        setIsPatientOpen(true);
    }

    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    function closeScheduleModal() {
        setIsScheduleOpen(false);
    }

    function openScheduleModal() {
        setIsScheduleOpen(true);
    }

    const [isResourceOpen, setIsResourceOpen] = useState(false);

    function closeResourceModal() {
        setIsResourceOpen(false);
    }

    function openResourceModal() {
        setIsResourceOpen(true);
    }


    function getPatientID (e){
        setFormData({
          ...formData,
          patientID: e
      })
    }

    function getScheduleID (e){
        setFormData({
          ...formData,
          scheduleID: e
      })
    }

    function getResourceID (e){
      setFormData({
        ...formData,
        scheduleID: e
    })

  }



  return (
    <>
    <main className="max-w-full px-2 mx-auto">
        <form onSubmit={onSubmit}>
        <div className='flex flex-col-2 gap-3'>
          <div className='flex-1'>

        <p className="text-lg mt-6 font-semibold">Queue Number</p>
        <input
          type="text"
          id="queueNumber"
          value={queueNumber}
          onChange={onChange}
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

        <p className="text-lg font-semibold">Patient Sex</p>
        <input
          type="text"
          id="patientSex"
          value={patientSex}
          onChange={onChange}
          placeholder="Patient Sex"
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
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

<button
     type="button"
     onClick={openPatientModal}
      className="mb-6 w-full px-7 py-2 bg-green-700 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-800 hover:shadow-lg focus:bg-green-800 focus:shadow-lg
        active:bg-green-950 active:shadow-lg transition duration-150 ease-in-out"
        >

      Select Patient
    </button>

</div>
<div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
        <p className="text-lg font-semibold">Appointment Date</p>
        <input
          type="date"
          id="queueDate"
          dateFormat="MM/dd/yyyy"
          value={queueDate}
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

        <p className="text-lg font-semibold">Department Name</p>
        <input
          type="text"
          id="departmentName"
          value={departmentName}
          onChange={onChange}
          placeholder="Department Name"
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
            className="mb-6 w-full px-7 py-2 bg-green-700 text-white font-medium text-sm uppercase rounded shadow-md
                hover:bg-green-800 hover:shadow-lg focus:bg-green-800 focus:shadow-lg
                active:bg-green-950 active:shadow-lg transition duration-150 ease-in-out"
            >
            Select Schedule & Doctor
        </button>
        </div>
        </div>

        <div className='flex-1'>

        <div className="border border-gray-400 px-4 py-3 rounded-lg mt-5 mb-5" >
      <p className="text-lg font-semibold">Appointment Resources & Pricing</p>
      <div className="bg-green-200 shadow overflow-hidden sm:rounded-lg mb-6">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">

                {dataArray.map((dataArrayElement, arrayIndex) => (
                <tr>
                <td className="py-4 px-6 whitespace-nowrap">{dataArrayElement.resourceName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{dataArrayElement.resourcePrice}</td>
                <td className="py-4 px-6 whitespace-nowrap">{dataArrayElement.resourceStatus}</td>
                <td className="py-4 px-6 text-center whitespace-nowrap">
                <button className="bg-amber-600 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => removeElement(arrayIndex)}>
                    Delete
                </button>
                </td>
                </tr>
                ))}

            </tbody>
        </table>
        </div>
        <button
         type="button"
         onClick={openResourceModal}
            className="mb-6 w-full px-7 py-2 bg-green-700 text-white font-medium text-sm uppercase rounded shadow-md
                hover:bg-green-800 hover:shadow-lg focus:bg-green-800 focus:shadow-lg
                active:bg-green-950 active:shadow-lg transition duration-150 ease-in-out"
            >
            Add a Resource
        </button>
        </div>

        <p className="text-lg font-semibold">Medical Condition</p>
        <textarea
          type="text"
          id="medicalCondition"
          value={medicalCondition}
          onChange={onChange}
          placeholder="Medical Condition"
          maxLength="32"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

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

        <p className="text-lg font-semibold">Queue Status</p>
        <p className="text-sm ">Note: Will update timestaps for Check In Status only. Complete Statuses set here will not be counted in the reports. Only those done in the Queue pages will be counted.</p>
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
        <option className=" text-gray-700" value="Checked In">Checked In</option>
        <option className=" text-gray-700" value="Completed">Completed</option>
        <option className=" text-gray-700" value="Missed">Missed</option>
      </select>
        
      
      </div>
      </div>
    <button
      type="submit"
      className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Add Apointment to Queue
    </button>
    
    
      </form>
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

    <Transition appear show={isResourceOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeResourceModal}
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
                  onClick={closeResourceModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Choose Resources Availiable
              </Dialog.Title> 
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Click on any of the following resources, services or staff to be used in the appointment
                </p>
                {/* Insert your content here */}
                {isResourceOpen && <SelectResourceList dataArray={dataArray} addElement={addElement} closeResourceModal={closeResourceModal}/>}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

    </>
  )
  
}


