import { useState } from 'react';
import styles from './Button.module.css';

function DeleteButton({ postId, onDelete, title, visible }) {
    const [confirmMode, setConfirmMode] = useState(false);

    const handleClick = () => {
        if (!confirmMode) {
            setConfirmMode(true);
            return;
        }

        // Als we al in confirm mode zijn en er wordt nog een keer geklikt
        onDelete(postId);
        setConfirmMode(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation(); // Voorkom dat de klik doorgaat naar de parent
        setConfirmMode(false);
    };

    return (
        <button
            onClick={handleClick}
            className={`${styles.deleteButton} ${confirmMode ? styles.deleteConfirm : ''}`}
            title={confirmMode ? "Klik nogmaals om te bevestigen" : `Verwijder "${title}"`}
            style={{ opacity: visible ? 1 : 0 }}
            aria-label="Verwijder post"
        >
            {confirmMode ? (
                <>
                    Bevestig
                    <span
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        ✕
                    </span>
                </>
            ) : (
                <svg className={styles.trashIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            )}
        </button>
    );
}

export default DeleteButton;
