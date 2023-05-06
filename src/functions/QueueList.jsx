import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function QueueList() {

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      if (searchTerm){
      const q = searchTerm
        ? query(
            collection(db, 'queue'),
            where('number', '>=', searchTerm),
            where('number', '<=', searchTerm + '\uf8ff')
          )
        : collection(db, 'queue', orderBy('name'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const queuesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueues(queuesData);

      });
      return unsubscribe;
      
      } else {
          const unsubscribe = onSnapshot(collection(db, 'queue'), (snapshot) => {
          const schedulesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQueues(schedulesData);

        });
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="number"
          id="search"
          className="w-full px-4 py-2 rounded-lg shadow"
          placeholder="Search by queue number"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-appointment/${queue.id}`)}>
            <h2 className="text-xl font-semibold">{queue.name}</h2>
            <p><span className="font-semibold">Doctor Name: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">Time Slot</span>: {queue.startTime} - {queue.endTime}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueueList
