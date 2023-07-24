import React from 'react'
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react';
import QueueList from '../../functions/QueueList';
import CreateQueueModal from '../../modules/adminModules/CreateQueueModal';
import EditQueueModal from '../../modules/adminModules/EditQueueModal';


import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

export default function Queue() {

    const navigate = useNavigate()

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [modifyKey, setModifyKey] = useState('');

    function closeDialogModal() {
        setIsDialogOpen(false);
    }

    function openDialogModal() {
        setIsDialogOpen(true);
    }

    const [isModifyOpen, setIsModifyOpen] = useState(false);

    function closeModifyModal() {
        setIsModifyOpen(false);
    }

    function openModifyModal(id) {
        setIsModifyOpen(true);
        setModifyKey(id)
    }

  return (
    <>
    <h1 className="text-3xl text-center mt-14 font-bold">Manage Appointments</h1>
    <p className='text-1xl text-center mt-2 font-semibold'>Click  any appointments to edit</p>

      <div className="w-full md:w-[100%] mt-10 px-[25%]" >
          <button className='mb-6 w-full bg-green-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md 
          hover:bg-green-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-green-900'
          onClick={openDialogModal}
          >Create an Appointment</button>

      </div>

      <div className="container mx-auto p-4">
        <QueueList openModifyModal={openModifyModal}/>
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
            <div className="inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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
                Create A New Appointment
              </Dialog.Title> 

              <CreateQueueModal closeDialogModal={closeDialogModal}/>
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
            <div className="inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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
                Modify Appointment
              </Dialog.Title> 

              <EditQueueModal id={modifyKey} closeModifyModal={closeModifyModal}/>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    </>
  )
}
