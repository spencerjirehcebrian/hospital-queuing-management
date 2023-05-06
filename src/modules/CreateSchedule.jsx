import {useEffect, useState} from 'react'
import { toast } from "react-toastify";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function CreateSchedules() {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()

    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('11:00');

    const [isMonday, setIsMonday] = useState(false)
    const [isTuesday, setIsTuesday] = useState(false)
    const [isWednesday, setIsWednesday] = useState(false)
    const [isThursday, setIsThursday] = useState(false)
    const [isFriday, setIsFriday] = useState(false)
    const [isSaturday, setIsSaturday] = useState(false)
    const [isSunday, setIsSunday] = useState(false)


    const [formData, setFormData] = useState({
        name: "",
        doctorName: ""
      });

    const {
        name,
        doctorName
    } = formData;

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
        if (startTime > endTime) {
         throw new Error("Start Time Should be Less than End Time")
        }
        const formDataCopy = {
            ...formData,
            startTime: startTime,
            endTime: endTime,
            isMonday: isMonday,
            isTuesday: isTuesday,
            isWednesday: isWednesday, 
            isThursday: isThursday,
            isFriday: isFriday,
            isSaturday: isSaturday,
            isSunday: isSunday
        };
     
        await addDoc(collection(db, "schedules"), formDataCopy);
        setLoading(false);
        toast.success("Schedule created");
        }

        catch (error) {
          console.log(error)
          toast.error("Schedule creation Fail\n" + error);
        }
        //navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }


  return (
    <>
        <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Schedule</h1>
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
        <p htmlFor="time" className="text-lg font-semibold">
          Schedule Start Time
        </p>
        <TimePicker
          id="startTime"
          name="startTime"
          onChange={setStartTime}
          format="hh:mm a"
          value={startTime}
          clearIcon={null}
          className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />
      </div>

      <div className="mb-6">
        <p htmlFor="time" className="text-lg font-semibold">
        Schedule End Time
        </p>
        <TimePicker
          id="endTime"
          name="endTime"
          onChange={setEndTime}
          format="hh:mm a"
          value={endTime}
          clearIcon={null}
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
          name="monday"
          value={isMonday}
          onChange={()=>setIsMonday((prevState) => !prevState)}
          className="mr-2 leading-tight"
        />
        <span>Monday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          name="day"
          value={isTuesday}
          onChange={()=>setIsTuesday((prevState) => !prevState)}
          className="mr-2 leading-tight"
        />
        <span>Tuesday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          name="day"
          value={isWednesday}
          onChange={()=>setIsWednesday((prevState) => !prevState)}
          className="mr-2 leading-tight"
        />
        <span>Wednesday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          name="day"
          value={isThursday}
          onChange={()=>setIsThursday((prevState) => !prevState)}
          className="mr-2 leading-tight"
        />
        <span>Thursday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          name="day"
          value={isFriday}
          onChange={()=>setIsFriday((prevState) => !prevState)}
          className="mr-2 leading-tight"
        />
        <span>Friday</span>
      </label>
      <label className="w-full sm:w-auto sm:pr-4">
        <input
          type="checkbox"
          name="day"
          value={isSaturday}
          onChange={()=>setIsSaturday((prevState) => !prevState)}
          className="mr-2 leading-tight"
        />
        <span>Saturday</span>
      </label>
      <label className="w-full sm:w-auto">
        <input
          type="checkbox"
          name="day"
          value={isSunday}
          onChange={()=>setIsSunday((prevState) => !prevState)}
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
      Create Schedule
    </button>
      </form>
    </main>
    </>
  )
  
}

