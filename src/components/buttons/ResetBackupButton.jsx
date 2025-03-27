import React from 'react';
import styles from "./Button.module.css";

function ResetBackupButton({ onBackupReset, buttonText, isLoading, className }) {
    const handleReset = () => {
        // Bevestiging vragen voordat we resetten
        if (window.confirm("Weet je zeker dat je alles wilt terugzetten naar de oorspronkelijke staat zoals bij de eerste start van de applicatie?")) {
            if (onBackupReset) {
                onBackupReset();
            }
        }
    };

    return (
        <button
            onClick={handleReset}
            className={`${styles.resetButton} ${isLoading ? styles.loading : ''} ${className || ''}`}
            disabled={isLoading}
        >
            {isLoading ? "Bezig met terugzetten..." : (buttonText || "Terugzetten naar oorspronkelijke staat")}
        </button>
    );
}

export default ResetBackupButton;
