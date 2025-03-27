import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {fetchPosts} from '../services/postsFetchService';
import {
    getLatestBackup,
    isBackupInitialized,
    saveInitialBackup,
    getDeletedPosts,
    saveDeletedPost as saveDeletedPostToStorage,
    removeDeletedPost as removeDeletedPostFromStorage
} from '../services/backupService';
import axios from 'axios';

// Creëer de context
const DataContext = createContext();

// Acties
export const DATA_ACTIONS = {
    LOAD_POSTS_START: 'LOAD_POSTS_START',
    LOAD_POSTS_SUCCESS: 'LOAD_POSTS_SUCCESS',
    LOAD_POSTS_ERROR: 'LOAD_POSTS_ERROR',
    SET_USING_BACKUP: 'SET_USING_BACKUP',
    RESET_TO_INITIAL: 'RESET_TO_INITIAL',
    CLEAR_LOCAL_DATA: 'CLEAR_LOCAL_DATA',
    DELETE_POST: 'DELETE_POST',
    RESTORE_POST: 'RESTORE_POST',
    CREATE_BACKUP: 'CREATE_BACKUP',
    RESTORE_BACKUP: 'RESTORE_BACKUP',
    UPDATE_DELETED_POSTS_COUNT: 'UPDATE_DELETED_POSTS_COUNT',
    SET_OFFLINE_MODE: 'SET_OFFLINE_MODE',
    SET_SYNC_STATUS: 'SET_SYNC_STATUS'
};

// Initiële state
const initialState = {
    posts: [],
    serverPosts: null, // Laatst bekende posts van server
    loading: true,
    error: null,
    usingBackup: false,
    backupTimestamp: null,
    lastBackupCreated: null,
    deletedPostsCount: 0,
    offlineMode: false,
    syncStatus: 'idle', // idle, syncing, failed
    pendingChanges: [] // Wijzigingen die nog niet gesynchroniseerd zijn
};

// Reducer functie
function dataReducer(state, action) {
    switch (action.type) {
        case DATA_ACTIONS.LOAD_POSTS_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        case DATA_ACTIONS.LOAD_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.payload,
                serverPosts: action.payload, // Update laatst bekende server state
                loading: false,
                error: null,
                usingBackup: false,
                backupTimestamp: null,
                syncStatus: 'idle'
            };
        case DATA_ACTIONS.LOAD_POSTS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case DATA_ACTIONS.SET_USING_BACKUP:
            return {
                ...state,
                posts: action.payload.data,
                usingBackup: true,
                backupTimestamp: action.payload.timestamp,
                error: null
            };
        case DATA_ACTIONS.RESET_TO_INITIAL:
            return {
                ...state,
                posts: action.payload.data,
                serverPosts: action.payload.data, // Aanname: server is gesynchroniseerd
                usingBackup: true,
                backupTimestamp: action.payload.timestamp,
                error: null,
                syncStatus: 'idle'
            };
        case DATA_ACTIONS.CLEAR_LOCAL_DATA:
            // Dit moet gevolgd worden door het opnieuw laden van posts van de server
            return {
                ...state,
                loading: true, // Begin met het laden
                usingBackup: false,
                backupTimestamp: null,
                deletedPostsCount: 0, // Reset de teller
                pendingChanges: [] // Reset pending changes
            };
        case DATA_ACTIONS.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
                deletedPostsCount: state.deletedPostsCount + 1 // Verhoog de teller
            };
        case DATA_ACTIONS.RESTORE_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
                deletedPostsCount: state.deletedPostsCount > 0 ? state.deletedPostsCount - 1 : 0 // Verlaag de teller
            };
        case DATA_ACTIONS.CREATE_BACKUP:
            return {
                ...state,
                lastBackupCreated: Date.now() // Timestamp voor re-render triggers
            };
        case DATA_ACTIONS.RESTORE_BACKUP:
            return {
                ...state,
                posts: action.payload.data,
                serverPosts: action.payload.data, // Aanname: server is gesynchroniseerd
                usingBackup: true,
                backupTimestamp: action.payload.timestamp,
                error: null,
                syncStatus: 'idle'
            };
        case DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT:
            return {
                ...state,
                deletedPostsCount: action.payload
            };
        case DATA_ACTIONS.SET_OFFLINE_MODE:
            return {
                ...state,
                offlineMode: action.payload
            };
        case DATA_ACTIONS.SET_SYNC_STATUS:
            return {
                ...state,
                syncStatus: action.payload
            };
        default:
            return state;
    }
}

