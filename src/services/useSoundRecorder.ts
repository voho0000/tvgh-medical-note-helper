import { useEffect, useState } from 'react';

const useSoundRecorder = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string>('');

  const handleDataAvailable = (e: BlobEvent) => {
    if (e.data.size > 0) {
      setChunks((prev) => [...prev, e.data]);
    }
  };

  const startRecording = () => {
    console.log("I am in start recording")
    chrome.runtime.sendMessage({ action: "startRecording" }, (response) => {
      console.log("I am sending to background script")
      if (response.error) {
        console.error(response.error);
      } else {
        // Handle successful start of recording
        console.log('Recording started');
      }
    });
  };
  
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    if (!recording && chunks.length) {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioBlobUrl(url);
      setChunks([]);
    }
  }, [recording, chunks]);

  return {
    startRecording,
    stopRecording,
    recording,
    audioBlobUrl,
  };
};

export default useSoundRecorder;
