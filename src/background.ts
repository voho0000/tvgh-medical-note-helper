chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('I am background script. I received a message:', request)
    if (request.action === 'startRecording') {
      // Call the function to start recording
      console.log('Received startRecording message');
      startRecording();
      return true; // Indicates that the response will be sent asynchronously
    }
  });
  
  const startRecording = () => {
    chrome.desktopCapture.chooseDesktopMedia(
      ['audio'], // Specify that we want to capture audio
      (streamId, options) => {
        // This callback function is called when the user has selected a source
        if (streamId) {
          navigator.mediaDevices.getUserMedia({
            audio: true
          })
            .then((stream) => {
              // Now we have a stream, we can start recording
              const newMediaRecorder = new MediaRecorder(stream);
              newMediaRecorder.ondataavailable = handleDataAvailable;
              newMediaRecorder.start();
            })
            .catch((err) => {
              console.error('Error occurred when trying to get stream:', err);
            });
        }
      },
    );
  };
  
  const handleDataAvailable = (event: any) => {
    // Handle the data from the audio stream here
    // This is an example, you'll want to do something with the data
    if (event.data.size > 0) {
      console.log(event.data);
    }
  };
  