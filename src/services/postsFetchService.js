import axios from "axios";

// Haal alle posts op
export async function fetchPosts(options = {}) {
    try {
        const response = await axios.get("http://localhost:3000/posts", {
            signal: options.signal
        });
        return response.data;
    } catch (e) {
        if (axios.isCancel(e) || e.code === 'ERR_CANCELED') {
            console.log("Request geannuleerd:", e.message);
            return null;
        }
        throw e;
    }
}

// Haal een specifieke post op
export async function fetchPostById(id, options = {}) {
    try {
        const response = await axios.get(`http://localhost:3000/posts/${id}`, {
            signal: options.signal
        });
        return response.data;
    } catch (e) {
        if (axios.isCancel(e) || e.code === 'ERR_CANCELED') {
            console.log("Request geannuleerd:", e.message);
            return null;
        }
        throw e;
    }
}

// Voeg een nieuwe post toe
export async function addPost(postData, options = {}) {
    try {
        const response = await axios.post("http://localhost:3000/posts/", postData, {
            signal: options.signal
        });
        return response.data;
    } catch (e) {
        if (axios.isCancel(e) || e.code === 'ERR_CANCELED') {
            console.log("Request geannuleerd:", e.message);
            return null;
        }
        throw e;
    }
}

// In src/services/postsFetchService.js

// Verwijdert een post op basis van ID
export async function deletePost(id, options = {}) {
    try {
        const response = await axios.delete(`http://localhost:3000/posts/${id}`, {
            signal: options.signal
        });
        return response.data;
    } catch (e) {
        if (axios.isCancel(e) || e.code === 'ERR_CANCELED') {
            console.log("Request geannuleerd:", e.message);
            return null;
        }
        throw e;
    }
}
