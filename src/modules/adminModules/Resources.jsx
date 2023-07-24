import React from 'react'
import { useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import ResourceList from '../../functions/ResourceList';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { addDoc, collection, updateDoc, serverTimestamp, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";


export default function Resources() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [modifiedKey, setModifiedKey] = useState("");
    const [formData, setFormData] = useState({
        resourceName: "",
        resourceDescription: "",
        resourceType: "",
        resourceQuantity: 0,
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

    function onChangeInt(e) {

      const intValue = parseInt(e.target.value);
      const newValue = isNaN(intValue) ? 0 : intValue;

        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: newValue,
        }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {

        await addDoc(collection(db, "resources"), formData);
        setLoading(false);
        toast.success("Resource Added");
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

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function closeDialogModal() {
        setIsDialogOpen(false);
    }

    function openDialogModal() {
        setIsDialogOpen(true);
        setFormData({ ...formData,resourceName: "",
        resourceDescription: "",
        resourceType: "",
        resourceQuantity: 0,
        resourcePrice: "",});
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
        setLoading(true);
        fetchListing(newKey);
      };

  return (
    <>
    <h1 className="text-3xl text-center mt-14 font-bold">Manage Services, Staff, Equipment and Pricing</h1>
      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
          <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={openDialogModal}
          >Add a Resource</button>

      </div>

      <div className="container mx-auto p-4">
        <ResourceList updateKey={handleKeyUpdate} openModify={openModifyModal} deleteDepartment={onDeleteClick}/>
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
                Add new resource
              </Dialog.Title> 
              <div className="mt-2">
                <form onSubmit={onSubmit}>
            
                    <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
                    <p className="text-lg mt-6 font-semibold">Resource Name:</p>
                        <input
                        type="text"
                        id="resourceName"
                        value={resourceName}
                        onChange={onChange}
                        
                        placeholder="Resource Name"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Resource Description:</p>
                        <textarea
                        type="text"
                        id="resourceDescription"
                        value={resourceDescription}
                        onChange={onChange}
                        placeholder="Resource Description"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Resource Type</p>
                        <select
                        id="resourceType"
                        value={resourceType}
                        onChange={onChange}
                        className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
                        `}>
                        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Type--</option>
                        <option className=" text-gray-700" value="Consumable">Consumable (Quantity reduces)</option>
                        <option className=" text-gray-700" value="Non-consumable">Non-consumable (Quantity does not reduce)</option>
                        <option className=" text-gray-700" value="Re-usable">Re-usable (Quantity reduces but restores after appointment completion)</option>
                      </select>

                        <p className="text-lg font-semibold">Resource Quantity:</p>
                        <input
                        type="number"
                        id="resourceQuantity"
                        value={resourceQuantity}
                        onChange={onChangeInt}
                        placeholder="Resource Quantity"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Resource Price:</p>
                        <input
                        type="number"
                        id="resourcePrice"
                        value={resourcePrice}
                        onChange={onChangeInt}
                        placeholder="Resource Price"
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
                            Add Resource
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
                Modify the resource
              </Dialog.Title> 
              <div className="mt-2">
                <form onSubmit={onSave}>
            
                    <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
                    <p className="text-lg mt-6 font-semibold">Resource Name:</p>
                        <input
                        type="text"
                        id="resourceName"
                        value={resourceName}
                        onChange={onChange}
                        
                        placeholder="Resource Name"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Resource Description:</p>
                        <textarea
                        type="text"
                        id="resourceDescription"
                        value={resourceDescription}
                        onChange={onChange}
                        placeholder="Resource Description"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Resource Type</p>
                        <select
                        id="resourceType"
                        value={resourceType}
                        onChange={onChange}
                        className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
                        `}>
                        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Type--</option>
                        <option className=" text-gray-700" value="Consumable">Consumable (Quantity reduces)</option>
                        <option className=" text-gray-700" value="Non-consumable">Non-consumable (Quantity does not reduce)</option>
                        <option className=" text-gray-700" value="Re-usable">Re-usable (Quantity reduces but restores after appointment completion)</option>
                      </select>

                        <p className="text-lg font-semibold">Resource Quantity:</p>
                        <input
                        type="number"
                        id="resourceQuantity"
                        value={resourceQuantity}
                        onChange={onChangeInt}
                        placeholder="Resource Quantity"
                        maxLength="32"
                        required
                        
                        className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
                        rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
                        />

                        <p className="text-lg font-semibold">Resource Price:</p>
                        <input
                        type="number"
                        id="resourcePrice"
                        value={resourcePrice}
                        onChange={onChangeInt}
                        placeholder="Resource Price"
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
