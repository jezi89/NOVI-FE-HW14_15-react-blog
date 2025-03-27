// In src/services/databaseResetService.js
import axios from 'axios';
import { getInitialBackup } from './backupService';

/**
 * Reset de database naar de initiële situatie op basis van de initiële backup
 * @returns {Promise<boolean>} True als succesvol, False als er een fout optrad
 */
export async function resetDatabaseToInitial() {
    try {
        // Haal de initiële backup op
        const initialBackup = getInitialBackup();
        
        if (!initialBackup || !initialBackup.data) {
            console.error("Geen initiële backup gevonden");
            return false;
        }
        
        // Voor elke post in de initiële backup...
        for (const post of initialBackup.data) {
            try {
                // Controleer of de post al bestaat (PUTs) of nieuw moet worden toegevoegd (POSTs)
                await axios.put(`http://localhost:3000/posts/${post.id}`, post);
            } catch (error) {
                // Als PUT mislukt (post bestaat niet), probeer een POST
                try {
                    await axios.post(`http://localhost:3000/posts`, post);
                } catch (innerError) {
                    console.error(`Kon post ${post.id} niet herstellen:`, innerError);
                }
            }
        }
        
        console.log("Database succesvol gereset naar initiële staat");
        return true;
    } catch (error) {
        console.error("Fout bij het resetten van de database:", error);
        return false;
    }
}

/**
 * Herstelt de database vanuit een specifieke backup
 * @param {Object} backup - De backup om te herstellen
 * @returns {Promise<boolean>} True als succesvol, False als er een fout optrad
 */
export async function restoreDatabaseFromBackup(backup) {
    try {
        if (!backup || !backup.data) {
            console.error("Ongeldige backup");
            return false;
        }
        
        // Voor elke post in de backup...
        for (const post of backup.data) {
            try {
                // Controleer of de post al bestaat (PUTs) of nieuw moet worden toegevoegd (POSTs)
                await axios.put(`http://localhost:3000/posts/${post.id}`, post);
            } catch (error) {
                // Als PUT mislukt (post bestaat niet), probeer een POST
                try {
                    await axios.post(`http://localhost:3000/posts`, post);
                } catch (innerError) {
                    console.error(`Kon post ${post.id} niet herstellen:`, innerError);
                }
            }
        }
        
        console.log("Database succesvol hersteld vanuit backup");
        return true;
    } catch (error) {
        console.error("Fout bij het herstellen van de database:", error);
        return false;
    }
}
