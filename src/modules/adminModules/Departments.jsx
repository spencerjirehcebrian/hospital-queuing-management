import React from 'react'
import { useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import DepartmentList from '../../functions/DepartmentList';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { addDoc, collection, updateDoc, serverTimestamp, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";


export default function Departments() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [modifiedKey, setModifiedKey] = useState("");
    const [formData, setFormData] = useState({
        departmentName: "",
        departmentDescription: "",
      });

    const {
        departmentName,
        departmentDescription
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

        await addDoc(collection(db, "departments"), formData);
        setLoading(false);
        toast.success("Department Added");
        setIsDialogOpen(false)
        }

        catch (error) {
          console.log(error)
          toast.error("Error Encountered\n" + error);
        }
    }

    async function onSave(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = doc(db, "departments", modifiedKey);
            await updateDoc(docRef, {
              ...formData,
            });
          setLoading(false);
          toast.success("Changes Saved");
          setIsModifyOpen(false)
          }

        catch (error) {
          console.log(error)
          toast.error("Error Encountered\n" + error);
        }
    }

    async function onDeleteClick(id) {
        try {
        const documentRef = doc(db, 'departments', id);
        await deleteDoc(documentRef);
          toast.success("Department successfully deleted");
          navigate("/departments");
        }catch (error){
          toast.error("Error deleting bills: ", error);
        }
      }

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function closeDialogModal() {
        setIsDialogOpen(false);
    }

    function openDialogModal() {
        setIsDialogOpen(true);
        setFormData({ ...formData,departmentName: "", departmentDescription: "",});
    }

    const [isModifyOpen, setIsModifyOpen] = useState(false);

    function closeModifyModal() {
        setIsModifyOpen(false);
    }

    function openModifyModal() {
        setIsModifyOpen(true);
    }

    async function fetchListing(id) {
        const docRef = doc(db, "departments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setFormData({...docSnap.data()});
        setLoading(false);
        }
    }
        
    const handleKeyUpdate = (newKey) => {
        setModifiedKey(newKey)
        setLoading(true);
        fetchListing(newKey);
      };

  return (
    <>
    <h1 className="text-3xl text-center mt-14 font-bold">Manage Departments</h1>
      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
          <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={openDialogModal}
          >Add a Hospital Department</button>

      </div>

      <div className="container mx-auto p-4">
        <DepartmentList updateKey={handleKeyUpdate} openModify={openModifyModal} deleteDepartment={onDeleteClick}/>
      </div>

    <Transition appear show={isDialogOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeDialogModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  onClick={closeDialogModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Add new department
              </Dialog.Title> 
              <div className="mt-2">
                <form onSubmit={onSubmit}>
            
                    <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
                    <p className="text-lg mt-6 font-semibold">Department Name:</p>
                        <input
                        type="text"
                        id="departmentName"
                        value={departmentName}
                        onChange={onChange}
                        
                        placeholder="Department Name"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Department Description:</p>
                        <textarea
                        type="text"
                        id="departmentDescription"
                        value={departmentDescription}
                        onChange={onChange}
                        placeholder="Department Description"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />
                        </div>

                            <button
                            type="submit"
                            className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
                                hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
                                active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                            Add Department
                            </button>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

        
    <Transition appear show={isModifyOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModifyModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  onClick={closeModifyModal}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Modify the department
              </Dialog.Title> 
              <div className="mt-2">
                <form onSubmit={onSave}>
            
                    <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
                    <p className="text-lg mt-6 font-semibold">Department Name:</p>
                        <input
                        type="text"
                        id="departmentName"
                        value={departmentName}
                        onChange={onChange}
                        
                        placeholder="Department Name"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Department Description:</p>
                        <textarea
                        type="text"
                        id="departmentDescription"
                        value={departmentDescription}
                        onChange={onChange}
                        placeholder="Department Description"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />
                        </div>

                            <button
                            type="submit"
                            className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
                                hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
                                active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                            Save
                            </button>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

    </>
  )
}
