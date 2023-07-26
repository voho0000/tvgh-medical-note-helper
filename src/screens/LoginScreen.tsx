import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { Button, TextField, Box, Typography, Link } from '@mui/material';

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
                Login
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
            <Button color="primary" variant="contained" onClick={handleLogin} fullWidth>
                Log In
            </Button>
            <Box mt={2}>
                <Link href="#" onClick={switchToSignup}>
                    Don't have an account? Sign up!
                </Link>
            </Box>
        </Box>
    );
};

export default LoginScreen;
