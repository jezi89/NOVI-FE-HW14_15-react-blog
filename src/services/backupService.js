//LocalStorage keys

const INITIAL_BACKUP_KEY = 'blog_initial_backup_key';
const LATEST_BACKUP_KEY = 'blog_latest_backup_key';
const BACKUP_INITIALIZED_KEY = 'blog_backup_initialized_key';
const DELETED_POSTS_KEY = 'blog_deleted_posts';
const BACKUPS_HISTORY_KEY = 'blog_backups_history';
const MAX_BACKUPS = 10; // Maximum aantal backups om op te slaan

// controleer of de backup is al gemaakt
export function isBackupInitialized() {
    return localStorage.getItem(BACKUP_INITIALIZED_KEY) === "true";
}

// Sla initiële backup op in localStorage
export function saveInitialBackup(posts) {
    if (isBackupInitialized()) {
        return false;
    }
    const timestamp = new Date().toISOString();

    const backup = {
        data: posts,
        timestamp: timestamp,
        name: "Initiële backup"
    };

    localStorage.setItem(INITIAL_BACKUP_KEY, JSON.stringify(backup));
    localStorage.setItem(LATEST_BACKUP_KEY, JSON.stringify(backup));
    localStorage.setItem(BACKUP_INITIALIZED_KEY, "true");
    
    // Ook toevoegen aan de backupgeschiedenis
    addBackupToHistory(backup);

    console.log("Initiële backup opgeslagen", timestamp);
    return true;
}

// Haal alle opgeslagen backups op
export function getAllBackups() {
    const backupsJSON = localStorage.getItem(BACKUPS_HISTORY_KEY);
    
    if (!backupsJSON) {
        // Als er nog geen geschiedenis is, maak een lege array
        return [];
    }
    
    try {
        // Sorteer backups van nieuw naar oud
        return JSON.parse(backupsJSON).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    } catch (e) {
        console.error("Fout bij het parsen van backupgeschiedenis:", e);
        return [];
    }
}

// Voeg een backup toe aan de geschiedenis
function addBackupToHistory(backup) {
    // Haal huidige backups op
    const backups = getAllBackups();
    
    // Controleer of deze backup (op basis van timestamp) al bestaat
    const exists = backups.some(b => b.timestamp === backup.timestamp);
    
    if (!exists) {
        // Voeg toe aan het begin van de array
        backups.unshift(backup);
        
        // Beperk tot maximaal aantal backups
        const limitedBackups = backups.slice(0, MAX_BACKUPS);
        
        // Sla op in localStorage
        localStorage.setItem(BACKUPS_HISTORY_KEY, JSON.stringify(limitedBackups));
    }
}

// Maak een handmatige backup van de posts en sla deze op als meest recente backup
export function createManualBackup(posts, name = "") {
    const timestamp = new Date().toISOString();
    const backupName = name || `Backup ${new Date().toLocaleString()}`;
    
    const backup = {
        data: posts,
        timestamp: timestamp,
        name: backupName
    };

    localStorage.setItem(LATEST_BACKUP_KEY, JSON.stringify(backup));
    
    // Voeg toe aan de backupgeschiedenis
    addBackupToHistory(backup);
    
    console.log("Handmatige backup gemaakt op: ", timestamp);
    return backup;
}

// Haal de meest recente backup op uit localStorage
export function getLatestBackup() {
    const backupJSON = localStorage.getItem(LATEST_BACKUP_KEY);
    if (!backupJSON) {
        console.error("Geen recente backup gevonden");
        return null;
    }

    try {
        return JSON.parse(backupJSON);
    } catch (e) {
        console.error("Fout bij het parsen van de backup", e);
        return null;
    }
}

// Haal de initiële backup op uit localStorage
export function getInitialBackup() {
    const backupJSON = localStorage.getItem(INITIAL_BACKUP_KEY);
    if (!backupJSON) {
        console.error("Geen initiële backup gevonden");
        return null;

    }
    try {
        return JSON.parse(backupJSON);
    } catch (e) {
        console.error("Fout bij het parsen van de initiële backup", e);
        return null;
    }
}

// reset de meest recente backup naar de initiële backup
export function resetToInitialBackup() {
    const initialBackup = getInitialBackup();
    if (!initialBackup) {
        console.error("Geen initiële backup gevonden");
        return null;
    }
    localStorage.setItem(LATEST_BACKUP_KEY, JSON.stringify(initialBackup));
    console.log("Backup gereset naar initiële versie van: ", initialBackup.timestamp);
    return initialBackup;
}

// Herstel een specifieke backup en maak deze de actieve (laatste) backup
export function restoreBackup(timestamp) {
    const backups = getAllBackups();
    const backup = backups.find(b => b.timestamp === timestamp);
    
    if (!backup) {
        console.error("Backup niet gevonden met timestamp:", timestamp);
        return null;
    }
    
    localStorage.setItem(LATEST_BACKUP_KEY, JSON.stringify(backup));
    console.log("Backup hersteld van:", backup.timestamp);
    return backup;
}

// Sla een verwijderde post op
export function saveDeletedPost(post) {
    const deletedPostsJSON = localStorage.getItem(DELETED_POSTS_KEY);
    let deletedPosts = [];

    if (deletedPostsJSON) {
        try {
            deletedPosts = JSON.parse(deletedPostsJSON);
        } catch (e) {
            console.error("Fout bij het parsen van verwijderde posts:", e);
        }
    }

    // Voeg timestamp toe voor sortering
    const postWithTimestamp = {
        ...post,
        deletedAt: new Date().toISOString()
    };

    // Voeg de nieuwe verwijderde post toe aan het begin
    deletedPosts.unshift(postWithTimestamp);

    // Sla maximaal 50 verwijderde posts op
    if (deletedPosts.length > 50) {
        deletedPosts = deletedPosts.slice(0, 50);
    }

    localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(deletedPosts));
    return postWithTimestamp;
}

// Haal alle verwijderde posts op
export function getDeletedPosts() {
    const deletedPostsJSON = localStorage.getItem(DELETED_POSTS_KEY);

    if (!deletedPostsJSON) {
        return [];
    }

    try {
        return JSON.parse(deletedPostsJSON);
    } catch (e) {
        console.error("Fout bij het parsen van verwijderde posts:", e);
        return [];
    }
}

// Verwijder een post uit de verwijderde posts
export function removeDeletedPost(postId) {
    const deletedPostsJSON = localStorage.getItem(DELETED_POSTS_KEY);

    if (!deletedPostsJSON) {
        return false;
    }

    try {
        const deletedPosts = JSON.parse(deletedPostsJSON);
        const updatedPosts = deletedPosts.filter(post => post.id !== postId);

        localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(updatedPosts));
        return true;
    } catch (e) {
        console.error("Fout bij het verwerken van verwijderde posts:", e);
        return false;
    }
}
