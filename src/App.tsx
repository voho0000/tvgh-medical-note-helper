// App.tsx
import React, { useState } from 'react';
import GetData from './components/GetData'; // Add this line
import './App.css'
import TabComponent from './components/TabComponent'; // Add this line
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Add this line
import AsrScreen from './screens/AsrScreen';
import GetDataScreen from './screens/GetDataScreen';
import RecordingScreen from './screens/RecordingScreen';



function App() {
  const [activeTab, setActiveTab] = useState('asr');
  const isRecordingPage = window.location.pathname.includes('recording.html');

  return isRecordingPage ? <RecordingScreen /> : (
    <div className="App">
    <Router>
    <TabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      <Routes>
        {activeTab === 'asr' && <Route path="/*" element={<AsrScreen />} />}
        {activeTab === 'getdata' && <Route path="/*" element={<GetDataScreen />} />}
      </Routes>
    </Router>
    <Toaster />
  </div>
  );
}

export default App
