import { useEffect, useState } from 'react';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { addDoc, collection, orderBy, onSnapshot, updateDoc, serverTimestamp, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";


function StatementOfAccountList() {

    const [bills, setBills] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const auth = getAuth()

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'bills'),
              where('resourceName', '>=', searchTerm),
              where('resourceName', '<=', searchTerm + '\uf8ff'),
              where('billPatientEmail', '==', auth.currentUser.email)
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
            collection(db, 'bills'),
            where('billPatientEmail', '==', auth.currentUser.email)
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
          placeholder="Search by item name (case-sensitive)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

<div className="bg-green-200 shadow overflow-hidden overflow-x-auto sm:rounded-lg">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>

                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">

                {bills.map((bill) => (
                <tr key={bill.id}>
                <td className="py-4 px-6 whitespace-nowrap">{bill.resourceName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.billAppointmentDate}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.billPatientName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.billPatientEmail}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.resourcePrice}</td>
                <td className="py-4 px-6 whitespace-nowrap">{bill.resourceStatus}</td>
                </tr>
                ))}

            </tbody>
        </table>
        </div>
    </div>
  )
}

export default StatementOfAccountList
