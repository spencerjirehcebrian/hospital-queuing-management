import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function DoctorList() {

    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
     
      if (searchTerm){
        
        const q = searchTerm
          ? query(
              collection(db, 'users'),
              where('isDoctor', '==', true),
              where('name', '>=', searchTerm),
              where('name', '<=', searchTerm + '\uf8ff')
            )
          : collection(db, 'users', orderBy('name'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const booksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDoctors(booksData);
        
        });
    
        return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'users'),where('isDoctor', '==', true)

          )
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(booksData);
       
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
<hr className="border border-gray-300 mb-10"></hr>

      {/* <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          id="search"
          className="w-full px-4 py-2 rounded-lg shadow"
          placeholder="Search by doctor name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div> */}

      <div className="grid grid-cols-1 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-doctor/${doctor.id}`)}>
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p><span className="font-semibold">Email: </span> {doctor.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorList
