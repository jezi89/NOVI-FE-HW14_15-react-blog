import React, { useState } from 'react';
import ClearLocalStorageButton from '../../components/buttons/ClearLocalStorageButton.jsx';
import PageLayout from '../../components/pageLayOut/PageLayout.jsx';
import ResetBackupButton from '../../components/buttons/ResetBackupButton.jsx';
import { useNavigate } from 'react-router-dom';
import { useData, DATA_ACTIONS } from '../../contexts/DataContext.jsx';
import { clearLocalStorage } from '../../services/localStorageService.js';
import { resetToInitialBackup } from '../../services/backupService.js';
import { resetDatabaseToInitial } from '../../services/databaseResetService.js';
import styles from './Settings.module.css';

export function Settings() {
    const navigate = useNavigate();
    const { dispatch, loadPosts } = useData();
    const [isResetting, setIsResetting] = useState(false);

    const handleLocalStorageClear = () => {
        // Wis de lokale opslag
        clearLocalStorage();
        
        // Update de context
        dispatch({ type: DATA_ACTIONS.CLEAR_LOCAL_DATA });
        
        // Laad de posts opnieuw vanaf de server
        loadPosts();
        
        // Navigeer naar de posts pagina
        navigate('/posts');
        
        // Toon een bevestigingsbericht
        alert('Alle lokale gegevens zijn gewist. De data wordt opnieuw geladen.');
    };

    const handleBackupReset = async () => {
        // Start laden indicator
        setIsResetting(true);
        
        try {
            // Reset de database naar initiële staat
            const databaseResetSuccess = await resetDatabaseToInitial();
            
            if (!databaseResetSuccess) {
                alert("Kon database niet volledig resetten naar initiële staat. Sommige posts zijn mogelijk niet hersteld.");
            }
            
            // Reset ook de lokale backup
            const backup = resetToInitialBackup();
            
            if (backup) {
                // Update de context
                dispatch({ 
                    type: DATA_ACTIONS.RESET_TO_INITIAL, 
                    payload: backup 
                });
                
                // Navigeer naar de posts pagina
                navigate('/posts');
                
                // Toon een bevestigingsbericht
                alert('De posts zijn teruggezet naar de oorspronkelijke database-waardes.');
            } else {
                alert("Geen initiële backup gevonden om naar terug te zetten");
            }
        } catch (error) {
            console.error("Fout bij resetten:", error);
            alert("Er is een fout opgetreden bij het resetten van de database.");
        } finally {
            // Stop laden indicator
            setIsResetting(false);
        }
    };

    return (
        <PageLayout>
            <div className={styles.settingsPage}>
                <h1>Instellingen</h1>
                
                <section className={styles.settingsSection}>
                    <h2>Terug naar fabrieksinstellingen</h2>
                    <p>
                        Hier kun je de applicatie terugzetten naar de oorspronkelijke instellingen of alle lokale gegevens wissen.
                    </p>
                    
                    <div className={styles.settingGroup}>
                        <h3>Reset naar oorspronkelijke database</h3>
                        <p>
                            Zet de posts terug naar de originele gegevens zoals ze bij eerste gebruik waren. 
                            Dit laat verwijderde posts verborgen en behoudt je backups.
                        </p>
                        <div className={styles.settingsActions}>
                            <ResetBackupButton
                                onBackupReset={handleBackupReset}
                                buttonText="Reset naar originele posts"
                                isLoading={isResetting}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.settingGroup}>
                        <h3>Verwijder alle lokale gegevens</h3>
                        <p>
                            Wis alle lokaal opgeslagen gegevens, inclusief verwijderde posts, backups, 
                            en instellingen. Deze actie kan niet ongedaan worden gemaakt.
                        </p>
                        <div className={styles.settingsActions}>
                            <ClearLocalStorageButton onClear={handleLocalStorageClear} />
                        </div>
                        
                        <div className={styles.settingsInfo}>
                            <h4>Wat wordt er gewist?</h4>
                            <ul>
                                <li><strong>Verwijderde posts:</strong> Je lijst van eerder verwijderde posts wordt gewist, waardoor deze weer zichtbaar worden.</li>
                                <li><strong>Backups:</strong> Alle lokaal opgeslagen backups worden verwijderd.</li>
                                <li><strong>Instellingen:</strong> Alle blog-gerelateerde voorkeuren worden teruggezet naar standaardwaarden.</li>
                                <li><strong>Tracking:</strong> Alle informatie over verborgen posts wordt verwijderd.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default Settings;
