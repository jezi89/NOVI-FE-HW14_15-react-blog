import {useContext} from 'react';
import {ReadSpeedContext} from '../contexts/ReadSpeedContext.jsx';

export const useReadSpeed = () => useContext(ReadSpeedContext);
