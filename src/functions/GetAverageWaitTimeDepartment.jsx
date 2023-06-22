import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { getAuth } from "firebase/auth";
import {toast} from 'react-toastify'

function GetAverageWaitTimeDepartment(department, startDate, stopDate) {

    //console.log(department, startDate, stopDate)

    const calculateTimeDifference = async () => {
        var averages = []

        const startDate1 = new Date(startDate);
        startDate1.setHours(0, 0, 0, 0);
        const stopDate1 = new Date(stopDate);
        stopDate1.setHours(23, 59, 59, 999);

        //console.log(department, startDate1, stopDate1)

        const q = query(
            collection(db, 'queue'),
            orderBy('timeCompleted'),
            where('departmentName', "==", department),
            where('timeCompleted', '>=', startDate1),
            where('timeCompleted', '<=', stopDate1)
            );
    
            const snapshot = await getDocs(q);
        
            snapshot.forEach(doc => {
                const timeCheckIn = doc.data().timeCheckIn.toDate();
                const timeCompleted = doc.data().timeCompleted.toDate();

                console.log("found", timeCheckIn, timeCompleted)
                
                const difference =  timeCompleted.getTime() - timeCheckIn.getTime();
                averages.push(difference)
                const averageCalculated = averages.reduce((total, num) => total + num, 0) / averages.length;
                const minutes = Math.ceil(averageCalculated / 60000);

                //console.log(parseFloat(minutes))

                // const updateData = {
                //     [department]: parseFloat(minutes),
                // };
                
                // updateDoc(documentRef, updateData)
                // .then(() => {
                //     toast.success("Report Generated");
                // })
                // .catch((error) => {
                //     toast.error("Error updating document:", error);
                // });

                //send(department, parseFloat(minutes))

                return parseFloat(minutes)
                

            });

    }
    return calculateTimeDifference()
}

export default GetAverageWaitTimeDepartment;