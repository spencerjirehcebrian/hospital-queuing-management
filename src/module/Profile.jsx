import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { FcHome } from "react-icons/fc";
import { useEffect } from "react";

export default function Profile() {

    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false);
    const [startDOB, setStartDOB] = useState(false);

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        dob: '',
        sex: ''
    })

    const { name, email, dob, sex } = formData;

    function onLogout() {
        auth.signOut();
        toast.success("Signed out Successfully");
        navigate("/sign-in");
    }

    function onChange(e) {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value,
        }));
      }
    
      async function onSubmit() {
        try {
          if (auth.currentUser.displayName !== name) {
            //update display name in firebase auth
            await updateProfile(auth.currentUser, {
              displayName: name,
            });
    
            // update name in the firestore
    
            const docRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(docRef, {
              name,
            });
          }
          toast.success("Profile details updated");
        } catch (error) {
          toast.error("Could not update the profile details");
        }
      }

  return (
    <>
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className='text-3xl text-center mt-6 font-bold'>
            My Profile
        </h1>

        <div className="w-full md:w-[50%] mt-6 px-3" >
            <form>
            <input

              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
                type={startDOB ? "date" : "text"} 
                onFocus={()=>setStartDOB(true)}
                onBlur={()=>setStartDOB(false)}
                id="dob"
                value={dob} 
                onChange={onChange}
                disabled={!changeDetail}
                placeholder='Date of Birth'/>

                <select
                id="sex"
                value={sex}
                onChange={onChange}
                disabled={!changeDetail}
                className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
                    ${sex|| "text-gray-700"}`}
                >
                <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Sex--</option>
                <option className=" text-gray-700" value="male">Male</option>
                <option className=" text-gray-700" value="female">Female</option>
                </select>


                <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
                hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
                type='submit'>EDIT DETAILS</button>

                <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
                hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
                >SAVE</button>

                <button className='mb-6 w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
                hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
                onClick={onLogout}>Sign out</button>

            </form>
        </div>
    </section>
    </>
  )
}
