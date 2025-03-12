// Met contexts kunnen we state globaal opslaan
import {createContext, useEffect, useState} from 'react';
import readingSpeeds from '../constants/readingSpeeds.js';

// Lege context hook wordt hier gecreëerd.
export const ReadSpeedContext = createContext(null);

export function ReadSpeedProvider({ children }) {
    const [readSpeed, setReadSpeed] = useState(() => {
        const savedSpeed = localStorage.getItem('readSpeed');
        return savedSpeed || "medium";
    });

    // Als we willen dat de gebruikers read speed op kunnen slaan, hebben we bijvoorbeeld localStorage nodig.
    // Deze wordt geset met useEffect hook en hier boven opgehaald.
    useEffect(() => {
        localStorage.setItem('readSpeed', String(readSpeed));
    }, [readSpeed]);

/*    Op deze manier kunnen we de read speed state, the setter functie en de reading speed conversie (gedefinieerd in readingSpeeds.js)
    beschikbaar maken voor alle children die gerenderd worden als geneste componenten van ReadSpeedProvider.*/

    return (
        <ReadSpeedContext.Provider value={{ readSpeed, setReadSpeed, readSpeedValues: readingSpeeds }}>
            {children}
        </ReadSpeedContext.Provider>
    );
}

