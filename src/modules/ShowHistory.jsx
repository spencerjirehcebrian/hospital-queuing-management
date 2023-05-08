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


export default function ShowHistory() {
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
      <h1 className="text-3xl text-center mt-10 font-bold">Appointment Details</h1>
      <p className='text-1xl text-center mt-3 font-semibold'>View the details of the appointment</p>
      <form onSubmit={onSubmit}>
        
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
          disabled
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
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Queue Status</p>
        <select
        id="queueStatus"
        value={queueStatus}
        onChange={onChange}
        disabled
        className={`w-full mb-16 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
         `}
      >
        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Status--</option>
        <option className=" text-gray-700" value="Pending">Pending</option>
        <option className=" text-gray-700" value="Set">Set</option>
        <option className=" text-gray-700" value="Completed">Completed</option>
        <option className=" text-gray-700" value="Missed">Missed</option>
      </select>
      </form>
    </main>
    </>
  )
  
}


