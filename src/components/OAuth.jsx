import React from 'react'
import {FcGoogle} from 'react-icons/fc'

export default function OAuth() {
  return (
<button
className='flex items-center justify-center w-full bg-green-700 text-white px-7 py-3 uppercase text-sm font-medium
hover:bg-green-800 active:bg-green-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded'>
<FcGoogle className='text-1xl bg-white rounded-full mr-2'/> Continue With Google Account
</button>
  )
}
