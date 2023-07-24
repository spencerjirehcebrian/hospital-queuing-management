import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function DoctorList(props) {

    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
     
      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'departments'),
              where('departmentName', '>=', searchTerm),
              where('departmentName', '<=', searchTerm + '\uf8ff')
            )
          : collection(db, 'departments', orderBy('departmentName'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDepartments(data);
        
        });
    
        return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'departments')
          )
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDepartments(booksData);
       
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

    function handleDeleteClick (id) {
        props.deleteDepartment(id);
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
          placeholder="Search by department name (case-sensitive)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div class="bg-green-200 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-green-200">
            <thead class="bg-green-100">
                <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Controls</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-green-200">

                {departments.map((department) => (
                <tr>
                <td class="py-4 px-6 whitespace-nowrap">{department.departmentName}</td>
                <td class="py-4 px-6 whitespace-nowrap">{department.departmentDescription}</td>
                <td class="py-4 px-6 text-right whitespace-nowrap">
                <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
                onClick={() => handleModifyClick(department.id)}>
                    Modify
                </button>
                <button class="bg-amber-600 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeleteClick(department.id)}>
                    Delete
                </button>
                </td>
                </tr>
                ))}

            </tbody>
        </table>
        </div>

      {/* <div className="grid grid-cols-1 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>navigate(`/edit-doctor/${doctor.id}`)}>
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p><span className="font-semibold">Email: </span> {doctor.email}</p>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default DoctorList
