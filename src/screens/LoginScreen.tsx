import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const user = await login(email, password);
            if (user) {
                navigate('/home');
            }
        } catch (error: any) {
            alert('Authentication failed' + error.message);
        }
    };

    const switchToSignup = () => {
        navigate('/signup');
    };

    return (
        <div>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
            <button onClick={handleLogin}>Log In</button>
            <button onClick={switchToSignup}>Don't have an account? Sign up!</button>
        </div>
    );
};

export default LoginScreen;
