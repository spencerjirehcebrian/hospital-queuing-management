import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { getAuth } from "firebase/auth";

function StatementOfAccountList() {

    const auth = getAuth()

    const [bills, setBills] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      if (searchTerm){
      const q = searchTerm
        ? query(
            collection(db, 'bills'),
            where('patientID', '==' , auth.currentUser.uid),
            where('billName', '>=', searchTerm),
            where('billName', '<=', searchTerm + '\uf8ff')
            
          )
        : collection(db, 'bills', orderBy('billName'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const schedulesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBills(schedulesData);

      });
      return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'bills'),
            where('patientID', "==" , auth.currentUser.uid)
            )

          const unsubscribe = onSnapshot(q, (snapshot) => {
          const schedulesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBills(schedulesData);

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
      {/* <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          id="search"
          className="w-full px-4 py-2 rounded-lg shadow"
          placeholder="Search by billing name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div> */}

      <div className="grid grid-cols-1 gap-4">
        {bills.map((bill) => (
          <div key={bill.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/show-statement-of-account/${bill.id}`)}>
            <h2 className="text-xl font-semibold">{bill.billName}</h2>
            <p><span className="font-semibold">Appointment ID: </span> {bill.appointmentID}</p>
            <p><span className="font-semibold">Total Due: </span> PHP {bill.totalDue}</p>
            <p><span className="font-semibold">Bill Description: </span> {bill.billDescription}</p>
            <p><span className="font-semibold">Bill Status: </span> {bill.billStatus}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatementOfAccountList
