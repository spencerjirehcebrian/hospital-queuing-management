import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

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
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff')
          )
        : collection(db, 'bills', orderBy('name'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const schedulesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBills(schedulesData);

      });
      return unsubscribe;
      
      } else {
          const unsubscribe = onSnapshot(collection(db, 'bills'), (snapshot) => {
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
      <div className="mb-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        {bills.map((bill) => (
          <div key={bill.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-schedule/${bill.id}`)}>
            <h2 className="text-xl font-semibold">{bill.name}</h2>
            <p><span className="font-semibold">Doctor Name: </span> {bill.doctorName}</p>
            <p><span className="font-semibold">Time Slot</span>: {bill.startTime} - {bill.endTime}</p>
            <span className="font-semibold">Days Availiable: </span> 
          </div>
        ))}
      </div>
    </div>
  )
}

export default BillingList
