// RecordingScreen.tsx
import React, { useState, useEffect } from 'react';
import { callGPTAPI } from '../services/callGPTAPI';
import { useRecording } from '../services/useRecording';
import { uploadDataToFirestore, fetchSinglePatientRecord } from '../services/FirestoreService';
import useSoundRecorder from '../services/useSoundRecorder';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { transcribeAudio } from '../services/transcribeAudio';
import { auth } from '../../firebaseConfig';
import { signInWithCustomToken } from "firebase/auth";
import { TextField, Button, Box, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const RecordingScreen: React.FC = () => {
    const [patientInfo, setPatientInfo] = useState<string>("");
    const [asrResponse, setAsrResponse] = useState<string>("");
    const [gptResponse, setGptResponse] = useState<string>(""); // Stores the GPT response
    const [isLoading, setIsLoading] = useState<boolean>(false); // Handles loading state
    const [isLoadingData, setIsLoadingData] = useState(true); // Add a new loading state

    // const {
    //     isRecording,
    //     isPaused,
    //     counter,
    //     startRecording,
    //     stopRecording,
    //     pauseRecording,
    //     resumeRecording,
    // } = useRecording(setAsrResponse);

    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
        mediaRecorder,
    } = useAudioRecorder();


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
                // if (patientId && userId) {
                //     const patientRecord = await fetchSinglePatientRecord(patientId, userId);
                //     if (patientRecord) {
                //         setAsrResponse(patientRecord.asrResponse);
                //         setGptResponse(patientRecord.gptResponse);
                //         setPatientInfo(patientRecord.patientInfo);
                //     }
                // }
                if (patientId ) {
                    const patientRecord = await fetchSinglePatientRecord(patientId);
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
            // if (patientId && userId) {
            //     uploadDataToFirestore(userId, patientId, patientInfo, asrResponse, gptResponse)
            // }
            if (patientId) {
                uploadDataToFirestore(patientId, patientInfo, asrResponse, gptResponse)
            }
        }
    }, [patientInfo, asrResponse, gptResponse, patientId, isLoadingData]); // Add isLoadingData to dependencies

    useEffect(() => {
        if (recordingBlob) {
            transcribeAudio(recordingBlob)
                .then(transcript => {
                    // Do something with the transcript...
                    setAsrResponse(transcript);
                })
                .catch(error => {
                    console.error('Failed to transcribe audio:', error);
                });
        }
    }, [recordingBlob]);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#6554AF',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={e => setPatientInfo(e.target.value)}
                    value={patientInfo}
                    placeholder="Enter patient info here"
                    sx={{ mt: 2 }}
                />
                <Box sx={{ mt: 2 }}>
                    {isRecording ? (
                        <>
                            <IconButton onClick={togglePauseResume}>
                                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                            </IconButton>
                            <IconButton onClick={stopRecording}>
                                <StopIcon />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton onClick={startRecording}>
                            <MicIcon />
                        </IconButton>
                    )}
                </Box>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={e => setAsrResponse(e.target.value)}
                    value={asrResponse}
                    placeholder="Start recording to get ASR result"
                    sx={{ mt: 2 }}
                />
                <Button variant="outlined" color="primary" onClick={sendToGPT} disabled={isLoading} fullWidth sx={{ mt: 2 }}>
                    Send to GPT
                </Button>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={gptResponse}
                    onChange={e => setGptResponse(e.target.value)}
                    placeholder="GPT response"
                    sx={{ mt: 2 }}
                />
            </Box>
        </ThemeProvider>
    );
};


export default RecordingScreen;
