// useRecording.ts
import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { transcribeAudio } from './transcribeAudio';

export const useRecording = (setAsrResponse: React.Dispatch<React.SetStateAction<string>>) => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    // const [chunks, setChunks] = useState<Blob[]>([]);
    let audioChunks: BlobPart[] = [];  // Define it here


    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isRecording && !isPaused) {
            interval = setInterval(() => {
                setCounter(prevCounter => prevCounter + 1);
            }, 1000);
        } else {
            clearInterval(interval!);
        }
        return () => clearInterval(interval!);
    }, [isRecording, isPaused]);

    const startRecording = async () => {
        try {
            chrome.tabCapture.capture({
                audio: true,
                video: false
            }, function (stream) {
                if (stream) {
                    console.log('Captured stream:', stream);
                    console.log('Stream tracks:', stream.getTracks());
                    const newMediaRecorder = new MediaRecorder(stream);
                    newMediaRecorder.ondataavailable = (e) => {
                        console.log('Data available:', e.data);
                        audioChunks.push(e.data);
                    };
                    newMediaRecorder.start();

                    setMediaRecorder(newMediaRecorder);
                    setIsRecording(true);
                } else {
                    console.error('Unable to capture the tab. Please check permissions.');
                    toast.error('Unable to capture the tab. Please check permissions.');
                }
            });
        } catch (error) {
            console.error('Failed to start recording:', error);
            toast.error('Failed to start recording. Please try again.');
        }
    };




    const pauseRecording = async () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            setIsPaused(true);
        }
    };

    const resumeRecording = async () => {
        if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            setIsPaused(false);
        }
    };

    const stopRecording = async () => {
        try {
            if (mediaRecorder) {
                mediaRecorder.onerror = (event) => {
                    console.log('mediaRecorder error:', event);
                };
                mediaRecorder.onstop = async () => {
                    const blob = new Blob(audioChunks, { 'type': 'audio/webm' });
                    console.log("Blob in stop recording: ", blob);
                    try {
                        const transcript = await transcribeAudio(blob);
                        // handle transcript
                    } catch (error) {
                        console.error("Transcription failed:", error);
                    }
                    // Clear the chunks array after creating the blob.
                    // setChunks([]);
                    setMediaRecorder(null);
                    setIsRecording(false);
                    setIsPaused(false);
                    setCounter(0);
                    audioChunks = []; // Reset audioChunks for next recording
                };
                mediaRecorder.stop();
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
            toast.error('Failed to stop recording. Please try again.');
        }
    };



    return {
        isRecording,
        isPaused,
        counter,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
    };
};
