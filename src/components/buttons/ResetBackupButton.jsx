import { resetToInitialBackup } from "../../services/backupService";
import styles from "./Button.module.css";

function ResetBackupButton({ onBackupReset }) {
    const handleReset = () => {
        const backup = resetToInitialBackup();
        
        if (!backup) {
            alert("Geen initiële backup gevonden om naar terug te zetten");
            return;
        }
        
        if (onBackupReset) {
            onBackupReset(backup);
        }

        alert(`Backup succesvol gereset naar initiële versie van: ${new Date(backup.timestamp).toLocaleString()}`);
    };

    return (
        <button
            onClick={handleReset}
            className={styles.resetButton}
        >
            Reset naar initiële backup
        </button>
    );
}

export default ResetBackupButton;
