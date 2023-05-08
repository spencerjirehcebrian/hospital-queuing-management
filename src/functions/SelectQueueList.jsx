import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function SelectQueueList(props) {

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
     
      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'queue'),
              where('name', '>=', searchTerm),
              where('name', '<=', searchTerm + '\uf8ff')
            )
          : collection(db, 'queue', orderBy('queue'));
    
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
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    function onClickHandler() {
        props.closeQueueModal();
      }
  
      function handleClick(e) {
       props.getQueueID(e);
      }

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
          type="text"
          id="search"
          className="w-full px-4 py-2 rounded-lg shadow"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
      {queues.map((queue) => (
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={() => {
            handleClick(queue.id);
            onClickHandler();
          }}
          
          
          
          >
             <h2 className="text-xl font-semibold">{queue.queueNumber}</h2>
            <p><span className="font-semibold">Patient Name: </span> {queue.patientName}</p>
            <p><span className="font-semibold">Attending Doctor: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} to {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectQueueList
