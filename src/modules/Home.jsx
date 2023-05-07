import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
    <h1 className="text-3xl text-center mt-6 font-bold z-10">Charge a Customer</h1>
    <div class="fixed inset-0 overflow-hidden flex items-center justify-center">

      <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1168&q=80" 
      alt="My Image" class="object-cover h-full w-full"/>
        <div class="absolute inset-0 flex items-center justify-center">
          <h1 class="text-4xl text-green-800 text-center font-bold border rounded-md bg-green-100 border-green-800 p-4">Hospital Patient Queuing <br />and<br /> Management System</h1>
        </div>
    </div>
</>
  )
}

export default Home;