export const BACKUP_KEY = 'blog_posts_backup';

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
