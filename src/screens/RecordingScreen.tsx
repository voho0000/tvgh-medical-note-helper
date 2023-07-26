// RecordingScreen.tsx
import React, { useState, useEffect } from 'react';
import { callGPTAPI } from '../services/callGPTAPI';
import { useRecording } from '../services/useRecording';
import IconButton from '../components/IconButton';
import { uploadDataToFirestore, fetchSinglePatientRecord } from '../services/FirestoreService';
import useSoundRecorder from '../services/useSoundRecorder';

const RecordingScreen: React.FC = () => {
    const [patientInfo, setPatientInfo] = useState<string>("");
    const [asrResponse, setAsrResponse] = useState<string>("");
    const [gptResponse, setGptResponse] = useState<string>(""); // Stores the GPT response
    const [isLoading, setIsLoading] = useState<boolean>(false); // Handles loading state
    const [isLoadingData, setIsLoadingData] = useState(true); // Add a new loading state

    const {
        isRecording,
        isPaused,
        counter,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
    } = useRecording(setAsrResponse);


    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patientId');
    const userId = urlParams.get('userId');

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

    // const handleBack = () => {
    //     // Using navigate with '..' will take you up one level in the URL hierarchy
    //     navigate(-1); // you can use -1 to represent going back
    // };

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
            {/* <button onClick={handleBack}>Back</button> */}
            <textarea
                placeholder="Enter patient info here"
                onChange={e => setPatientInfo(e.target.value)}
                value={patientInfo}
            />
            <div>
                {isRecording ? (
                    <>
                        <IconButton
                            onPress={isPaused ? resumeRecording : pauseRecording}
                            iconName={isPaused ? "play" : "pause"}
                        />
                        <IconButton
                            onPress={stopRecording}
                            iconName="stop"
                        />                    </>
                ) : (
                    <IconButton
                        onPress={startRecording}
                        iconName="microphone"
                    />
                )}
                <p>Record Time: {counter} s</p>
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


export default RecordingScreen;
