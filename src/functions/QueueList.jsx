import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function QueueList(props) {

    const [queues, setQueues] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      if (searchTerm){
      const q = searchTerm
        ? query(
            collection(db, 'queue'),
            where('patientName', '>=', searchTerm),
            where('patientName', '<=', searchTerm + '\uf8ff'),
          )
        : collection(db, 'queue', orderBy('queueNumber', 'asc'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const queuesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueues(queuesData);

      });
      return unsubscribe;
      
      } else {  
        const unsubscribe = onSnapshot(
          query(collection(db, 'queue'), orderBy('queueNumber', 'desc')),
          (snapshot) => {
            const schedulesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setQueues(schedulesData);
          }
        );
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    function handleModifyClick (id) {
      props.openModifyModal(id)
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
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-green-200 overflow-x-auto shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Timeslot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
                {queues.map((queue) => (
                <tr key={queue.id} 
                className='hover:bg-green-200 cursor-pointer hover:cursor-pointer'
                onClick={() => handleModifyClick(queue.id)}>
                <td className="py-4 px-6 whitespace-nowrap">{queue.queueNumber}</td>
                <td className="py-4 px-6 whitespace-nowrap">{queue.patientName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{queue.doctorName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{queue.departmentName}</td>
                <td className="py-4 px-6 whitespace-nowrap">{queue.scheduleStartTime} to {queue.scheduleEndTime}</td>
                <td className="py-4 px-6 whitespace-nowrap">{queue.queueDate}</td>
                <td className="py-4 px-6 whitespace-nowrap">{queue.queueStatus}</td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default QueueList
