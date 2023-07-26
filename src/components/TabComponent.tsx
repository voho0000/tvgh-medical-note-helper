// TabComponent.tsx
import React from 'react';

interface TabComponentProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div>
            <button onClick={() => setActiveTab('asr')}>ASR</button>
            <button onClick={() => setActiveTab('getdata')}>Get Data</button>
        </div>
    );
};

export default TabComponent;
