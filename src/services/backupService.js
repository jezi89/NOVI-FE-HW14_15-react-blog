//LocalStorage keys

const INITIAL_BACKUP_KEY = 'blog_initial_backup_key';
const LATEST_BACKUP_KEY = 'blog_latest_backup_key';
const BACKUP_INITIALIZED_KEY = 'blog_backup_initialized_key';
const DELETED_POSTS_KEY = 'blog_deleted_posts';

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
        timestamp: timestamp
    };


    localStorage.setItem(INITIAL_BACKUP_KEY, JSON.stringify(backup));
    localStorage.setItem(LATEST_BACKUP_KEY, JSON.stringify(backup));
    localStorage.setItem(BACKUP_INITIALIZED_KEY, "true");

    console.log("Initiële backup opgeslagen", timestamp);
    return true;
}

// Maak een handmatige backup van de posts en sla deze op als meest recente backup

export function createManualBackup(posts) {
    const timestamp = new Date().toISOString();
    const backup = {
        data: posts,
        timestamp: timestamp
    };

    localStorage.setItem(LATEST_BACKUP_KEY, JSON.stringify(backup));
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

/*

export function backupPosts(posts) {
    try {
        const backup = {
            timestamp: new Date().toISOString(),
            data: posts};
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
        console.log("Posts backup created", backup.timestamp);
        return true;
        } catch (e) {
        console.error("Failed to backup posts", e);
        return false;

    }
}

export function getBackup() {
    try {
        const backup = localStorage.getItem(BACKUP_KEY);
        return backup ? JSON.parse(backup) : null;

    } catch (e) {
        console.error("Failed to retrieve backup", e);
        return null;
    }
}
*/
