import React, {useState, useEffect} from 'react'
import { db } from "../../firebase/firebase";
import { getFirestore, collection, onSnapshot, updateDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";
import WaitingQueueList from '../../functions/WaitingQueueList.jsx';
import CurrentWaitingQueueList from '../../functions/CurrentWaitingQueueList.jsx';
import Spinner from '../../components/Spinner';

export default function WaitingQueue() {

    const navigate = useNavigate()

    const [queues, setQueues] = useState([]);
    const [empty, setEmpty] = useState(true);

    const [value, setValue] = useState(0);
    const [queryValues, setQueryValues] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

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
          where('waitingQueueNumber', '==', queryValues[currentIndex])
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

      }

      getArrayOfField()
      .then((fieldValues) => {
        
        setQueryValues(fieldValues)
        
      })
      .catch((error) => {
        console.error("Error retrieving field values:", error);
      });
    };

    fetchData()
    setRefresh(false)
  }, [refresh]);


  useEffect(() => {
    
    const fetchData = async () => {
    
    const q = query(
      collection(db, 'queue'),
      where('queueStatus', "in", ["Checked In"]),
      where('waitingQueueNumber', '==', queryValues[currentIndex])
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

  fetchData()
  
}, [queryValues]);


  async function getArrayOfField() {
    const collectionName = "queue";
    const fieldToRetrieve = "waitingQueueNumber"; 

    const q = query(
      collection(db, collectionName),
      where('queueStatus', "in", ["Checked In"])
    );
    
    const querySnapshot = await getDocs(q);
  
    const fieldValues = querySnapshot.docs.map((doc) => doc.data()[fieldToRetrieve]);
    fieldValues.sort((a, b) => a - b);
    setQueryValues(fieldValues)
    setLoading(false)
    return fieldValues;
  }

 
  async function updateQueueNumberDecrement() {
    const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');
    if(queryValues.length > 1){
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex < 0) {
        return prevIndex; // Prevent going below the first value
      }
      return newIndex;
    });

    setValue(queryValues[currentIndex])
    
    updateDoc(docRef, {
      currentQueueNumber: queryValues[currentIndex]
    })
    .then(() => {
     
    })
    .catch((error) => {
      console.log('Error updating number:', error);
    });

    getArrayOfField()
    setRefresh(true)
  }
  };
  
  async function updateQueueNumberIncrement() {
    const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');

    if(queryValues.length >1){
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= queryValues.length) {
        return prevIndex; // Prevent going beyond the last value
      }
      return newIndex;
    });
    
    setValue(queryValues[currentIndex])
    
    updateDoc(docRef, {
      currentQueueNumber: queryValues[currentIndex]
    })
    .then(() => {

      })
    .catch((error) => {
      console.log('Error updating number:', error);
    });

    getArrayOfField()
    setRefresh(true)
    }
  };

  async function setAsCompleted(id) {
    const collectionName = "queue";
    const documentId = id; 
    const fieldToUpdate = "queueStatus";
    const updatedValue = "Completed";

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
      setRefresh(true)

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
      setRefresh(true)
  };
  

  
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
     
      <div className="w-full md:w-[100%] flex flex-col justify-between mt-20 px-[25%]" >
        <div class="flex flex-grow space-x-5 items-center">
            <h1 className="text-2xl text-center font-bold m-auto">Currently Serving</h1>
        </div>
        <div class="flex flex-grow space-x-5 items-center">
            <p class="m-auto">Queue Number</p>
        </div>
        <div class="flex flex-grow space-x-5 items-center mt-12  mb-10 font-bold text-8xl">
        <p class="m-auto">{queryValues[currentIndex]}</p>
        </div>
        
        

        <div class="flex flex-grow space-x-5 mb-5 items-center">
            <p class="m-auto">Estimated Wait Time until Next Appointment: 10:00 mins</p>
        </div>

        {empty && (<div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex justify-center">
        <h2 className='items-center mt-12 mb-10 text-2xl'>Queue Empty</h2>
        </div>

        <div class="flex flex-grow space-x-5 mt-2 ">


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
            <p><span className="font-semibold">From: </span> {queue.scheduleStartTime} to {queue.scheduleEndTime}</p>
            <p><span className="font-semibold">Scheduled Date: </span> {queue.queueDate}</p>
            <p><span className="font-semibold">Status: </span> {queue.queueStatus}</p>
            <p><span className="font-semibold">Status: </span> {queue.waitingQueueNumber}</p>
            </div>
        <div class="flex flex-grow space-x-5 mt-6 ">
          
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

      <div class="flex flex-grow space-x-5">
    
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
    <hr class="border border-gray-300 m-5"></hr>
    <h1 className="text-2xl text-center font-bold m-auto mb-3">Upcoming Appointments</h1>
    
        {!loading && (<WaitingQueueList queueNumber={value}/>)}
      </div>
    </>
  )
}
