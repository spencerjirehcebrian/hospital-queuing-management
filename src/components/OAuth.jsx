import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react"

import { getAccessToken } from "firebase/auth";
import axios from "axios";

export default function OAuth() {

const navigate = useNavigate();

const [oauthActive, setOauthActive] = useState(false)

async function onGoogleClick() {
    try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(auth, provider)
        const user = result.user;
        console.log(user);

        const docRef = doc(db, "users", user.uid)

        const docSnap = await getDoc(docRef)

        if(!docSnap.exists()) {

            await setDoc(docRef, {
                name: user.displayName,
                email: user.email,
                timestamp: serverTimestamp(),
                isAdmin: false,
                dob: null,
                sex: null,
            })
        }

        toast.success("Google Authentication Complete!")
        navigate("/")

    } catch (error) {
        toast.error("Couldn't connect to Google")
        console.error(error);
    }
}

  return (
    <>
    {oauthActive && (<div>
        <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 
        after:border-t after:flex-1 after:border-gray-300'>
        <p className='text-center font-semibold mx-4'>
            OR
        </p>
        </div>

        <button
        onClick={onGoogleClick}
        className='flex items-center justify-center w-full bg-green-700 text-white px-7 py-3 uppercase text-sm font-medium
        hover:bg-green-800 active:bg-green-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded'>
        <FcGoogle className='text-1xl bg-white rounded-full mr-2'/> Continue With Google Account
        </button>
    </div>)}
    </>
  )
}
