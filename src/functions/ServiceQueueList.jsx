import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, updateDoc, getDoc, doc, orderBy, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { toast } from "react-toastify";

export default function ServiceQueueList(props) {

    const [patients, setPatients] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
     
      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'queue'),
              where('queueStatus', '==', 'In Service'),
              where('patientName', '>=', searchTerm),
              where('patientName', '<=', searchTerm + '\uf8ff')
            )
          : collection(db, 'queue', orderBy('queueNumber'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPatients(data);
        
        });
    
        return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'queue'),
            where('queueStatus', '==', 'In Service'),
            orderBy('queueNumber')
          )
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(data);
       
      });
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    function handleModifyClick (id) {
        props.openModify();
        props.updateKey(id);
    };

    function handleCompleteClick (id) {
        const collectionName = "queue";
        const documentId = id; 
        const fieldToUpdate = "queueStatus";
        const updatedValue = "Completed";
        var emailValue = "";
    
        const documentRef = doc(db, collectionName, documentId);

        const documentSnapshot = getDoc(documentRef);
        getDoc(documentRef)
        .then((documentSnapshot) => {
            const documentData = documentSnapshot.data();
            emailValue = documentData.patientEmail;

            const updateData = {
                [fieldToUpdate]: updatedValue,
                timeComplete: serverTimestamp()
            };

            updateDoc(documentRef, updateData)
                .then(() => {
                    
                    const q = query(collection(db, "users"), where('email', '==', emailValue));

                    getDocs(q)
                    .then((documentSnapshot1) => {
                    documentSnapshot1.forEach((docu) => {
                        const docRef = doc(db, "users", docu.id);
                        updateDoc(docRef, { isCheckedIn: false })
                            .then(() => {
                                toast.success("Status set to Completed and removed from Queue");
                            })
                            .catch((error) => {
                                toast.error('Error updating document:', docu.id, error);
                            });
                        });
                        
                    })
                    .catch((error) => {
                        toast.error("Error updating document:", error);
                    });
                    
            
          })
          .catch((error) => {
            toast.error("Error updating document:", error);
          });
        })
        .catch((error) => {
        toast.error('Error retrieving document:', error);
        console.log('Error retrieving document:', error);
        });
    }

    function handleCheckedInClick (id) {
        const collectionName = "queue";
        const documentId = id; 
        const fieldToUpdate = "queueStatus";
        const updatedValue = "Checked In";
    
        const documentRef = doc(db, collectionName, documentId);
        const updateData = {
          [fieldToUpdate]: updatedValue,
          timeComplete: serverTimestamp()
        };
    
        updateDoc(documentRef, updateData)
          .then(() => {
            toast.success("Status set to Checked In and returned to Waiting Queue");
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
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
          type="text"
          id="search"
          className="w-full px-4 py-2 rounded-lg shadow"
          placeholder="Search by patient name (case-sensitive)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-green-200 overflow-x-auto shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
                <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Queue #</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Time Slot</th>                
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Queue Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">

                {patients.map((patient) => (
                <tr>
                <td className="py-4 px-6 whitespace-nowrap">{patient.queueNumber}</td>
                <td className="py-4 px-6 whitespace-nowrap">{patient.patientName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{patient.scheduleStartTime} <b>to</b> {patient.scheduleEndTime}</td>                
                <td className="py-4 px-6 whitespace-nowrap">{patient.departmentName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{patient.queueStatus}</td>
                <td className="py-4 px-6 whitespace-nowrap">{patient.doctorName}</td>
                <td className="py-4 px-6 flex flex-col text-right whitespace-nowrap">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 m-1 rounded"
                onClick={() => handleCompleteClick(patient.id)}>
                    Mark as Completed
                </button>
                <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 m-1 rounded"
                onClick={() => handleCheckedInClick(patient.id)}>
                    Return to Waiting Queue
                </button>
                <button className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 m-1 rounded"
                onClick={() => handleModifyClick(patient.id) }>
                    Modify
                </button>
                </td>
                </tr>
                ))}

            </tbody>
        </table>
        </div>

    </div>
  )
}