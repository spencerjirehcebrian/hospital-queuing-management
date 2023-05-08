import { getAuth, updateProfile } from "firebase/auth";
import Spinner from "../components/Spinner";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  getDoc
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
        sex: '',
        isAdmin: false,
        isPatient: false
    })

    const { name, email, dob, sex, isAdmin, isPatient } = formData;

    useEffect(() => {
      setLoading(true);

      async function fetchListing() {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({...docSnap.data()});
          setLoading(false);
        } else {
          toast.error("User does not exist");
        }
      }
      fetchListing();
    }, [navigate, auth.currentUser.uid]);

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
            name: name,
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

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className='text-3xl text-center mt-10 font-bold'>
            My Profile
        </h1>

        {isPatient && (<h3 className='text-1xl text-center mt-3 font-semibold'>
        Account Type: Patient
        </h3>)}

        {isAdmin && (<h3 className='text-1xl text-center mt-3 font-semibold'>
        Account Type: Admin 
        </h3>)}

        <div className="w-full md:w-[50%] mt-6 px-3" >
            <form>

            <p className="text-lg mt-6 font-semibold">Name</p>
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

            <p className="text-lg font-semibold">Email</p>
            <input
              type="email"
              id="email"
              value={email}
              disabled={!changeDetail}
              className="mb-6 w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <p className="text-lg font-semibold">Date of Birth</p>
            <input className="w-full mb-6 px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
                type={startDOB ? "date" : "text"} 
                onFocus={()=>setStartDOB(true)}
                onBlur={()=>setStartDOB(false)}
                id="dob"
                value={dob} 
                onChange={onChange}
                disabled={!changeDetail}
                placeholder='Date of Birth'/>

            <p className="text-lg font-semibold">Sex</p>
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


            
            {/* <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
            >EDIT DETAILS</button>

            <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
            type='submit'>SAVE</button> */}

            <button className='mb-6 w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
            onClick={onLogout}>Sign out</button>            

            </form>
        </div>
    </section>
    </>
  )
}
