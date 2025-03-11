// src/contexts/ReadSpeedContext.jsx
import {createContext, useContext, useEffect, useState} from 'react';
import readingSpeeds from '../constants/readingSpeeds.js';

const ReadSpeedContext = createContext();

export function ReadSpeedProvider({ children }) {
    const [readSpeed, setReadSpeed] = useState(() => {
        const savedSpeed = localStorage.getItem('readSpeed');
        return savedSpeed || "medium";
    });

    useEffect(() => {
        localStorage.setItem('readSpeed', readSpeed);
    }, [readSpeed]);

    return (
        <ReadSpeedContext.Provider value={{ readSpeed, setReadSpeed, readSpeedValues: readingSpeeds }}>
            {children}
        </ReadSpeedContext.Provider>
    );
}

export const useReadSpeed = () => useContext(ReadSpeedContext);
