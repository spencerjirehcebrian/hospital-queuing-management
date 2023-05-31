import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function WaitingQueueList(props) {

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true)
        const q = query(
            collection(db, 'queue'),
            orderBy('waitingQueueNumber', 'asc'),
            where('queueStatus', "in", ["Checked In"]),
            where('waitingQueueNumber', '!=', props.queueNumber),
            )

          const unsubscribe = onSnapshot(q, (snapshot) => {
          const schedulesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQueues(schedulesData);
          setLoading(false)

        });
        
        return unsubscribe;

    }, [props.queueNumber]);
  
  
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-queue/${queue.id}`)}>
            <h2 className="text-xl font-semibold">Queue Number: {queue.waitingQueueNumber}</h2>
            <p><span className="font-semibold">Appointment Number: </span> {queue.queueNumber}</p>
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

export default WaitingQueueList
