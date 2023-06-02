import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Report() {

  return (
    <div>
     Reports
     the average wait time for each department,
     display the average wait time for each department in real-time, and allow administrators to filter by date range and time of day.


     {/* <form onSubmit={onSubmit}>
        
      <div className="border border-gray-400 px-4 py-3 rounded-lg mb-5" >
        <p className="text-lg font-semibold">Appointment Date</p>
        <input
          type="date"
          id="queueDate"
          dateFormat="MM/dd/yyyy"
          value={queueDate}
          onChange={onChange}
          placeholder="Appointment Date"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        

        <p className="text-lg font-semibold">Schedule ID</p>
        <input
          type="text"
          id="scheduleID"
          value={scheduleID}
          onChange={onChange}
          placeholder="Schedule ID"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        
        <p className="text-lg font-semibold">Doctor Name</p>
        <input
          type="text"
          id="doctorName"
          value={doctorName}
          onChange={onChange}
          placeholder="Doctor Name"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Department Name</p>
        <input
          type="text"
          id="departmentName"
          value={departmentName}
          onChange={onChange}
          placeholder="Department Name"
          maxLength="32"
          required
          disabled
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Schedule Start Time</p>
        <TimePicker
          id="scheduleStartTime"
          name="scheduleStartTime"
          onChange={onChange}
          format="hh:mm a"
          value={scheduleStartTime}
          clearIcon={null}
          required
          disabled
          className="w-full mb-6 h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />

        <p className="text-lg font-semibold">Schedule End Time</p>
        <TimePicker
          id="scheduleEndTime"
          name="scheduleEndTime"
          onChange={onChange}
          format="hh:mm a"
          value={scheduleEndTime}
          clearIcon={null}
          required
          disabled
          className="w-full mb-6 h-10 px-3 text-base placeholder-gray-600 border rounded-lg 
          focus:outline-none focus:shadow-outline-purple focus:border-purple-500"
        />

<button
         type="button"
         onClick={openScheduleModal}
            className="mb-6 w-full px-7 py-2 bg-amber-700 text-white font-medium text-sm uppercase rounded shadow-md
                hover:bg-amber-800 hover:shadow-lg focus:bg-amber-800 focus:shadow-lg
                active:bg-amber-950 active:shadow-lg transition duration-150 ease-in-out"
            >
            Select Schedule & Doctor
        </button>
        
        </div>

        <p className="text-lg font-semibold">Appointment Description</p>
        <textarea
          type="text"
          id="queueDescription"
          value={queueDescription}
          onChange={onChange}
          placeholder="Appointment Description"
          maxLength="32"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />


        <p className="text-lg font-semibold">Queue Status</p>
        <select
        id="queueStatus"
        value={queueStatus}
        onChange={onChange}
        className={`w-full mb-6 px-4 py-2 text-lg text-gray-500 bg-white border-gray-300 rounded transition ease-in-out
         `}
      >
        <option className=" text-gray-400" value="" disabled selected hidden>--Please choose a Status--</option>
        <option className=" text-gray-700" value="Pending">Pending</option>
        <option className=" text-gray-700" value="Set">Set</option>
        <option className=" text-gray-700" value="Completed">Completed</option>
        <option className=" text-gray-700" value="Missed">Missed</option>
      </select>
        
      

    <button
      type="submit"
      className="mb-6 w-full px-7 py-2 bg-green-600 text-white font-medium text-sm uppercase rounded shadow-md
        hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg
        active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
    >
      Add Apointment to Queue
    </button>
      </form> */}
    </div>
  )
}
