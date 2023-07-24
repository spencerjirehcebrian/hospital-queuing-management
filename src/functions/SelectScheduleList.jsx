import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function SelectScheduleList(props) {

    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

      if (searchTerm){
      const q = searchTerm
        ? query(
            collection(db, 'schedules'),
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff')
          )
        : collection(db, 'schedules', orderBy('name'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const schedulesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchedules(schedulesData);

      });
      return unsubscribe;
      
      } else {
          const unsubscribe = onSnapshot(collection(db, 'schedules'), (snapshot) => {
          const schedulesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSchedules(schedulesData);

        });
        return unsubscribe;
      }
    }, [searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    function onClickHandler() {
      props.closeScheduleModal();
    }

    function handleClick(e) {
     props.getScheduleID(e);
     props.closeScheduleModal();
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
          placeholder="Search by schedule name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
      {schedules.map((schedule) => (
          <div key={schedule.id} 
          className="bg-white p-4 rounded-lg shadow cursor-pointer"
          onClick={()=>handleClick(schedule.id)}>
            <h2 className="text-xl font-semibold">{schedule.name}</h2>
            <p><span className="font-semibold">Doctor Name: </span> {schedule.doctorName}</p>
            <p><span className="font-semibold">Department: </span> {schedule.departmentName}</p>
            <p><span className="font-semibold">Time Slot</span>: {schedule.startTime} - {schedule.endTime}</p>
            <p><span className="font-semibold">Doctor Availiable: </span> {schedule.isAvailable ? "Yes" : "No"}</p>
            <span className="font-semibold">Days Availiable: </span> 
            <span className={schedule.isSunday ? "text-green-600 font-bold" : "text-gray-400 "}>Sun </span>
            <span className={schedule.isMonday ? "text-green-600 font-bold" : "text-gray-400 "} >Mon </span>
            <span className={schedule.isTuesday ? "text-green-600 font-bold" : "text-gray-400 "}>Tue </span>
            <span className={schedule.isWednesday ? "text-green-600 font-bold" : "text-gray-400 "}>Wed </span>
            <span className={schedule.isThursday ? "text-green-600 font-bold" : "text-gray-400 "}>Thu </span>
            <span className={schedule.isFriday ? "text-green-600 font-bold" : "text-gray-400 "}>Fri </span>
            <span className={schedule.isSaturday ? "text-green-600 font-bold" : "text-gray-400 "}>Sat </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectScheduleList
