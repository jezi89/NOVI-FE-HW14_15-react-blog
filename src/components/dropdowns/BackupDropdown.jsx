import React, { useState, useEffect, useRef } from 'react';
import { getAllBackups, restoreBackup, getLatestBackup } from '../../services/backupService.js';
import { restoreDatabaseFromBackup } from '../../services/databaseResetService.js';
import styles from './BackupDropdown.module.css';
import buttonStyles from '../buttons/Button.module.css';

function BackupDropdown({ onRestore, lastBackupCreated }) {
    const [isOpen, setIsOpen] = useState(false);
    const [backups, setBackups] = useState([]);
    const [currentBackup, setCurrentBackup] = useState(null);
    const [isRestoring, setIsRestoring] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        // Haal alle beschikbare backups op
        const availableBackups = getAllBackups();
        
        // Haal de huidige backup op
        const latestBackup = getLatestBackup();
        if (latestBackup) {
            setCurrentBackup(latestBackup.timestamp);
        }
        
        if (availableBackups.length === 0) {
            // Als er nog geen backups in de geschiedenis staan, controleer of er een laatste backup is
            if (latestBackup) {
                // Gebruik deze als enige backup in de lijst
                setBackups([{
                    ...latestBackup,
                    name: latestBackup.name || 'Laatste backup'
                }]);
            } else {
                setBackups([]);
            }
        } else {
            setBackups(availableBackups);
        }
    }, [lastBackupCreated]); // Re-run wanneer er een nieuwe backup is gemaakt
    
    // Sluit dropdown als er buiten wordt geklikt
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleRestore = async (backup) => {
        if (backup && backup.timestamp) {
            setIsRestoring(true);
            
            try {
                // Herstel de database vanuit de backup
                await restoreDatabaseFromBackup(backup);
                
                // Herstel de specifieke backup in lokale storage
                const restoredBackup = restoreBackup(backup.timestamp);
                
                if (restoredBackup && onRestore) {
                    onRestore(restoredBackup.data);
                    setCurrentBackup(restoredBackup.timestamp);
                    alert(`Backup "${backup.name || 'Onbekend'}" is succesvol hersteld!`);
                }
            } catch (error) {
                console.error("Fout bij het herstellen van backup:", error);
                alert("Er is een fout opgetreden bij het herstellen van de backup.");
            } finally {
                setIsRestoring(false);
                setIsOpen(false);
            }
        }
    };
    
    // Controleer of een backup de huidige actieve backup is
    const isCurrentBackup = (backup) => {
        return backup.timestamp === currentBackup;
    };
    
    // Formatteer datum voor betere leesbaarheid
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };
    
    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button 
                className={`${buttonStyles.restoreButton} ${styles.dropdownButton} ${isRestoring ? styles.loading : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isRestoring}
            >
                {isRestoring ? "Herstellen..." : "Herstel backup"}
                {!isRestoring && <span className={styles.dropdownArrow}>▼</span>}
            </button>
            
            {isOpen && !isRestoring && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                        <h3>Beschikbare backups</h3>
                    </div>
                    <ul className={styles.backupList}>
                        {backups.length > 0 ? (
                            backups.map((backup, index) => (
                                <li 
                                    key={backup.timestamp || index} 
                                    className={`${styles.backupItem} ${isCurrentBackup(backup) ? styles.currentBackup : ''}`}
                                    onClick={() => handleRestore(backup)}
                                >
                                    <div className={styles.backupInfo}>
                                        <span className={styles.backupName}>
                                            {backup.name || `Backup ${index + 1}`}
                                            {isCurrentBackup(backup) && <span className={styles.currentLabel}> (huidige versie)</span>}
                                        </span>
                                        <span className={styles.backupDate}>
                                            {formatDate(backup.timestamp)}
                                        </span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className={styles.noBackups}>Geen backups beschikbaar</li>
                        )}
                    </ul>
                    
                    <div className={styles.dropdownFooter}>
                        <small>Klik op een backup om deze te herstellen</small>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BackupDropdown;
