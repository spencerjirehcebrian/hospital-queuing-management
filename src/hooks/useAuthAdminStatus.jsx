import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'

const useAuthAdminStatus = (collectionName) => {
  const [isAdminCheck, setIsAdminCheck] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (e) => {
        const q = query(
            collection(db, "users"), where("email", "==", e), where("isAdmin", "==", true));
            const querySnapshot = await getDocs(q);

      setIsAdminCheck(!querySnapshot.empty);
      setLoading(false);
    };

    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchData(user.email).catch((err) => {
                setError(err);
                setLoading(false);
              });
        }
        setLoading(false);
    })

    
  }, [collectionName]);

  return { isAdminCheck };
};

export default useAuthAdminStatus;