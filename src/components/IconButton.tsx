import React from 'react';
import { FaMicrophone, FaPlay, FaStop, FaPause } from 'react-icons/fa';

interface IconButtonProps {
  onPress: () => void;
  iconName: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onPress, iconName }) => {
  let IconComponent;

  switch(iconName) {
    case 'microphone':
      IconComponent = <FaMicrophone size={20} color="white" />;
      break;
    case 'play':
      IconComponent = <FaPlay size={20} color="white" />;
      break;
    case 'stop':
      IconComponent = <FaStop size={20} color="white" />;
      break;
    case 'pause':
      IconComponent = <FaPause size={20} color="white" />;
      break;
    default:
      IconComponent = <FaMicrophone size={20} color="white" />;
  }

  return (
    <button onClick={onPress} style={{
      backgroundColor: 'red',
      borderRadius: 20,
      width: 30,
      height: 30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
    }}>
      {IconComponent}
    </button>
  );
};

export default IconButton;
