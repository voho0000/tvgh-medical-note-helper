import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabComponentProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({ activeTab, setActiveTab }) => {
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setActiveTab(newValue);
    };

    return (
        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            style={{ minHeight: '40px', height: '40px' }}
        >
            <Tab value="asr" label="ASR" style={{ minHeight: '40px', height: '40px' }} />
            <Tab value="getdata" label="Get Data" style={{ minHeight: '40px', height: '40px' }} />
        </Tabs>
    );
};

export default TabComponent;
