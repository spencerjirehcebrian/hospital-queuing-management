import {useEffect, useState} from 'react'
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp,query,orderBy,limit,getDocs,where, onSnapshot, doc, getDoc, Firestore, updateDoc,deleteDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


export default function ShowHistory() {
  const params =  useParams();
  const [loading, setLoading] = useState(false);
  const auth = getAuth()
  const navigate = useNavigate()

  const [currQueueNum, setCurrQueueNum] = useState(0);
  const [newQueueNum, setNewQueueNum] = useState(0);

  const [startDate, setStartDate] = useState(new Date());

  const [formData, setFormData] = useState({
    queueNumber: newQueueNum,
    patientID: "",
    patientName: "",
    patientEmail: "",
    patientSex: "",
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
const [idArray, setIdArray] = useState([]); 

function changeStatus(index) {
  var newValue;
  if (dataArray[index]["resourceStatus"] == "Unpaid") {
    newValue = "Paid"
  }
  else{
    newValue = "Unpaid"
  }

  setDataArray(prevArray => {
    return prevArray.map((element, i) => {
      if (i === index) {
        return { ...element, resourceStatus: newValue };
      }
      return element;
    });
  });
};

const addElement = (newElement) => {
  setDataArray((prevDataArray) => [...prevDataArray, newElement]);
};

const removeElement = (index) => {
  const updatedArray = dataArray.filter((_, i) => i !== index);
  setDataArray(updatedArray);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}/${year}`;
};

  useEffect(() => {
      async function fetchListing() {
        const docRef = doc(db, "queue", params.appointmentID);

        getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setFormData({ ...docSnap.data() });

            const q = query(collection(db, 'bills'), where('billAppointmentID', '==', docRef.id));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const snapshotdata = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              const snapshotdata1 = snapshot.docs.map((doc) => ({
                id: doc.id,
              }));
            
              setDataArray(snapshotdata);
              setIdArray(snapshotdata1)
             
            });

          } else {
            toast.error("Queue does not exist");
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error('Error fetching1 document:', error);
          setLoading(false);
        });
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
              doctorName: doc.doctorName,
              departmentName: doc.departmentName
          };
          setFormData(newData);

          } else {
            //console.log(`No document found with ID ${scheduleID}`);
            
            const newData = {
              ...formData,
              scheduleStartTime: "",
              scheduleEndTime: "",
              doctorName: "",
              departmentName: "",
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
  
  function onDateChange() {
    const formattedDate = formatDate(startDate);
    setFormData(prevFormData => ({
      ...prevFormData,
      queueDate: formattedDate
    }));
    console.log(formattedDate)
  }



  if (loading) {
      return <Spinner />;
    }
    return (
      <>
      <main className="w-[80%] px-2 mx-auto">

      <h1 className="text-3xl text-center my-14 font-bold">History of one of your Appointments</h1>

          <form>
          <div className='flex flex-col-2 gap-14'>
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
  

  </div>
  <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
          <p className="text-lg font-semibold">Appointment Date</p>
          <input
            type="date"
            id="queueDate"
            dateformat="MM/dd/yyyy"
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
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
  
                  {dataArray.map((dataArrayElement, arrayIndex) => (
                  <tr key={dataArrayElement.resourceId}>
                    <td className="py-4 px-6 whitespace-nowrap">{dataArrayElement.resourceName}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{dataArrayElement.resourcePrice}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{dataArrayElement.resourceStatus}</td>
                    
                  </tr>
                  ))}
  
              </tbody>
          </table>
          </div>
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
          <select
          id="queueStatus"
          value={queueStatus}
          onChange={onChange}
          className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
           `}
        >
          <option className=" text-gray-400" value="" disabled defaultValue hidden>--Please choose a Status--</option>
          <option className=" text-gray-700" value="Pending">Pending</option>
          <option className=" text-gray-700" value="Set">Set</option>
          <option className=" text-gray-700" value="Completed">Completed</option>
          <option className=" text-gray-700" value="Missed">Missed</option>
        </select>
          
        
        </div>
        </div>

      <button
        type="submit"
        onClick={()=>navigate("/patient-history")}
        className="mb-6 w-full px-7 py-2 bg-amber-600 text-white font-medium text-sm uppercase rounded shadow-md
          hover:bg-amber-700 hover:shadow-lg focus:bg-amber-700 focus:shadow-lg
          active:bg-amber-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Back
      </button>
      
      
        </form>
      </main>
  
  
      </>
    )

}
