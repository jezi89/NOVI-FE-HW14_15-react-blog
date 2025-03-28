import React, { useState } from 'react';
import { createManualBackup } from "../../services/backupService";
import { restoreDatabaseFromBackup } from "../../services/databaseResetService";
import styles from "./Button.module.css";

function BackupButton({ posts, onBackupCreated }) {
    const [isNaming, setIsNaming] = useState(false);
    const [backupName, setBackupName] = useState("");
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    
    const handleBackup = () => {
        if (!posts || posts.length === 0) {
            alert("Geen posts om een backup van te maken");
            return;
        }
        
        // Reset eventuele eerdere fouten
        setError("");
        
        // Vraag gebruiker om een naam voor de backup
        setIsNaming(true);
    };
    
    const handleCreateBackup = async () => {
        // Validatie: minimaal 3 tekens voor een backupnaam
        if (backupName.trim() && backupName.trim().length < 3) {
            setError("Backup naam moet minimaal 3 tekens bevatten");
            return;
        }
        
        setIsCreating(true);
        
        try {
            // Genereer een standaard naam als de gebruiker niets invult
            const name = backupName.trim() || `Backup ${new Date().toLocaleString()}`;
            
            // Maak de backup met de naam
            const backup = createManualBackup(posts, name);
            
            // Synchroniseer ook de database met de huidige staat
            await restoreDatabaseFromBackup(backup);
            
            if (onBackupCreated) {
                onBackupCreated(backup);
            }
            
            alert(`Backup "${name}" succesvol gemaakt op: ${new Date(backup.timestamp).toLocaleString()}`);
            
            // Reset de staat
            setIsNaming(false);
            setBackupName("");
            setError("");
        } catch (error) {
            console.error("Fout bij het maken van backup:", error);
            setError("Er is een fout opgetreden bij het maken van de backup");
        } finally {
            setIsCreating(false);
        }
    };
    
    const handleCancel = (e) => {
        e.stopPropagation(); // Voorkom dat de klik doorgaat naar de parent
        setIsNaming(false);
        setBackupName("");
        setError("");
    };

    return isNaming ? (
        <div className={styles.backupNameContainer}>
            <div className={styles.backupNameInputWrapper}>
                <input
                    type="text"
                    className={`${styles.backupNameInput} ${error ? styles.inputError : ''}`}
                    placeholder="Geef deze backup een naam..."
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                    autoFocus
                    disabled={isCreating}
                />
                {error && <p className={styles.errorText}>{error}</p>}
            </div>
            <button
                onClick={handleCreateBackup}
                className={`${styles.backupNameSaveButton} ${isCreating ? styles.loading : ''}`}
                disabled={isCreating}
            >
                {isCreating ? "Bezig..." : "Opslaan"}
            </button>
            <button
                onClick={handleCancel}
                className={styles.backupNameCancelButton}
                disabled={isCreating}
            >
                Annuleren
            </button>
        </div>
    ) : (
        <button
            onClick={handleBackup}
            className={styles.backupButton}
        >
            Maak Backup
        </button>
    );
}

export default BackupButton;
