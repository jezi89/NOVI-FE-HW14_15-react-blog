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
    const readingTime = content.split(/\s+/).length / readingSpeeds[readingSpeed];
    let minutes = Math.floor(readingTime);
    let seconds = Math.round((readingTime - minutes) * 60 / 10) * 10;

    if (seconds === 60) { minutes++; seconds = 0; }

    const minuteText = minutes === 1 ? "minuut" : "min.";
    return `leestijd: ${minutes} ${minuteText}${seconds ? ` & ${seconds} sec.` : ''}`;
}

export function getPostCount() {
    return data.length;
}
