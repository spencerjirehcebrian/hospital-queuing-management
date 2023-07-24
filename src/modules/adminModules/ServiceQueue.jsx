import React from 'react'
import { useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import ServiceQueueList from '../../functions/ServiceQueueList';
import EditQueueModal from '../../modules/adminModules/EditQueueModal';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { addDoc, collection, updateDoc, serverTimestamp, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";

import Spinner from "../../components/Spinner";


export default function ServiceQueue() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [modifiedKey, setModifiedKey] = useState("");
    const [formData, setFormData] = useState({
        resourceName: "",
        resourceDescription: "",
        resourceType: "",
        resourceQuantity: "",
        resourcePrice: "",
      });

    const {
      resourceName,
      resourceDescription,
      resourceType,
      resourceQuantity,
      resourcePrice
    } = formData;

    function onChange(e) {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value,
        }));
    }

    async function onSave(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = doc(db, "resources", modifiedKey);
            await updateDoc(docRef, {
              ...formData,
            });
          setLoading(false);
          toast.success("Changes Saved");
          setIsModifyOpen(false)
          }

        catch (error) {
          console.log(error)
          toast.error("Error Encountered: " + error);
        }
    }

    async function onDeleteClick(id) {
        try {
        const documentRef = doc(db, 'resources', id);
        await deleteDoc(documentRef);
          toast.success("Resource successfully deleted");
        }catch (error){
          toast.error("Error Encountered: ", error);
        }
      }

    const [isModifyOpen, setIsModifyOpen] = useState(false);

    function closeModifyModal() {
        setIsModifyOpen(false);
    }

    function openModifyModal() {
        setIsModifyOpen(true);
    }

    async function fetchListing(id) {
        const docRef = doc(db, "resources", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setFormData({...docSnap.data()});
        setLoading(false);
        }
    }
        
    const handleKeyUpdate = (newKey) => {
        setModifiedKey(newKey)
        setLoading(false);
        fetchListing(newKey);
      };

    if (loading) {
    return <Spinner />;
    }
    
  return (
    <>
    <h1 className="text-3xl text-center mt-14 font-bold">Patients Currently In Service</h1>


      <div className="container mx-auto p-4">
        <ServiceQueueList updateKey={handleKeyUpdate} openModify={openModifyModal} deleteDepartment={onDeleteClick}/>
      </div>

        
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
              <EditQueueModal id={modifiedKey}/>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

    </>
  )
}
