import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDocs, getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { getAuth } from "firebase/auth";

function AppointmentList({closeCheckInListModal}) {

  const auth = getAuth()

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [queryValues, setQueryValues] = useState([])
    const [highestValue, setHighestValue] = useState(0)
    const [backupValue, setBackupValue] = useState(0)

    useEffect(() => {

        if (searchTerm){
  
          const q = searchTerm
            ? query(
                collection(db, 'queue'),
                where('patientID', "in", [auth.currentUser.uid]),
                where('queueStatus', "in", ["Set"]),
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
            where('patientID', "in", [auth.currentUser.uid]),
            where('queueStatus', "in", ["Set"])
            )
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const booksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQueues(booksData);

        getArrayOfField()
          .then((fieldValues) => {
              setQueryValues(fieldValues)
              setHighestValue(Math.max(...fieldValues));
          })
          .catch((error) => {
              console.error("Error retrieving field values:", error);
          });

        getCurrentQueueNumber()
          .then((retrievedValue) => {
            setBackupValue(retrievedValue + 1)
          })
          .catch((error) => {
              console.error("Error retrieving field values:", error);
          });

         
        });
          return unsubscribe;
        }
      }, [searchTerm]);
  
    async function getArrayOfField() {
        const collectionName = "queue";
        const fieldToRetrieve = "waitingQueueNumber"; 

        const q = query(
        collection(db, collectionName),
        );
        
        const querySnapshot = await getDocs(q);
    
        const fieldValues = querySnapshot.docs.map((doc) => doc.data()[fieldToRetrieve]);
        setQueryValues(fieldValues)
        setLoading(false)
        return fieldValues;
    }

    async function getCurrentQueueNumber() {
        const docRef = doc(db, 'globalVariables', 'aplmxmAVlIdS8vAVFOut');
        const snapshot = await getDoc(docRef);
        const data = snapshot.data();
        const retrievedValue = data.currentQueueNumber;
        return retrievedValue;
    }


    const checkIn = (id) => {
      setLoading(true)
      
      const fieldValues = []

        const q = query(
          collection(db, "queue")
          );  

      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            fieldValues.push(doc.data().waitingQueueNumber);
          });
          const integersOnly = fieldValues.filter((value) => Number.isInteger(value));

          const maxQueueingNumber = (Math.max(...integersOnly)) + 1

      const collectionName = "queue";
      const documentId = id; 
      const fieldToUpdate = "queueStatus";
      const updatedValue = "Checked In";

      const documentRef = doc(db, collectionName, documentId);
      
        const updateData = {
          [fieldToUpdate]: updatedValue,
          waitingQueueNumber:maxQueueingNumber,
          timeCheckIn: serverTimestamp()
        };

        updateDoc(documentRef, updateData)
        .then(() => {
          setLoading(false)
  
        })
        .catch((error) => {
          console.error("Error updating document:", error);
          setLoading(false)
        });

        const documentRef1 = doc(db, "users", auth.currentUser.uid);
        const updateData1 = {
          isCheckedIn: true,
          appointmentID: documentId,
          appointmentQueueNumber: maxQueueingNumber
        };

        updateDoc(documentRef1, updateData1)
          .then(() => {
            closeCheckInListModal()
            setLoading(false)
          })
          .catch((error) => {
            console.error("Error updating document:", error);
            setLoading(false)
          });
          
        })
        .catch((error) => {
          console.error("Error getting documents:", error);
          setLoading(false)
        });
    };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto p-4">

      <div className="grid grid-cols-1 gap-4">
        {queues.map((queue) => (
          <div key={queue.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>checkIn(queue.id)}>
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
