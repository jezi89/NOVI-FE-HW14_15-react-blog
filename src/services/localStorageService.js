// LocalStorage keys voor blogventure
const DELETED_POSTS_KEY = 'blogventure_deleted_posts';
const BLOG_DELETED_POSTS_KEY = 'blog_deleted_posts'; // Voeg de sleutel uit backupService toe
const BACKUP_KEY = 'blogventure_backup';
const INITIAL_BACKUP_KEY = 'blogventure_initial_backup';
const BLOG_INITIAL_BACKUP_KEY = 'blog_initial_backup_key'; // Voeg de sleutel uit backupService toe
const BLOG_LATEST_BACKUP_KEY = 'blog_latest_backup_key'; // Voeg de sleutel uit backupService toe
const BLOG_BACKUP_INITIALIZED_KEY = 'blog_backup_initialized_key'; // Voeg de sleutel uit backupService toe
const BLOG_BACKUPS_HISTORY_KEY = 'blog_backups_history'; // Voeg de nieuwe historie sleutel toe

/**
 * Wist alle blogventure-gerelateerde gegevens uit localStorage
 * @returns {boolean} True als succesvol, false als er een fout optrad
 */
export function clearLocalStorage() {
    try {
        // Wis de sleutels uit localStorageService
        localStorage.removeItem(DELETED_POSTS_KEY);
        localStorage.removeItem(BACKUP_KEY);
        localStorage.removeItem(INITIAL_BACKUP_KEY);
        
        // Wis de sleutels uit backupService
        localStorage.removeItem(BLOG_DELETED_POSTS_KEY);
        localStorage.removeItem(BLOG_INITIAL_BACKUP_KEY);
        localStorage.removeItem(BLOG_LATEST_BACKUP_KEY);
        localStorage.removeItem(BLOG_BACKUP_INITIALIZED_KEY);
        localStorage.removeItem(BLOG_BACKUPS_HISTORY_KEY); // Wis ook de backup geschiedenis
        
        console.log('Alle lokale gegevens zijn succesvol gewist');
        return true;
    } catch (error) {
        console.error('Fout bij het wissen van localStorage:', error);
        return false;
    }
}

/**
 * Haalt verwijderde posts op uit localStorage
 * @returns {Array} Een array met verwijderde posts, of een lege array als er geen zijn
 */
export function getDeletedPosts() {
    try {
        const postsJson = localStorage.getItem(DELETED_POSTS_KEY);
        return postsJson ? JSON.parse(postsJson) : [];
    } catch (error) {
        console.error('Fout bij het ophalen van verwijderde posts:', error);
        return [];
    }
}