// Dummy data als alles faalt
const getDummyData = () => {
    return [
        {
            id: 999,
            title: "Geen verbinding met server (dummy content)",
            subtitle: "De applicatie werkt in offline modus",
            content: "Het lijkt erop dat we geen verbinding kunnen maken met de server. De applicatie draait nu in offline modus met beperkte functionaliteit. Alle wijzigingen worden lokaal opgeslagen en zullen worden gesynchroniseerd zodra de verbinding wordt hersteld.",
            author: "Systeem",
            created: new Date().toISOString(),
            readTime: 1,
            comments: 0,
            shares: 0
        }
    ];
};

// Provider component
export function DataProvider({children}) {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    // Functie om te controleren of server bereikbaar is
    const checkServerConnection = async () => {
        try {
            await axios.get('http://localhost:3000/posts', {timeout: 3000});
            return true;
        } catch (error) {
            return false;
        }
    };

    // Functie om posts te laden
    const loadPosts = async () => {
        dispatch({type: DATA_ACTIONS.LOAD_POSTS_START});

        // Controleer server connectie
        const isServerAvailable = await checkServerConnection();
        dispatch({type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: !isServerAvailable});

        if (isServerAvailable) {
            try {
                const data = await fetchPosts();

                if (data) {
                    // Filter verwijderde posts
                    const deletedPosts = getDeletedPosts();
                    const deletedPostIds = new Set(deletedPosts.map(post => post.id));
                    const filteredData = data.filter(post => !deletedPostIds.has(post.id));

                    dispatch({type: DATA_ACTIONS.LOAD_POSTS_SUCCESS, payload: filteredData});

                    // Maak initiële backup als die nog niet bestaat
                    if (!isBackupInitialized()) {
                        saveInitialBackup(data);
                    }
                }
            } catch (error) {
                console.error("Fout bij het ophalen van posts:", error);
                dispatch({
                    type: DATA_ACTIONS.LOAD_POSTS_ERROR,
                    payload: "Kon posts niet laden. Probeer de backup te herstellen."
                });

                // Probeer backup te herstellen
                const backup = getLatestBackup();
                if (backup && backup.data) {
                    // Filter verwijderde posts uit backup
                    const deletedPosts = getDeletedPosts();
                    const deletedPostIds = new Set(deletedPosts.map(post => post.id));
                    const filteredBackupData = backup.data.filter(post => !deletedPostIds.has(post.id));

                    dispatch({
                        type: DATA_ACTIONS.SET_USING_BACKUP,
                        payload: {...backup, data: filteredBackupData}
                    });
                }
            }
        } else {
            // Offline modus: gebruik backup of dummy data
            console.log("Server niet beschikbaar, gebruik lokale backup");
            const backup = getLatestBackup();

            if (backup && backup.data) {
                // Filter verwijderde posts uit backup
                const deletedPosts = getDeletedPosts();
                const deletedPostIds = new Set(deletedPosts.map(post => post.id));
                const filteredBackupData = backup.data.filter(post => !deletedPostIds.has(post.id));

                dispatch({
                    type: DATA_ACTIONS.SET_USING_BACKUP,
                    payload: {...backup, data: filteredBackupData}
                });
            } else {
                // Geen backup beschikbaar, gebruik dummy data
                const dummyData = getDummyData();
                dispatch({
                    type: DATA_ACTIONS.LOAD_POSTS_SUCCESS,
                    payload: dummyData
                });
                // Sla dummy data op als backup
                saveInitialBackup(dummyData);
            }
        }
    };

    // Optimistic update functies
    const optimisticDeletePost = async (postId) => {
        // Vind de post voordat we deze verwijderen (voor lokale opslag)
        const postToDelete = state.posts.find(post => post.id === postId);

        if (!postToDelete) {
            console.error("Post niet gevonden:", postId);
            return false;
        }

        // Optimistic UI update
        dispatch({type: DATA_ACTIONS.DELETE_POST, payload: postId});

        // Sla verwijderde post op in localStorage
        saveDeletedPostToStorage(postToDelete);

        // Probeer te synchroniseren met server als we online zijn
        if (!state.offlineMode) {
            dispatch({type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'syncing'});

            try {
                // Wacht op verwijdering van server
                await axios.delete(`http://localhost:3000/posts/${postId}`);
                dispatch({type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'idle'});
                return true;
            } catch (error) {
                console.error("Kon post niet verwijderen van server, maar wel lokaal gemarkeerd als verwijderd", error);
                dispatch({type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'failed'});
                // Post blijft verwijderd in UI en gemarkeerd in localStorage
                return true;
            }
        }

        return true; // Succes (offline modus)
    };

    const optimisticRestorePost = async (post) => {
        // Bereid post voor om te herstellen
        const {deletedAt, ...postData} = post;

        // Optimistic UI update
        dispatch({type: DATA_ACTIONS.RESTORE_POST, payload: postData});

        // Verwijder uit verwijderde posts in localStorage
        removeDeletedPostFromStorage(post.id);

        // Probeer te synchroniseren met server als we online zijn
        if (!state.offlineMode) {
            dispatch({type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'syncing'});

            try {
                // Controleer eerst of de post al bestaat op de server
                try {
                    await axios.get(`http://localhost:3000/posts/${post.id}`);
                    // Post bestaat al, niets te doen
                } catch (getError) {
                    // Post bestaat niet, toevoegen
                    await axios.post('http://localhost:3000/posts', postData);
                }

                dispatch({type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'idle'});
                return postData;
            } catch (error) {
                console.error("Kon post niet herstellen op server, maar wel lokaal hersteld", error);
                dispatch({type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'failed'});
                // Post blijft hersteld in UI
                return postData;
            }
        }

        return postData; // Succes (offline modus)
    };

    // Effect om posts te laden bij eerste render
    useEffect(() => {
        loadPosts();
    }, []);

    // Effect om het aantal verwijderde posts bij te werken bij eerste render
    useEffect(() => {
        const deletedPosts = getDeletedPosts();
        dispatch({
            type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT,
            payload: deletedPosts.length
        });
    }, []);

    // Effect om regelmatig te controleren of we online zijn
    useEffect(() => {
        const checkConnection = async () => {
            const isServerAvailable = await checkServerConnection();

            // Als status verandert van offline naar online, probeer te synchroniseren
            if (isServerAvailable && state.offlineMode) {
                dispatch({type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: false});
                // TODO: Synchroniseer eventuele offline wijzigingen
                await loadPosts(); // Herlaad posts bij herstel van verbinding
            } else if (!isServerAvailable && !state.offlineMode) {
                dispatch({type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: true});
            }
        };

        // Check elke 30 seconden voor verbinding
        const interval = setInterval(checkConnection, 30000);

        return () => clearInterval(interval);
    }, [state.offlineMode]);

    // Waarde die we aan de context doorgeven
    const value = {
        ...state,
        dispatch,
        loadPosts,
        optimisticDeletePost,
        optimisticRestorePost
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

// Hook om de context te gebruiken
export function useData() {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useData moet binnen een DataProvider gebruikt worden');
    }

    return context;
}
