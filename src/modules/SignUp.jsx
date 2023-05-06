import React, { useState } from 'react'
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function SignUp() {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    sex: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [startDOB, setStartDOB] = useState(false);

function onChange(e) {
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }))
}

const navigate = useNavigate()

async function onSubmit(e) {
  e.preventDefault();
  setLoading(true)

  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    updateProfile(auth.currentUser, {
      displayName: name,
    })

    const user = userCredential.user
    console.log(user);
    const id = auth.currentUser
    const formDataCopy = {...formData}
    delete formDataCopy.password
    
    formDataCopy.timestamp = serverTimestamp();
    formDataCopy.isAdmin = false;
    formDataCopy.isPatient = true;

    await setDoc(doc(db, "users", id.uid), formDataCopy);
    setLoading(false)
    toast.success("Successfully Signed Up")

    navigate("/")

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

  <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
  <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
    <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
      <img src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      alt='splash screen'
      className='w-full rounded-2xl'/>
    </div>
    
    <div className="w-full md:w-[70%] lg:w-[40%] lg:ml-20">
      <form onSubmit={onSubmit}>
      <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
        type="text" 
        id="name"
        value={name} 
        onChange={onChange}
        placeholder='Full Name'/>

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
        <option className=" text-gray-700" value="Male">Male</option>
        <option className=" text-gray-700" value="Female">Female</option>
      </select>
    
      

        <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
        type="email" 
        id="email"
        value={email} 
        onChange={onChange}
        placeholder='Email Address'/>
     

      <div className='relative mb-6'>
        <form>
          <input className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
          type={showPassword ? "text" : "password"}  
          id="password"
          value={password}  
          onChange={onChange}
          placeholder='Password'/>
        </form>

        {showPassword ? (<HiOutlineEyeOff className="absolute right-3 top-3 text-xl cursor-pointer"
        onClick={()=>setShowPassword((prevState) => !prevState)}/> )
        : 
        (<HiOutlineEye className="absolute right-3 top-3 text-xl cursor-pointer"
        onClick={()=>setShowPassword((prevState) => !prevState)}/>)
        }
      </div>

      <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>
        <p className='mb-6 text-base'>Have an Account? 
        <Link to="/sign-in" className='text-green-400 hover:text-green-600 transition duration-200 ease-in-out'> Sign In Here</Link></p>
      </div>

      <button className='w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
      hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
      type='submit'> SIGN UP</button>

      </form>
        <OAuth />
    </div>
  </div>
</section>
  )
}
