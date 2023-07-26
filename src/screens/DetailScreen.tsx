// DetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { callGPTAPI } from '../services/callGPTAPI';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { transcribeAudio } from '../services/transcribeAudio';
import { uploadDataToFirestore, fetchSinglePatientRecord } from '../services/FirestoreService';
import { getAuth } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { IconButton as MuiIconButton, TextField, Button, Box, Container, Typography } from '@mui/material';
import { Pause as PauseIcon, PlayArrow as PlayArrowIcon, Stop as StopIcon, Mic as MicIcon } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';


const DetailScreen: React.FC = () => {
    const [patientInfo, setPatientInfo] = useState<string>("");
    const [asrResponse, setAsrResponse] = useState<string>("");
    const [gptResponse, setGptResponse] = useState<string>(""); // Stores the GPT response
    const [isLoading, setIsLoading] = useState<boolean>(false); // Handles loading state
    const [isLoadingData, setIsLoadingData] = useState(true); // Add a new loading state
    const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
    const userId = auth.currentUser?.uid

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

    const msToTime = (duration: number) => {
        let seconds: number = Math.floor((duration) % 60)
        let minutes: number = Math.floor((duration / 60) % 60)

        let minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
        let secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();

        return minutesString + ":" + secondsString;
    }


    const [formattedTime, setFormattedTime] = useState(msToTime(recordingTime));


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
    const handleNewTab = async () => {
        const user = auth.currentUser;
        if (user) {
            const newTabUrl = `recording.html?patientId=${patientId}&userId=${userId}`;
            chrome.tabs.create({ url: newTabUrl });
        }
    };


    const fetchData = useCallback(async () => { // Wrap fetchData in useCallback
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
    }, [patientId, userId]); // Add dependencies

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Pass fetchData as a dependency

    useEffect(() => {
        if (!isLoadingData) { // Only save to Firestore if not loading data
            if (patientId && userId) {
                uploadDataToFirestore(userId, patientId, patientInfo, asrResponse, gptResponse)
            }
        }
    }, [patientInfo, asrResponse, gptResponse, patientId, isLoadingData]); // Add isLoadingData to dependencies

    useEffect(() => {
        if (recordingBlob) {
            setIsTranscriptLoading(true);
            transcribeAudio(recordingBlob)
                .then(transcript => {
                    // Do something with the transcript...
                    setAsrResponse(transcript);            
                    setIsTranscriptLoading(false);
                })
                .catch(error => {
                    console.error('Failed to transcribe audio:', error);
                });
        }
    }, [recordingBlob]);

    useEffect(() => {
        const newFormattedTime = msToTime(recordingTime);
        console.log(newFormattedTime);  // Add this line
        setFormattedTime(newFormattedTime);
    }, [recordingTime]);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#6554AF',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <MuiIconButton onClick={handleBack}>
                        <ArrowBackIosIcon />
                    </MuiIconButton>
                    <Typography variant="h6" component="div">
                        Patient ID: {patientId}
                    </Typography>
                    <div></div>
                    <IconButton onClick={fetchData} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    multiline
                    label="Patient Info"
                    rows={2}
                    variant="outlined"
                    placeholder="Enter patient info here"
                    onChange={e => setPatientInfo(e.target.value)}
                    value={patientInfo}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* <Button variant="outlined" color="primary" onClick={handleNewTab}>Go to Recording</Button> */}
                    {isRecording ? (
                        <>
                            <MuiIconButton onClick={togglePauseResume}>
                                {isPaused ? <PlayArrowIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
                            </MuiIconButton>
                            <MuiIconButton onClick={stopRecording}>
                                <StopIcon fontSize="large" />
                            </MuiIconButton>
                        </>
                    ) : (
                        <MuiIconButton onClick={startRecording} >
                            <MicIcon  fontSize="large" />
                        </MuiIconButton>
                    )}
                    {isTranscriptLoading && <CircularProgress size={24} style={{ marginRight: 30 }} />}

                    <Typography variant="h6" component="div" ml={2}>
                        {formattedTime}
                    </Typography>
                </Box>

                <Box mt={1}>
                    <TextField
                        fullWidth
                        multiline
                        label="ASR result"
                        rows={4}
                        variant="outlined"
                        onChange={e => setAsrResponse(e.target.value)}
                        value={asrResponse}
                        placeholder="Start recording to get ASR result"
                    />
                </Box>

                <Box mt={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendToGPT}
                        disabled={isLoading}
                        fullWidth
                        style={{ marginTop: 5, marginBottom: 10 }}
                    >
                        Send to GPT
                    </Button>
                </Box>
                <Box mt={1} mb={1}>
                    <TextField
                        fullWidth
                        multiline
                        label="GPT result"
                        rows={6}
                        variant="outlined"
                        value={gptResponse}
                        onChange={e => setGptResponse(e.target.value)}
                        placeholder="GPT response"
                    />
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default DetailScreen;

