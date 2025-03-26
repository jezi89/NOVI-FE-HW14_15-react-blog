import readingSpeeds from '../constants/readingSpeeds.js';
import {getLatestBackup, isBackupInitialized, removeDeletedPost, saveInitialBackup} from '../services/backupService.js';
import {addPost, fetchPostById, fetchPosts} from '../services/postsFetchService.js';
import { deletePost } from '../services/postsFetchService.js';
import { saveDeletedPost } from '../services/backupService.js';

export async function getPosts(options = {}) {
    try {
        const posts = await fetchPosts(options);
        // Maak een initiële backup van de posts als deze nog niet is gemaakt
        if (posts && !isBackupInitialized()) {
            saveInitialBackup(posts)
        }
        return posts;
    } catch (e) {
        console.error("Kon posts niet ophalen:", e);
        // Gebruik backup als fallback
        const backup = getLatestBackup();
        if (backup && backup.data) {
            console.log("Gebruik backup data als fallback");
            return backup.data;
        }
        return [];
    }
}

// Business logica voor het ophalen van één post
export async function getPostById(id, options = {}) {
    try {
        // Probeer eerst direct de post op te halen als dat kan
        try {
            const post = await fetchPostById(id, options);
            return post;
        } catch (apiError) {
            // Als directe ophalen mislukt, probeer via alle posts
            const posts = await getPosts(options);
            return posts.find(item => item.id === parseInt(id));
        }
    } catch (e) {
        console.error(`Kan post met ID ${id} niet ophalen:`, e);
        // Gebruik backup als fallback
        const backup = getLatestBackup();
        if (backup && backup.data) {
            return backup.data.find(post => post.id === parseInt(id));
        }
        return null;
    }
}

// Business logica voor het toevoegen van een post
export async function createPost(postData, options = {}) {
    try {
        return await addPost(postData, options);
    } catch (e) {
        console.error("Fout bij het aanmaken van de post:", e);
        throw e;
    }
}



// Business logica voor het verwijderen van een post
export async function removePost(id, options = {}) {
    try {
        // Haal eerst de post op om hem op te slaan voordat we hem verwijderen
        const post = await getPostById(id, options);
        if (!post) {
        // sla de post op in deleted posts
        saveDeletedPost(post);
        // Verwijder de post
        await deletePost(id, options);
        return true;
    }
    return false;
} catch (e) {
        console.error(`Fout bij het verwijderen van post met ID ${id}:`, e);
        throw e;
    }
}


// Functie voor het terugzetten van verwijderde posts
export async function restoreDeletedPost(post, options = {}) {
    try {
        // Verwijder de 'deletedAt' eigenschap
        const { deletedAt, ...postData } = post;

        // Gebruik de addPost functie om de post terug te zetten
        const restoredPost = await addPost(postData, options);

        // Verwijder de post uit de verwijderde posts
        removeDeletedPost(post.id);

        return restoredPost;
    } catch (e) {
        console.error("Fout bij het terugzetten van de post:", e);
        throw e;
    }
}


// Bereken leestijd in minuten
export function calculateReadTimeinMinutes(content, readingSpeed = 'medium') {
    const wordCount = content.split(/\s+/).length;
    return Math.round(wordCount / readingSpeeds[readingSpeed]);
}

// Bereken en formatteer leestijd
export function calcReadTime(content, readingSpeed = 'medium') {
    const readingTime = content.split(/\s+/).length / readingSpeeds[readingSpeed];
    let minutes = Math.floor(readingTime);
    let seconds = Math.round((readingTime - minutes) * 60 / 10) * 10;

    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }

    const minuteText = minutes === 1 ? "minuut" : "min.";
    return `leestijd: ${minutes} ${minuteText}${seconds ? ` & ${seconds} sec.` : ''}`;
}

// Tel het aantal posts
export async function getPostCount() {
    try {
        const posts = await getPosts();
        return posts.length;
    } catch (e) {
        console.error("Kan aantal posts niet ophalen:", e);
        return 0;
    }
}


// Haal het aantal posts uit de backup
export function getLocalPostCount() {
    const backup = getLatestBackup();
    if (backup && backup.data) {
        return backup.data.length;
    }
    return 0;
}

