import React, { useState, useEffect } from 'react'
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { useNavigate, Link, useParams } from 'react-router-dom';
import OAuth from '../../components/OAuth'

import Spinner from "../../components/Spinner";


import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence, browserLocalPersistence, browserSessionPersistence
} from "firebase/auth";
import { db } from "../../firebase/firebase";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";


export default function EditDoctor() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        sex: "",
        email: "",
        password: "",
    });

    // const [showPassword, setShowPassword] = useState(false);
    const [startDOB, setStartDOB] = useState(false);

    const params =  useParams();
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);

        async function fetchListing() {
          const docRef = doc(db, "users", params.doctorID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData({...docSnap.data()});
            setLoading(false);
          } else {
            navigate("/patients");
            toast.error("Patient does not exist");
          }
        }
        fetchListing();
      }, [navigate, params.doctorID]);

    function onChange(e) {
      setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value,
      }))
    }

    async function onSubmit(e) {
    e.preventDefault();
    setLoading(true)

    try {
        const auth = getAuth()
        updateProfile(auth.currentUser, {
        displayName: name,
        })

        const formDataCopy = {...formData}
        delete formDataCopy.password
        
        formDataCopy.isAdmin = false;
        formDataCopy.isPatient = false;
        formDataCopy.isDoctor = false;

        await setDoc(doc(db, "users", params.patientID), formDataCopy);
        setLoading(false)
        toast.success("Successfully Saved Changes")

        navigate("/doctors")

    } catch (error) {
        console.log(error);
        setLoading(false)
        toast.error("Something went wrong");
    }
    }

    const { name, dob, sex, email, password } = formData;

    if (loading) {
        return <Spinner />;
    }

  return (
<section>

  <h1 className='text-3xl text-center mt-6 font-bold'>Edit Doctor Information</h1>
  <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
    
    <div className="w-full md:w-[40%] lg:w-[50%]">
      <form onSubmit={onSubmit}>
      <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
        type="text" 
        id="name"
        value={name} 
        onChange={onChange}
        placeholder='Doctor Name'/>

      <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
        type={startDOB ? "date" : "text"} 
        onFocus={()=>setStartDOB(true)}
        onBlur={()=>setStartDOB(false)}
        id="dob"
        value={dob} 
        onChange={onChange}
        placeholder='Date of Birth'/>

      <select
        id="sex"
        value={sex}
        onChange={onChange}
        className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
         ${sex|| "text-gray-700"}`}
      >
        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Sex--</option>
        <option className=" text-gray-700" value="male">Male</option>
        <option className=" text-gray-700" value="female">Female</option>
      </select>
    
        <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
        type="email" 
        id="email"
        value={email} 
        onChange={onChange}
        disabled
        placeholder='Email Address'/>

      <button className='w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
      hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
      type='submit'>Save Changes</button>
      </form>
    </div>
  </div>
</section>
  )
}
