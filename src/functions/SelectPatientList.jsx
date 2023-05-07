import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function SelectPatientList(props) {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
     
      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'users'),
              where('isPatient', '==', true),
              where('name', '>=', searchTerm),
              where('name', '<=', searchTerm + '\uf8ff')
            )
          : collection(db, 'users', orderBy('name'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const booksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(booksData);
        
        });
    
        return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'users'),
            where('isPatient', '==', true),
          )
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(booksData);
       
      });
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    // const onClickHandler = (e) => {
    //   //localStorage.setItem('patient-id', JSON.stringify(e));
    //   onClickHandler1()
    // }

    function onClickHandler() {
      props.closePatientModal()
    }

    function handleClick(e) {
     props.getPatientID(e)
    }

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
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={() => {
            handleClick(user.id);
            onClickHandler();
          }}
          
          >
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p><span className="font-semibold">Email: </span> {user.email}</p>
            <p><span className="font-semibold">Date of birth</span>: {user.dob}</p>
            <p><span className="font-semibold">Sex</span>: {user.sex}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectPatientList
