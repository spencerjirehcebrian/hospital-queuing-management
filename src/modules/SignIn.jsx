import React, { useState } from 'react'
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

import Spinner from "../components/Spinner";


export default function SignIn() {

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

function onChange(e) {
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }))
}

const { email, password } = formData;

async function onSubmit(e) {
  e.preventDefault();
  setLoading(true)

  try {
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    if(userCredential.user) {
      toast.success("Signed In");
      setLoading(false)
      navigate('/');
    }
    
  } catch (error) {
    console.log(error);
    setLoading(false)
    toast.error("Invalid username or password");
  }
}

if (loading) {
  return <Spinner />;
}

  return (
<section>

  <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
  <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
    <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
      <img src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      alt='splash screen'
      className='w-full rounded-2xl'/>
    </div>
    
    <div className="w-full md:w-[70%] lg:w-[40%] lg:ml-20">
      <form onSubmit={onSubmit}>
        <input className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
        type="email" 
        id="email"
        value={email} 
        onChange={onChange}
        placeholder='Email Address'/>
     

      <div className='relative mt-6 mb-6'>
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
        <p className='mb-6 text-base'>Don't have an Account? 
        <Link to="/sign-up" className='text-green-400 hover:text-green-600 transition duration-200 ease-in-out'> Sign Up Here</Link></p>
      </div>

      <button className='w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
      hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
      type='submit'> SIGN IN</button>
      </form>

        <OAuth />
    </div>
  </div>
</section>
  )
}
