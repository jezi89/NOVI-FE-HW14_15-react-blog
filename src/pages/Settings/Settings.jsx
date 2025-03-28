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
    const { dispatch, loadPosts, offlineMode, checkServerConnection } = useData();
    const [isResetting, setIsResetting] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    const handleLocalStorageClear = async () => {
        // Controleer eerst of we verbinding hebben met de server
        setIsClearing(true);
        
        try {
            const isServerAvailable = await checkServerConnection();
            
            if (!isServerAvailable) {
                alert('Je bent offline. Het is niet veilig om alle lokale data te wissen zonder verbinding met de server. Dit zou resulteren in een lege applicatie.');
                return;
            }
            
            // Wis de lokale opslag
            clearLocalStorage();
            
            // Update de context
            dispatch({ type: DATA_ACTIONS.CLEAR_LOCAL_DATA });
            
            // Laad de posts opnieuw vanaf de server
            try {
                await loadPosts(true); // Force reload van server
                alert('Alle lokale gegevens zijn gewist. De data is opnieuw geladen vanaf de server.');
            } catch (error) {
                console.error("Fout bij opnieuw laden posts:", error);
                alert('Lokale gegevens zijn gewist, maar er was een probleem bij het ophalen van nieuwe data. Ververs de pagina om het opnieuw te proberen.');
            }
            
            // Navigeer naar de posts pagina
            navigate('/posts');
        } catch (error) {
            console.error("Fout bij wissen lokale data:", error);
            alert('Er is een fout opgetreden bij het wissen van lokale gegevens.');
        } finally {
            setIsClearing(false);
        }
    };

    const handleResetToInitial = async () => {
        // Start laden indicator
        setIsResetting(true);
        
        try {
            const backup = resetToInitialBackup();
            
            if (!backup) {
                alert("Geen initiële backup gevonden om naar terug te zetten");
                return;
            }
            
            // Update de lokale weergave
            dispatch({ 
                type: DATA_ACTIONS.RESET_TO_INITIAL, 
                payload: backup 
            });
            
            // Probeer server te updaten als we online zijn
            if (!offlineMode) {
                try {
                    await resetDatabaseToInitial();
                    alert('Alle content is teruggezet naar de oorspronkelijke staat.');
                } catch (error) {
                    alert('Content is lokaal teruggezet, maar de server kon niet worden bijgewerkt.');
                    console.error("Fout bij het resetten van de server:", error);
                }
            } else {
                alert('Content is lokaal teruggezet. De server wordt bijgewerkt zodra je weer online bent.');
            }
            
            // Navigeer naar de posts pagina
            navigate('/posts');
            
        } catch (error) {
            console.error("Fout bij resetten:", error);
            alert("Er is een fout opgetreden bij het resetten.");
        } finally {
            // Stop laden indicator
            setIsResetting(false);
        }
    };
    
    const handleCheckConnection = async () => {
        setIsCheckingConnection(true);
        try {
            const isServerAvailable = await checkServerConnection();
            if (isServerAvailable) {
                alert("Verbinding met server is beschikbaar. Je kunt nu veilig lokale data wissen.");
                // Update de status in de context om de UI bij te werken
                dispatch({ type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: false });
                await loadPosts(true); // Ververs de data
            } else {
                alert("Geen verbinding met server. Wacht tot je weer verbinding hebt voordat je lokale data wist.");
            }
        } catch (error) {
            console.error("Fout bij controleren verbinding:", error);
            alert("Fout bij het controleren van de verbinding met de server.");
        } finally {
            setIsCheckingConnection(false);
        }
    };

    return (
        <PageLayout>
            <div className={styles.settingsPage}>
                <h1>Instellingen</h1>
                
                {offlineMode && (
                    <div className={styles.offlineWarning}>
                        Je bent momenteel offline. Wijzigingen worden lokaal opgeslagen en later met de server gesynchroniseerd.
                    </div>
                )}
                
                <section className={styles.settingsSection}>
                    <h2>Database en backups</h2>
                    
                    <div className={styles.settingGroup}>
                        <h3>Reset naar oorspronkelijke staat</h3>
                        <p>
                            Zet alle content terug naar de oorspronkelijke staat zoals bij eerste opstart. 
                            Dit behoudt wel je lijst van verwijderde posts.
                        </p>
                        <div className={styles.settingsActions}>
                            <ResetBackupButton
                                onBackupReset={handleResetToInitial}
                                buttonText="Terugzetten naar oorspronkelijke staat"
                                isLoading={isResetting}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.settingGroup}>
                        <h3>Alle lokale gegevens verwijderen</h3>
                        <p>
                            Wis alle lokaal opgeslagen gegevens, inclusief verwijderde posts, backups, 
                            en instellingen. Deze actie kan niet ongedaan worden gemaakt.
                        </p>
                        <div className={styles.settingsActions}>
                            {offlineMode ? (
                                <>
                                    <button 
                                        className={`${styles.connectionButton} ${isCheckingConnection ? styles.loading : ''}`}
                                        onClick={handleCheckConnection}
                                        disabled={isCheckingConnection}
                                    >
                                        {isCheckingConnection ? "Controleren..." : "Controleer serververbinding"}
                                    </button>
                                    <p className={styles.warningText}>
                                        Je moet verbinding hebben met de server om lokale data veilig te kunnen wissen
                                    </p>
                                </>
                            ) : (
                                <ClearLocalStorageButton 
                                    onClear={handleLocalStorageClear} 
                                    disabled={isClearing}
                                />
                            )}
                        </div>
                        
                        <div className={styles.settingsInfo}>
                            <h4>Wat wordt er gewist?</h4>
                            <ul>
                                <li><strong>Verwijderde posts:</strong> Eerder verwijderde posts worden weer zichtbaar.</li>
                                <li><strong>Backups:</strong> Alle lokaal opgeslagen backups worden verwijderd.</li>
                                <li><strong>Instellingen:</strong> Alle blog-gerelateerde voorkeuren worden teruggezet.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default Settings;
