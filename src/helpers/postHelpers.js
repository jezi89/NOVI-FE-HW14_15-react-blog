// src/helpers/postHelpers.js
import data from '../constants/data.json';
import readingSpeeds from '../constants/readingSpeeds.js';

export function getAllPosts() {
    return data;
}

export function getPostById(id) {
    return data.find(item => item.id === parseInt(id));
}

export function calcReadTime(content, readingSpeed = 'medium') {
    const wordCount = content.split(/\s+/).length;
    const readingTimeMinutes = wordCount / readingSpeeds[readingSpeed];
    return Math.round(readingTimeMinutes);
}

export function getPostCount() {
    return data.length;
}
