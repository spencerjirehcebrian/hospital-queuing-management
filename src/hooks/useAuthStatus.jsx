import React, {useEffect, useState} from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'

import useAuthAdminStatus from "./useAuthAdminStatus"


export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);




    useEffect(() => {
        const fetchData = async (e) => {
            const q = query(
            collection(db, "users"), where("email", "==", e), where("isAdmin", "==", true));
            const querySnapshot = await getDocs(q);

            const q2 = query(
                collection(db, "users"), where("email", "==", e), where("isDoctor", "==", true));
            const querySnapshot2 = await getDocs(q2);

            
            setIsAdmin(!querySnapshot.empty);
            setIsDoctor(!querySnapshot2.empty);

            setCheckingStatus(false);
          };

        

        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
                fetchData(user.email);
            } else {
                setLoggedIn(false);
                setCheckingStatus(false);
            }
            
        })
    }, [])

    // console.log("Account Type: ", loggedIn, checkingStatus, isAdmin, isDoctor)
  return { loggedIn, checkingStatus, isAdmin, isDoctor }
}
