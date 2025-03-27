import React from 'react';
import styles from "./Button.module.css";

function ResetBackupButton({ onBackupReset, buttonText, isLoading }) {
    const handleReset = () => {
        // Bevestiging vragen voordat we resetten
        if (window.confirm("Weet je zeker dat je alle posts wilt terugzetten naar de oorspronkelijke database-waardes?")) {
            if (onBackupReset) {
                onBackupReset();
            }
        }
    };

    return (
        <button
            onClick={handleReset}
            className={`${styles.resetButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
        >
            {isLoading ? "Bezig met resetten..." : (buttonText || "Reset naar initiële backup")}
        </button>
    );
}

export default ResetBackupButton;
