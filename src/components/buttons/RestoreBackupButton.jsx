import { getLatestBackup } from "../../services/backupService";
import styles from "./Button.module.css";

function RestoreBackupButton({ onRestore }) {
    const handleRestore = () => {
        const backup = getLatestBackup();

        if (!backup || !backup.data) {
            alert("Geen backup beschikbaar om te herstellen");
            return;
        }
        
        if (onRestore) {
            onRestore(backup.data);
        }

        alert(`Backup van: ${new Date(backup.timestamp).toLocaleString()} hersteld`);
    };

    return (
        <button
            onClick={handleRestore}
            className={styles.restoreButton}
        >
            Herstel van Backup
        </button>
    );
}

export default RestoreBackupButton;
