import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { getAuth } from "firebase/auth";

export const UpdateServiceWaitTime = () => {

    const [timeArray, setTimeArray] = useState([ ])
    const [average, setAverage] = useState(0)

    const collectionName = "globalVariables";
    const documentId = 'aplmxmAVlIdS8vAVFOut'; 
    const fieldToUpdate = "averageServiceTime";

    const documentRef = doc(db, collectionName, documentId);


    var averages = []

    useEffect(() => {
        async function calculateTimeDifference() {
        
            const q = query(
                collection(db, 'queue'),
                orderBy('timeCompleted')
                );
        
                const snapshot = await getDocs(q);
            
                snapshot.forEach(doc => {
                    const timeServiceStart = doc.data().timeServiceStart.toDate();
                    const timeCompleted = doc.data().timeCompleted.toDate();
                    
                    const difference =  timeCompleted.getTime() - timeServiceStart.getTime();
                    //console.log(`Time difference for document ${doc.id}: ${difference} milliseconds`);

                    //setTimeArray(prevTimeArray => [...prevTimeArray, difference]);
                    averages.push(difference)
                    //console.log(averages)
                    const averageCalculated = averages.reduce((total, num) => total + num, 0) / averages.length;
                    //console.log(averageCalculated)
                    const minutes = Math.ceil(averageCalculated / 60000);
                    const minutesWithDecimals = minutes.toFixed(2);
                    setAverage(parseFloat(minutes))
                    //console.log(minutes)
                    //console.log(parseFloat(minutes))
                    //console.log(parseFloat(minutesWithDecimals))

                    const updateData = {
                        [fieldToUpdate]: parseFloat(minutes),
                    };
                    
                    updateDoc(documentRef, updateData)
                    .then(() => {
                        //console.log("Success");
                    })
                    .catch((error) => {
                        console.error("Error updating document:", error);
                    });

                });

                setTimeArray([])
        }
        calculateTimeDifference()

    }, []); 
    
    return average;
}

