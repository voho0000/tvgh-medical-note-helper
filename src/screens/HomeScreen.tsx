import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPatientRecords, addPatientRecord, deletePatientRecord } from '../services/FirestoreService';
import { logout } from '../services/auth';

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

    return (
        <div>
            <button onClick={handleAddItem}>Add a Patient</button>
            {items.map((item, index) => (
                <div key={index}>
                    <span onClick={() => handlePressItem(item)}>{item}</span>
                    <button onClick={() => deleteItem(index)}>Delete</button>
                </div>
            ))}
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default HomeScreen;
