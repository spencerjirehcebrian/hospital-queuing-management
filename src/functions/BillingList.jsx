import { useEffect, useState } from 'react';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { toast } from "react-toastify";
import { addDoc, collection, orderBy, onSnapshot, updateDoc, serverTimestamp, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";


function BillingList() {

    const [bills, setBills] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'bills'),
              where('billPatientName', '>=', searchTerm),
              where('billPatientName', '<=', searchTerm + '\uf8ff')
            )
          : collection(db, 'bills', orderBy('billAppointmentDate'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBills(data);
        
        });
    
        return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'bills')
          )
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBills(booksData);

       
      });
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    function handleModifyClick (id) {
      
      const documentRef = doc(db, 'bills', id);
      var newValue;

      getDoc(documentRef)
      .then((documentSnapshot) => {
        if (documentSnapshot.exists()) {
          const fieldData = documentSnapshot.get('resourceStatus');

          if (fieldData == "Unpaid") {
            newValue = "Paid"
          }
          else{
            newValue = "Unpaid"
          }

          updateDoc(documentRef, {['resourceStatus']: newValue})
            .then(() => {
              toast.success('Bill Status Changed');

            })
            .catch((error) => {
              toast.error('Error updating document:', error);
              
            });
        } else {
          console.log('Document does not exist.');
          return null;
        }
      })
      .catch((error) => {
        console.error('Error retrieving document:', error);
        return null;
      });

      
    };
    
    async function handleDeleteClick (id) {
      try {
        const documentRef = doc(db, 'bills', id);
        await deleteDoc(documentRef);
          toast.success("Resource successfully deleted");
        }catch (error){
          toast.error("Error Encountered: ", error);
        }
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

<div className="bg-green-200 shadow overflow-hidden overflow-x-auto sm:rounded-lg">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>

                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">

                {bills.map((bill) => (
                <tr key={bill.id}>
                <td className="py-4 px-6 whitespace-nowrap">{bill.billAppointmentDate}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.billPatientName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.billPatientEmail}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.resourceName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.resourcePrice}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.resourceStatus}</td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
                onClick={() => handleModifyClick(bill.id)}>
                    Change Status
                </button>
                <button className="bg-amber-600 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeleteClick(bill.id)}>
                    Delete
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

export default BillingList
