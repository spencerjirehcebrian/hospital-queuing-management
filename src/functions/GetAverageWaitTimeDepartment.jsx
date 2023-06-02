import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { getAuth } from "firebase/auth";

const GetAverageWaitTimeDepartment = (department, startDate, stopDate) => {

    console.log(department, startDate, stopDate)


    useEffect(() => {
        const calculateTimeDifference = async () => {
            const collectionName = "reports";
            const documentId = 'FHVCfutBv2S4lf68PHSN'; 

            const documentRef = doc(db, collectionName, documentId);

            var averages = []

            const startDate1 = new Date(startDate);
            startDate1.setHours(0, 0, 0, 0);
            const stopDate1 = new Date(stopDate);
            stopDate1.setHours(23, 59, 59, 999);

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
                    
                    const difference =  timeCompleted.getTime() - timeCheckIn.getTime();
                    averages.push(difference)
                    const averageCalculated = averages.reduce((total, num) => total + num, 0) / averages.length;
                    const minutes = Math.ceil(averageCalculated / 60000);

                    const updateData = {
                        department: parseFloat(minutes),
                    };
                    
                    updateDoc(documentRef, updateData)
                    .then(() => {
                        //console.log("Success");
                    })
                    .catch((error) => {
                        console.error("Error updating document:", error);
                    });

                });

        }
        calculateTimeDifference()
        
    }, [department, startDate, stopDate]); 
    
    return null;
}

export default GetAverageWaitTimeDepartment;