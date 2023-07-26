// import React from 'react';

// const AsrScreen: React.FC = () => {
//   return (
//     <div>
//       <h1>ASR Screen</h1>
//       <p>This is the ASR screen.</p>
//     </div>
//   );
// };

// export default AsrScreen;

// AsrScreen.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { auth } from '../../firebaseConfig'; // Import your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AsrScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            if (user) {
                setIsLogged(true);
                navigate('home')
            } else {
                setIsLogged(false);
                navigate('login')
            }
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return null;
    }

    return (
            <Routes>
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/detail/:patientId" element={<DetailScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
            </Routes>
    );
};

export default AsrScreen;
