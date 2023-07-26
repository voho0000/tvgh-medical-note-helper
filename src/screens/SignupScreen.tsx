import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/auth';
import toast from 'react-hot-toast';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const signupHandler = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const user = await createUser(email, password);
            if (user) {
                toast.success('Successfully created account');
                navigate('/login');
            }
        } catch (error: any) {
            alert('Signup failed' + error.message);
        }
    };

    return (
        <div>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            <input placeholder="Comfirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
            <button onClick={signupHandler}>Sign Up</button>
        </div>
    );
};

export default SignupScreen;
