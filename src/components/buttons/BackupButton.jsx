import { createManualBackup } from "../../services/backupService";
import styles from "./Button.module.css";

function BackupButton({ posts, onBackupCreated }) {
    const handleBackup = () => {
        if (!posts || posts.length === 0) {
            alert("Geen posts om een backup van te maken");
            return;
        }

        const backup = createManualBackup(posts);
        if (onBackupCreated) {
            onBackupCreated(backup);
        }

        alert(`Backup succesvol gemaakt op: ${new Date(backup.timestamp).toLocaleString()}`);
    };

    return (
        <button
            onClick={handleBackup}
            className={styles.backupButton}
        >
            Maak Backup
        </button>
    );
}

export default BackupButton;
