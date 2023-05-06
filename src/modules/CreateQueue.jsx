import {useEffect, useState} from 'react'
import { toast } from "react-toastify";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp,query,orderBy,limit,getDocs,where, onSnapshot, doc, getDoc, Firestore } from "firebase/firestore";
import { app, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function CreateQueue() {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()

    const [endTime1, setEndTime1] = useState(null)
    const [startTime1, setStartTime1] = useState(null)
    const [doctorName1, setDoctorName1] = useState(null)
    const [scheduleID1, setScheduleID1] = useState("")

    const getHighestScore = async () => {
        const usersRef = collection(db, "queue");
        const q = query(usersRef, orderBy("queueNumber", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
      
        if (querySnapshot.size === 0) {
          console.log("No documents found");
          return 0;
        } else {
          const highestScore = querySnapshot.docs[0].data().score;
          console.log("Highest score:", highestScore);
          return highestScore;
        }
    };

    const [result, setResult] = useState('');

    useEffect(() => {
        if (scheduleID1.trim() !== '') {
            const q = query(collection(db, 'schedules'), where('__name__', '==', scheduleID1.trim()));
            getDocs(q).then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0].data();
              setResult(`Found document with ID ${scheduleID1}. Field1: ${doc.startTime}, Field2: ${doc.endTime}`);
            } else {
              setResult(`No document found with ID ${scheduleID1}`);
            }
          }).catch((error) => {
            console.error('Error fetching document:', error);
            setResult(`Error fetching document: ${error.message}`);
          });
        } else {
          setResult('');
        }

        console.log(result)
      }, [scheduleID1]);
    
      const handleInputChange = (event) => {
        setScheduleID1(event.target.value);
      };

    const fetchDataUser = async () => {
        const userDocRef = doc(db, "users", patientID);
      const docSnapshot = await getDoc(userDocRef);
  
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const { name, email } = userData;
        setFormData("patientName", name)
        setFormData("patientID", email)
      }
    }

    const [currQueueNum, setCurrQueueNum] = useState(0);
    const [newQueueNum, setNewQueueNum] = useState(0);
    //const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        setCurrQueueNum(getHighestScore())
        setNewQueueNum(currQueueNum + 1)
        setLoading(false);
    }, []);


    const [formData, setFormData] = useState({
        queueNumber: newQueueNum,
        patientID: "",
        patientName: "",
        patientEmail: "",
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
        queueDescription,
        scheduleID,
        doctorName,
        scheduleStartTime,
        scheduleEndTime,
        queueStatus
    } = formData;

    function onChange(e) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }

    function onChangeSearch(e) {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
          }));

        //fetchDataSchedule()
        //fetchDataUser()
      }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {

        await addDoc(collection(db, "queue"), formData);
        setLoading(false);
        toast.success("Appointment Created");
        navigate("/queue")
        }

        catch (error) {
          console.log(error)
          toast.error("Appointment Failed\n" + error);
        }
    }


  return (
    <>
        <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create Appointment</h1>
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

        <p className="text-lg font-semibold">Patient ID</p>
        <input
          type="text"
          id="patientID"
          value={patientID}
          onChange={onChangeSearch}
          placeholder="Patient ID"
          maxLength="32"
          required
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

        <p className="text-lg font-semibold">Schedule ID</p>
        <input
          type="text"
          id="scheduleID1"
          value={scheduleID1}
          onChange={handleInputChange}
          placeholder="Schedule ID"
          maxLength="32"
          required
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

        <p className="text-lg font-semibold">Queue Status</p>
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
      </select>
        
      

    <button
      type="submit"
      className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Charge Customer
    </button>
      </form>
    </main>
    </>
  )
  
}


