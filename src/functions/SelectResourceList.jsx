import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function SelectResourceList(props) {

    const [resources, setResource] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      setLoading(true)
     
      if (searchTerm){

        const q = searchTerm
          ? query(
              collection(db, 'resources'),
              where('resourceName', '>=', searchTerm),
              where('resourceName', '<=', searchTerm + '\uf8ff'),
              where('resourceQuantity', '>', 0)
            )
          : collection(db, 'resources', orderBy('sresourceName'));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setResource(data);
          setLoading(false)
        
        });
    
        return unsubscribe;
      
      } else {

        const q = query(
            collection(db, 'resources'),
            where('resourceQuantity', '>', 0)
          )
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResource(booksData);
        setLoading(false)
       
      });
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    function handleModifyClick (resourceIdParam, resourceNameParam, resourcePriceParam) {
        const newElement = {resourceId:resourceIdParam, resourceName: resourceNameParam, resourcePrice: resourcePriceParam, resourceStatus: 'Unpaid' };
        props.addElement(newElement);
        props.closeResourceModal();
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
          placeholder="Search by resource name (case-sensitive)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-green-200 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">

                {resources.map((resource) => (
                <tr key={resource.id} className='hover:bg-green-200 cursor-pointer hover:cursor-pointer'
                onClick={() => handleModifyClick(resource.id, resource.resourceName, resource.resourcePrice)}>
                <td className="py-4 px-6 whitespace-nowrap">{resource.resourceName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{resource.resourceDescription}</td>
                <td className="py-4 px-6 whitespace-nowrap">{resource.resourceType}</td>
                <td className="py-4 px-6 whitespace-nowrap">{resource.resourceQuantity}</td>
                <td className="py-4 px-6 whitespace-nowrap">{resource.resourcePrice}</td>
                </tr>
                ))}

            </tbody>
        </table>
        </div>

    </div>
  )
}
