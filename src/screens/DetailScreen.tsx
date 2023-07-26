// DetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { callGPTAPI } from '../services/callGPTAPI';
import { useRecording } from '../services/useRecording';
import { uploadDataToFirestore, fetchSinglePatientRecord } from '../services/FirestoreService';
import { auth } from '../../firebaseConfig';

const DetailScreen: React.FC = () => {
    const [patientInfo, setPatientInfo] = useState<string>("");
    const [asrResponse, setAsrResponse] = useState<string>("");
    const [gptResponse, setGptResponse] = useState<string>(""); // Stores the GPT response
    const [isLoading, setIsLoading] = useState<boolean>(false); // Handles loading state
    const [isLoadingData, setIsLoadingData] = useState(true); // Add a new loading state
    const userId =auth.currentUser?.uid

    const {
        isRecording,
        isPaused,
        counter,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
    } = useRecording(setAsrResponse);


    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();

    const sendToGPT = async () => {
        setIsLoading(true);
        try {
            const response = await callGPTAPI(asrResponse);
            setGptResponse(response);
        } catch (error) {
            console.error("Failed to get response from GPT:", error);
            alert("Error, Failed to get response from GPT. Please try again.");
        }
        setIsLoading(false);
    };

    const handleBack = () => {
        // Using navigate with '..' will take you up one level in the URL hierarchy
        navigate(-1); // you can use -1 to represent going back
    };

    // const handleNewTab = () => {
    //     // create a new tab with the recording screen
    //     chrome.tabs.create({url: `recording.html?patientId=${patientId}`});
    // };
    const handleNewTab = () => {
        const newTabUrl = `recording.html?patientId=${patientId}&userId=${userId}`;
        chrome.tabs.create({ url: newTabUrl });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingData(true); // Start loading
                if (patientId && userId) {
                    const patientRecord = await fetchSinglePatientRecord(patientId, userId);
                    if (patientRecord) {
                        setAsrResponse(patientRecord.asrResponse);
                        setGptResponse(patientRecord.gptResponse);
                        setPatientInfo(patientRecord.patientInfo);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data from Firestore:", error);
            } finally {
                setIsLoadingData(false); // Finish loading
            }
        };

        fetchData();
    }, [patientId]);

    useEffect(() => {
        if (!isLoadingData) { // Only save to Firestore if not loading data
            if (patientId && userId) {
                uploadDataToFirestore(userId, patientId, patientInfo, asrResponse, gptResponse)
            }
        }
    }, [patientInfo, asrResponse, gptResponse, patientId, isLoadingData]); // Add isLoadingData to dependencies

    return (
        <div>
            <button onClick={handleBack}>Back</button>
            <textarea
                placeholder="Enter patient info here"
                onChange={e => setPatientInfo(e.target.value)}
                value={patientInfo}
            />
            <div>
                <button onClick={handleNewTab}>go to recording</button>
            </div>
            <textarea
                onChange={e => setAsrResponse(e.target.value)}
                value={asrResponse}
                placeholder="Start recording to get ASR result"
            />
            <button onClick={sendToGPT} disabled={isLoading}>Send to GPT</button>
            <textarea
                value={gptResponse}
                onChange={e => setGptResponse(e.target.value)}
                placeholder="GPT response"
            />
            {/* <button onClick={() => sendToServer(gptResponse)}>Send to server</button> */}
        </div>
    );
};


export default DetailScreen;
