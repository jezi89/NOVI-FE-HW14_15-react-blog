import React from 'react';
import ClearLocalStorageButton from '../../components/buttons/ClearLocalStorageButton.jsx';
import styles from './SettingsPage.module.css';

function SettingsPage() {
    const handleLocalStorageClear = () => {
        // Voeg hier eventuele aanvullende acties toe na het wissen
        alert('Lokale gegevens zijn gewist. De pagina wordt opnieuw geladen.');
        // Optioneel: Ververs de pagina om de wijzigingen direct te zien
        window.location.reload();
    };

    return (
        <div className={styles.settingsPage}>
            <h1>Instellingen</h1>

            <section className={styles.settingsSection}>
                <h2>Gegevensbeheer</h2>
                <p>
                    Hier kun je lokaal opgeslagen gegevens beheren. Let op: het wissen van deze gegevens is permanent
                    en kan niet ongedaan worden gemaakt.
                </p>

                <div className={styles.settingsActions}>
                    <ClearLocalStorageButton onClear={handleLocalStorageClear}/>
                </div>

                <div className={styles.settingsInfo}>
                    <h3>Wat wordt er gewist?</h3>
                    <ul>
                        <li><strong>Verwijderde posts:</strong> Je lijst van eerder verwijderde posts wordt gewist.</li>
                        <li><strong>Backups:</strong> Alle lokaal opgeslagen backups worden gewist.</li>
                        <li><strong>Instellingen:</strong> Alle blog-gerelateerde instellingen worden teruggezet naar standaardwaarden.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default SettingsPage;
