import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPatientRecords, addPatientRecord, deletePatientRecord } from '../services/FirestoreService';
import { logout } from '../services/auth';
import { Button, Box, IconButton, List, ListItem, Typography, Grid, ListItemButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const HomeScreen = () => {
    const [items, setItems] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatientRecords().then(response => {
            if (response) {
                setItems(response); // Assuming response is an array of items
            }
        }).catch(error => {
            console.log('Error fetching patient records:', error);
        });
    }, []);

    const handleAddItem = () => {
        const patientId = prompt('Enter patient id');
        if (patientId) {
            const newItems = [...items, patientId];
            setItems(newItems);
            addPatientRecord(patientId);
        }
    };

    const handlePressItem = (patientId: string) => {
        navigate(`/detail/${patientId}`);
    };

    const deleteItem = async (index: number) => {
        const patientId = items[index];
        try {
            // Delete the record from Firestore
            await deletePatientRecord(patientId);
            const newItems = items.filter((_, itemIndex) => itemIndex !== index);
            setItems(newItems);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#6554AF',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Button variant="contained" color="primary" onClick={handleAddItem} fullWidth style={{ marginTop: '10px' }}>
                    Add a Patient
                </Button>
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <List>
                        {items.map((item, index) => (
                            <ListItem divider key={index} style={{ paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={10}>
                                        <ListItemButton onClick={() => handlePressItem(item)}>
                                            <ListItemText primary={item} primaryTypographyProps={{fontSize: '20px'}} style={{ lineHeight: 1, margin: 0 }} />
                                        </ListItemButton>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={() => deleteItem(index)}><DeleteIcon /></IconButton>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box position="sticky" bottom={0} width="100%" bgcolor="background.default">
                    <Button variant="outlined" color="primary" onClick={handleLogout} fullWidth style={{ marginBottom: '10px' }}>
                        Log Out
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};


export default HomeScreen;
