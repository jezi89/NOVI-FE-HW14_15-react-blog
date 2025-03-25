// src/helpers/postHelpers.js
import data from '../constants/data.json';
import readingSpeeds from '../constants/readingSpeeds.js';
import { postsFetchService } from '../services/postsFetchService.js';

async function getPosts() {
    try {
        return await postsFetchService();
    } catch (e) {
        console.error("Failed to fetch posts:", e);
        return data; // Fallback to local data
    }
}

export async function getPostById(id) {
        try {
            const posts = await getPosts();
            return posts.find(item => item.id === parseInt(id));
    } catch (e) {
        console.error("Error getting post by ID:", e)
        return data.find(item => item.id === parseInt(id))
    }
}

export function calcReadTime(content, readingSpeed = 'medium') {
    const readingTime = content.split(/\s+/).length / readingSpeeds[readingSpeed];
    let minutes = Math.floor(readingTime);
    let seconds = Math.round((readingTime - minutes) * 60 / 10) * 10;

    if (seconds === 60) { minutes++; seconds = 0; }

    const minuteText = minutes === 1 ? "minuut" : "min.";
    return `leestijd: ${minutes} ${minuteText}${seconds ? ` & ${seconds} sec.` : ''}`;
}

export async function getPostCount() {
    try {
        const posts = await postsFetchService();
        return posts.length;
    } catch (e) {
        console.error("cannot get postCount", e);
        return data.length
    }
}

export function getLocalPostCount() {
    return data.length;
}
