import {useEffect, useState} from 'react'
import { toast } from "react-toastify";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function ShowStatementOfAccount() {
    const [loading, setLoading] = useState(false);
    const auth = getAuth()
    const navigate = useNavigate()
    const params =  useParams();

    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
          const docRef = doc(db, "bills", params.billID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData({...docSnap.data()});
            setLoading(false);
          } else {
            navigate("/billing");
            toast.error("Bill does not exist");
          }
        }
        fetchListing();
    }, [navigate, params.billID]);

    async function onDeleteClick() {
        try {
        const documentRef = doc(db, 'bills', params.billID);
        await deleteDoc(documentRef);
          toast.success("Bill successfully deleted!");
          navigate("/billing");
        }catch (error){
          toast.error("Error deleting bills: ", error);
        }
      }


    const [formData, setFormData] = useState({
        billName: "",
        appointmentID: "",
        patientID: "",
        customerName: "",
        customerEmail: "",
        totalDue: 0,
        billDescription: "",
        billStatus: ""
      });

    const {
        billName,
        appointmentID,
        patientID,
        customerName,
        customerEmail,
        totalDue,
        billDescription,
        billStatus
    } = formData;

    function onChange(e) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
      }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const docRef = doc(db, "bills", params.billID);
            await updateDoc(docRef, {
                ...formData,
            });
            setLoading(false);
            toast.success("Bill Updated");
            navigate("/billing")
        }

        catch (error) {
          console.log(error)
          toast.error("Billing Failed\n" + error);
        }
    }


  return (
    <>
        <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">Bill Details</h1>
      <p className='text-1xl text-center mt-3 font-semibold'>See information on your transaction or payment</p>
      <form onSubmit={onSubmit}>
        
        <p className="text-lg mt-6 font-semibold">Bill Name</p>
        <input
          type="text"
          id="billName"
          value={billName}
          onChange={onChange}
          placeholder="Schedule Name"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Appointment ID</p>
        <input
          type="text"
          id="appointmentID"
          value={appointmentID}
          onChange={onChange}
          placeholder="Appointment ID"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Patient ID</p>
        <input
          type="text"
          id="patientID"
          value={patientID}
          onChange={onChange}
          placeholder="Patient ID"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Customer Name</p>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={onChange}
          placeholder="Customer Name"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Customer Email</p>
        <input
          type="text"
          id="customerEmail"
          value={customerEmail}
          onChange={onChange}
          placeholder="Customer Email"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Total Due</p>
        <input
          type="number"
          id="totalDue"
          value={totalDue}
          onChange={onChange}
          placeholder="Total Due"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Bill Description</p>
        <textarea
          type="text"
          id="billDescription"
          value={billDescription}
          onChange={onChange}
          placeholder="Bill Description"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Bill Status</p>
        <select
        id="billStatus"
        value={billStatus}
        onChange={onChange}
        disabled
        className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
         `}
      >
        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Status--</option>
        <option className=" text-gray-700" value="Unpaid">Unpaid</option>
        <option className=" text-gray-700" value="Paid">Paid</option>
      </select>
      </form>
    </main>
    </>
  )
  
}

