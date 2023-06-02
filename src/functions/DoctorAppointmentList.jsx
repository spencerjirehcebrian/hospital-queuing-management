import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { getAuth, onAuthStateChanged } from "firebase/auth";

function AppointmentList() {

  const auth = getAuth()

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      const fetchData = async (e) => {
        const q = query(
        collection(db, "users"), where("email", "==", e));
        const querySnapshot = await getDocs(q);
        const doc = querySnapshot.docs[0];

        if (searchTerm){
          const q = searchTerm
            ? query(
                collection(db, 'queue'),
                where('doctorName', "==", doc.data().name),
                where('queueStatus', "in", ["Pending", "Set", "Checked In"]),
                where('queueNumber', '>=', searchTerm),
                where('queueNumber', '<=', searchTerm + '\uf8ff')
              )
            : collection(db, 'queue', orderBy('queueNumber'));
      
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const booksData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setQueues(booksData);
          
          });
      
          return unsubscribe;
        
        } else {
  
        const q = query(
            collection(db, 'queue'),
            where('doctorName', "==", doc.data().name),
            where('queueStatus', "in", ["Pending", "Set", "Checked In"])
        )
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const booksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQueues(booksData);
         
        });
          return unsubscribe;
        }

      };


  
      const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchData(user.email);
            }

          })
    
       
      }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto p-4">
      {/* <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          id="search"
          className="w-full px-4 py-2 rounded-lg shadow"
          placeholder="Search by queue number"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div> */}

      <div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-appointment/${queue.id}`)}>
            <h2 className="text-xl font-semibold">{queue.queueNumber}</h2>
            <p><span className="font-semibold">Attending Doctor: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} to {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            <p><span className="font-semibold">Description: </span> {queue.queueDescription}</p>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppointmentList
