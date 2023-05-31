import React, {useEffect, useState} from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'

import useAuthAdminStatus from "./useAuthAdminStatus"


export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);




    useEffect(() => {
        const fetchData = async (e) => {
            console.log(e)
            const q = query(
            collection(db, "users"), where("email", "==", e), where("isAdmin", "==", true));
            const querySnapshot = await getDocs(q);
            setIsAdmin(!querySnapshot.empty);
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
    
  return { loggedIn, checkingStatus, isAdmin }
}
