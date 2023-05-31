import {useEffect, useState } from 'react'
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function EditSchedules() {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()

    const [schedules, setSchedules] = useState(null);

    const params =  useParams();
    
    useEffect(() => {
      setLoading(true);
      console.log(params.scheduleID)
      async function fetchListing() {
        const docRef = doc(db, "schedules", params.scheduleID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSchedules(docSnap.data());
          setFormData({...docSnap.data()});
          setLoading(false);
        } else {
          navigate("/schedules");
          toast.error("Schedule does not exist");
        }
      }
      fetchListing();
    }, [navigate, params.scheduleID]);

    const [formData, setFormData] = useState({
        name: "",
        doctorName: "",
        startTime: '',
        endTime: '',
        isMonday: false,
        isTuesday: false,
        isWednesday: false,
        isThursday: false,
        isFriday: false,
        isSaturday: false,
        isSunday: false
      });

    const {
        name,
        doctorName,
        startTime,
        endTime,
        isMonday,
        isTuesday,
        isWednesday,
        isThursday,
        isFriday,
        isSaturday,
        isSunday
    } = formData;

    const handleStartTimeChange = (time) => {
      setFormData((prevState) => ({
        ...prevState,
        startTime: time
      }));
    };

    const handleEndTimeChange = (time) => {
      setFormData((prevState) => ({
        ...prevState,
        endTime: time
      }));
    };

    function onChange(e) {
      if (e.target.checked == null) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.checked,
        }));
      }

    }
    
    async function onDeleteClick() {
      try {
      const documentRef = doc(db, 'schedules', params.scheduleID);
      await deleteDoc(documentRef);
        toast.success("Document successfully deleted!");
        navigate("/schedules");
      }catch (error){
        toast.error("Error deleting document: ", error);
      }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
        if (startTime > endTime) {
         throw new Error("Start Time Should be Less than End Time")
        }
     
        const docRef = doc(db, "schedules", params.scheduleID);
        await updateDoc(docRef, {
          ...formData,
        });

        //await addDoc(collection(db, "schedules"), formDataCopy);
        setLoading(false);
        toast.success("Schedule Saved");
        navigate("/schedules")
        }

        catch (error) {
          console.log(error)
          toast.error("\n" + error);
        }
        //navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }


  if (loading) {
    return <Spinner />;
  }
  return (
    <>
        <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Schedule</h1>
      <form onSubmit={onSubmit}>
        
        <p className="text-lg mt-6 font-semibold">Schedule Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Schedule Name"
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
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        
      <div className="mb-6">
        <p htmlFor="startTime" className="text-lg font-semibold">
          Schedule Start Time
        </p>
        <TimePicker
          id="startTime"
          onChange={handleStartTimeChange}
          format="hh:mm a"
          value={startTime}
          clearIcon={null}
          required
          className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />
      </div>

      <div className="mb-6">
        <p htmlFor="endTime" className="text-lg font-semibold">
        Schedule End Time
        </p>
        <TimePicker
          id="endTime"
          onChange={handleEndTimeChange}
          format="hh:mm a"
          value={endTime}
          clearIcon={null}
          required
          className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />
      </div>

      <div className="flex flex-col mb-6">
      <p htmlFor="time" className="text-lg font-semibold">
        Schedule Days Availiable
        </p>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          id="isMonday"
          checked={isMonday}
          value={isMonday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Monday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          id="isTuesday"
          checked={isTuesday}
          value={isTuesday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Tuesday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          id="isWednesday"
          checked={isWednesday}
          value={isWednesday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Wednesday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          id="isThursday"
          checked={isThursday}
          value={isThursday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Thursday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          id="isFriday"
          checked={isFriday}
          value={isFriday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Friday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          id="isSaturday"
          checked={isSaturday}
          value={isSaturday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Saturday</span>
      </label>
      <label className="w-full sm:w-auto">
        <input
          type="checkbox"
          id="isSunday"
          checked={isSunday}
          value={isSunday}
          onChange={onChange}
          className="mr-2 leading-tight"
        />
        <span>Sunday</span>
      </label>
    </div>

    <button
      type="submit"
      className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Save Changes
    </button>
      </form>

      <button
      type="submit"
      className="mb-6 w-full px-7 py-2 bg-amber-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-amber-700 hover:shadow-lg focus:bg-amber-700 focus:shadow-lg
        active:bg-amber-800 active:shadow-lg transition duration-150 ease-in-out"
      onClick={onDeleteClick}>
      Delete Schedule
    </button>
    </main>
    </>
  )
  
}

