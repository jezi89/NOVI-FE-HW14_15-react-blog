import axios from "axios";
import {backupPosts} from "./backupService.js";
import {getBackup} from "./backupService.js";

export async function getPostsWithFallback(useBackup = false) {
    if (useBackup) {
        console.log("Attempting to restore from backup");
        const backup = getBackup();
        if (backup && backup.data) {
            console.log("using backup from: ", backup.timestamp)
            return backup.data;
        }
        throw new Error("No bakcup available")
    }
    try {
        return await postsFetchService();
    } catch (e) {
        console.error("API failed, attempting to restore from backup");
        const backup = getBackup();
        if (backup && backup.data) {
            console.log("Using backup from:", backup.timestamp);
            return backup.data;
        } else {
            throw new Error("No backup available and API failed");
        }
    }
}

export async function postsFetchService(options = {}) {
    try {
        const response = await axios.get("http://localhost:3000/posts",
            {
                signal: options.signal
            });
        console.log(response.data);
        backupPosts(response.data)
        return response.data;
    } catch (e) {
        if (axios.isCancel(e) || e.code === 'ERR_CANCELED') {
            console.log("Request canceled:", e.message);
            return;
        }
        console.error("Error fetching posts:", e);
        throw e;
    } finally {
        console.log("Successfully retrieved posts...");
    }
}

export async function postsAddService(postData) {
    try {
        const response = await axios.post("http://localhost:3000/posts/", postData)
        console.log(response);

        const allPosts = await postsFetchService();
        backupPosts(allPosts)
        return response.data;
    } catch (e) {
        console.error("Error adding posts:", e);
        throw e;
    } finally {
        console.log("Successfully added posts...");

    }
}

export async function postDeleteService() {
    try {
        const newPosts = await axios.delete("http://localhost:3000/posts/18");
        console.log(newPosts)
    } catch (e) {
        console.error("Error deleting post 18:", e);
        throw e;
    } finally {
        console.log("Successfully deleted post 18...");

    }
}


/*let localPostsCache = null

export async function postsAddService() {
    try {

        if (!localPostsCache) {
            localPostsCache = await postsFetchService();
        }
        const postToAdd = Array.isArray(newTestPost) ? newTestPost[0] : newTestPost;
        const postWithId = {
            ...postToAdd,
            id: localPostsCache.length + 1,
            created: new Date().toISOString()
        };
        localPostsCache = [...localPostsCache, postWithId];
        console.log(localPostsCache);
        return localPostsCache;

    } catch (e) {
        console.error("Error adding posts:", e);
        throw e;
    } finally {
        console.log("Successfully added posts...");

    }

}*/
