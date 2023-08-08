import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/auth';
import { Button, TextField, Box, Typography } from '@mui/material';
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
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default"
            padding={2}
        >
            <Typography variant="h4" mb={2}>
                Sign Up
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button color="primary" variant="contained" onClick={signupHandler} fullWidth>
                Sign Up
            </Button>
        </Box>
    );
};

export default SignupScreen;
