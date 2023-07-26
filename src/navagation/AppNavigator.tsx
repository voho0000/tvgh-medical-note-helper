// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { auth } from '../../firebaseConfig'; // Import your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';


const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            if (user) {
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <Router>
            <Routes>
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/Detail/:patientId" element={<DetailScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
            </Routes>
        </Router>
    );
};

export default AppNavigator;
