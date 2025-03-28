import React, { useState } from 'react';
import styles from './Button.module.css';

function ClearLocalStorageButton({ onClear, disabled }) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleClick = () => {
        if (disabled) return;
        
        if (!isConfirming) {
            setIsConfirming(true);
            return;
        }

        // Als we in confirm mode zijn en er wordt nogmaals geklikt
        if (onClear) {
            onClear();
        }
        
        setIsConfirming(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation(); // Voorkom dat de klik doorgaat naar de parent button
        setIsConfirming(false);
    };

    return (
        <button
            onClick={handleClick}
            className={`${styles.clearStorageButton} ${isConfirming ? styles.deleteConfirm : ''} ${disabled ? styles.disabled : ''}`}
            title={isConfirming ? "Klik nogmaals om te bevestigen" : "Wis lokale opslag"}
            disabled={disabled}
        >
            {isConfirming ? (
                <>
                    Bevestig wissen
                    <span
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        ✕
                    </span>
                </>
            ) : (
                <>
                    <svg className={styles.trashIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M5 2C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V8L15 2H5ZM14 9H19.5L14 3.5V9ZM8 12H16V14H8V12ZM8 16H16V18H8V16Z"></path>
                    </svg>
                    Wis lokale data
                </>
            )}
            {disabled && <span className={styles.disabledOverlay}></span>}
        </button>
    );
}

export default ClearLocalStorageButton;
