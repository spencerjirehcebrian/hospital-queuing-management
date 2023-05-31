import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, getDocs, doc, updateDoc, orderBy, isInteger } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function CurrentWaitingQueueList({queueNumber}) {

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [empty, setEmpty] = useState(true);

    useEffect(() => {
        
      const fetchData = async () => {
        const q = query(
          collection(db, 'queue'),
          where('queueStatus', "in", ["Checked In"]),
          where('waitingQueueNumber', '==', queueNumber)
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setEmpty(true)
        } else {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const queuesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setEmpty(false)
              setQueues(queuesData)
              return unsubscribe;
          })
        }
      };
  
      fetchData();
      
    }, [queueNumber]);



  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto mb-3 p-4">
      {empty && (<div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow cursor-pointer flex justify-center">
        <h2 className='items-center mt-12 mb-10 text-2xl'>Queue Empty</h2>
        </div>

          </div>
      )}

      {!empty && (<div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div>
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-queue/${queue.id}`)}>
            <p><span className="font-semibold">Patient Name: </span> {queue.patientName}</p>
            <p><span className="font-semibold">Attending Doctor: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} to {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            </div>
          </div>
        ))}
      </div>)}
    </div>
  )
}

export default CurrentWaitingQueueList
