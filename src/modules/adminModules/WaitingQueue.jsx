import React, {useState, useEffect} from 'react'
import { db } from "../../firebase/firebase";
import { getFirestore, collection, onSnapshot, updateDoc, doc, getDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";
import WaitingQueueList from '../../functions/WaitingQueueList.jsx';
import { UpdateAverageWaitTime } from '../../functions/UpdateAverageWaitTime.jsx';
import Spinner from '../../components/Spinner';

export default function WaitingQueue() {

    const navigate = useNavigate()

    const [queues, setQueues] = useState([]);
    const [empty, setEmpty] = useState(true);

    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);

    const avg = UpdateAverageWaitTime()

    useEffect(() => {
      setLoading(true)
      
      const fetchData = async () => {
        try{
        const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');
        const snapshot = await getDoc(docRef);
    
        if (snapshot.exists()) {
          const data = snapshot.data();
          setValue(data.currentQueueNumber)
          
        } else {
          console.log('Document not found');
        }
      } catch (error) {
        console.error('Error retrieving document:', error);


        const q = query(
          collection(db, 'queue'),
          where('queueStatus', "in", ["Checked In"]),
          where('waitingQueueNumber', '==', value)
        );
        
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          setEmpty(true)
          setLoading(false)
        } else {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const queuesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setEmpty(false)
              setQueues(queuesData)
              setLoading(false)
    
              return unsubscribe;
          })
        }

      }
    };

    fetchData()
  }, []);


  useEffect(() => {

        
    const fetchData = async () => {
 
    const q = query(
      collection(db, 'queue'),
      where('queueStatus', "in", ["Checked In"]),
      where('waitingQueueNumber', '==', value)
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setEmpty(true)
      setLoading(false)
    } else {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const queuesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEmpty(false)
          setQueues(queuesData)
          setLoading(false)

          return unsubscribe;
      })
    }
  };

  fetchData()
  
}, [value]);

 
  async function updateQueueNumberDecrement() {
    const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');
    
    setValue(value -1 )

    updateDoc(docRef, {
      currentQueueNumber: value - 1
    })
    .then(() => {
     
    })
    .catch((error) => {
      console.log('Error updating number:', error);
    });

  }

  async function updateQueueNumberIncrement() {
    const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');
  
    setValue(value + 1)

    updateDoc(docRef, {
      currentQueueNumber: value + 1
    })
    .then(() => {

      })
    .catch((error) => {
      console.log('Error updating number:', error);
    });
    }


  async function setAsCompleted(id) {
    const collectionName = "queue";
    const documentId = id; 
    const fieldToUpdate = "queueStatus";
    const updatedValue = "Completed";

    const documentRef = doc(db, collectionName, documentId);
    const updateData = {
      [fieldToUpdate]: updatedValue,
      timeCompleted: serverTimestamp()
    };

    updateDoc(documentRef, updateData)
      .then(() => {
        
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });

      updateQueueNumberIncrement()
      updateQueueNumberDecrement()

  };

  async function setAsMissed(id) {
    const collectionName = "queue";
    const documentId = id; 
    const fieldToUpdate = "queueStatus";
    const updatedValue = "Missed";

    const documentRef = doc(db, collectionName, documentId);
    const updateData = {
      [fieldToUpdate]: updatedValue
    };

    updateDoc(documentRef, updateData)
      .then(() => {
        
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });

      updateQueueNumberIncrement()
      updateQueueNumberDecrement()
  };
   
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
     
      <div className="w-full md:w-[100%] flex flex-col justify-between mt-20 px-[25%]" >
        <div className="flex flex-grow space-x-5 items-center">
            <h1 className="text-2xl text-center font-bold m-auto">Currently Serving</h1>
        </div>
        <div className="flex flex-grow space-x-5 items-center">
            <p className="m-auto">Queue Number</p>
        </div>
        <div className="flex flex-grow space-x-5 items-center mt-12  mb-10 font-bold text-8xl">
        <p className="m-auto">{value}</p>
        </div>
        
        

        <div className="flex flex-grow space-x-5 mb-5 items-center">
            <p className="m-auto">Estimated Wait Time until Next Appointment: <span className="font-semibold text-xl">{avg}</span> minutes</p>
        </div>

        {empty && (<div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex justify-center">
        <h2 className='items-center mt-12 mb-10 text-2xl'>No Appointment Assigned to This Number</h2>
        </div>

        <div className="flex flex-grow space-x-5 mt-2 ">


          <button className='mb-6 w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
          >Set Apointment as Missed</button>

<button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          >Set Apointment as Completed</button>
          </div>
          </div>
      
      )}

        {!empty &&(<div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div>
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-queue/${queue.id}`)}>
            <p><span className="font-semibold">Patient Name: </span> {queue.patientName}</p>
            <p><span className="font-semibold">Attending Doctor: </span> {queue.doctorName}</p>
            <p><span className="font-semibold">Department: </span> {queue.departmentName}</p>
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} <span className="font-semibold">to</span> {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            </div>
        <div className="flex flex-grow space-x-5 mt-6 ">
          
          <button className='mb-6 w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'
          onClick={() => setAsMissed(queue.id)}
          >Set Apointment as Missed</button>

        <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={() => setAsCompleted(queue.id)}
          >Set Apointment as Completed</button>
          
          </div>
          </div>
        ))}
      </div>)}

      <div className="flex flex-grow space-x-5">
    
            <button className='mb-6 w-full bg-amber-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
            hover:bg-amber-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-amber-900'      
            onClick={updateQueueNumberDecrement}
          >Move to Previous Number</button>
      
      <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={updateQueueNumberIncrement}
          >Move to Next Number</button>
</div>

</div>
    <div className="container mx-auto p-1">
    <hr className="border border-gray-300 m-5"></hr>
    <h1 className="text-2xl text-center font-bold m-auto mb-3">Upcoming Appointments</h1>
    
        {!loading && (<WaitingQueueList queueNumber={value}/>)}
      </div>
    </>
  )
}
