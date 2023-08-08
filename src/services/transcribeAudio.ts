// transcribeAudio.ts
import { toast } from 'react-hot-toast';

export const transcribeAudio = async (audioBlob: Blob) => {
    const data = new FormData();
    const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
    console.log(file)
    data.append('file', file);

    data.append('model', 'whisper-1');
    //   data.append('prompt', 'The following is about medical summary of a patient. Answer in traditional chinese and english')

    try {
        console.log(import.meta.env.VITE_OPENAI_API_KEY)
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
        });
        `Response status: ${response.status}, text: ${response.statusText}`
        console.log(response)
        const jsonResponse = await response.json();
        if (jsonResponse) {
            return jsonResponse['text']; // Assuming 'transcript' is a field in the response
        } else {
            console.error('Failed to transcribe audio:', jsonResponse);
            throw new Error('Failed to transcribe audio');
        }
    } catch (error) {
        console.error('Error during transcription:', error);
        toast.error(`Error during transcription:${error}`);
        throw new Error('Error occurred while transcribing');
    }
};
