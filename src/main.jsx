import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import {BrowserRouter} from "react-router-dom";
import {ReadSpeedProvider} from './contexts/ReadSpeedContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
        <ReadSpeedProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ReadSpeedProvider>
    </React.StrictMode>
)
