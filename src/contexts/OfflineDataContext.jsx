import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchPosts, deletePost as apiDeletePost, fetchPostById, addPost } from '../services/postsFetchService';
import { 
    getLatestBackup, 
    isBackupInitialized, 
    saveInitialBackup, 
    getDeletedPosts,
    saveDeletedPost as saveDeletedPostToStorage,
    removeDeletedPost as removeDeletedPostFromStorage
} from '../services/backupService';

// Creëer de context
const DataContext = createContext(undefined);

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
    loading: false,
    error: null,
    usingBackup: false,
    backupTimestamp: null,
    lastBackupCreated: null,
    deletedPostsCount: 0,
    isOffline: false,
    syncStatus: 'idle', // 'idle', 'syncing', 'failed'
    pendingChanges: [] // Veranderingen die nog gesynchroniseerd moeten worden
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
                loading: false,
                error: null,
                usingBackup: false,
                backupTimestamp: null
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
                usingBackup: true,
                backupTimestamp: action.payload.timestamp,
                error: null
            };
        case DATA_ACTIONS.CLEAR_LOCAL_DATA:
            return {
                ...state,
                loading: true,
                usingBackup: false,
                backupTimestamp: null,
                deletedPostsCount: 0,
                pendingChanges: []
            };
        case DATA_ACTIONS.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
                deletedPostsCount: state.deletedPostsCount + 1,
                pendingChanges: state.isOffline 
                    ? [...state.pendingChanges, { type: 'delete', id: action.payload }]
                    : state.pendingChanges
            };
        case DATA_ACTIONS.RESTORE_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
                deletedPostsCount: state.deletedPostsCount > 0 ? state.deletedPostsCount - 1 : 0,
                pendingChanges: state.isOffline 
                    ? [...state.pendingChanges, { type: 'restore', data: action.payload }]
                    : state.pendingChanges
            };
        case DATA_ACTIONS.CREATE_BACKUP:
            return {
                ...state,
                lastBackupCreated: Date.now()
            };
        case DATA_ACTIONS.RESTORE_BACKUP:
            return {
                ...state,
                posts: action.payload.data,
                usingBackup: true,
                backupTimestamp: action.payload.timestamp,
                error: null
            };
        case DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT:
            return {
                ...state,
                deletedPostsCount: action.payload
            };
        case DATA_ACTIONS.SET_OFFLINE_MODE:
            return {
                ...state,
                isOffline: action.payload
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

// Provider component
export function DataProvider({ children }) {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    // Functie om posts te laden met fallback
    const loadPosts = async () => {
        dispatch({ type: DATA_ACTIONS.LOAD_POSTS_START });
        
        try {
            // Probeer van server te laden
            const data = await fetchPosts();
            
            if (data) {
                dispatch({ type: DATA_ACTIONS.LOAD_POSTS_SUCCESS, payload: data });
                dispatch({ type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: false });
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'idle' });
                
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
            
            // Ga naar offline mode
            dispatch({ type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: true });
            dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'failed' });
            
            // Probeer backup te herstellen
            const backup = getLatestBackup();
            if (backup && backup.data) {
                dispatch({ type: DATA_ACTIONS.SET_USING_BACKUP, payload: backup });
            }
        }
    };

    // Effect om posts te laden bij eerste render
    useEffect(() => {
        const loadPostsData = async () => {
            await loadPosts();
        };

        loadPostsData();
    }, []);

    // Effect om het aantal verwijderde posts bij te werken bij eerste render
    useEffect(() => {
        const deletedPosts = getDeletedPosts();
        dispatch({ 
            type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT, 
            payload: deletedPosts.length 
        });
    }, []);
    
    // Optimistic Delete functie
    const optimisticDeletePost = async (postId) => {
        // Vind post om lokaal op te slaan voordat deze wordt verwijderd
        const postToDelete = state.posts.find(post => post.id === postId);
        
        if (!postToDelete) {
            console.error("Post niet gevonden voor verwijderen");
            return false;
        }
        
        // Update UI direct (optimistic)
        dispatch({ type: DATA_ACTIONS.DELETE_POST, payload: postId });
        
        // Sla verwijderde post op in localStorage
        saveDeletedPostToStorage(postToDelete);
        
        // Als we online zijn, probeer ook server bij te werken
        if (!state.isOffline) {
            try {
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'syncing' });
                await apiDeletePost(postId);
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'idle' });
                return true;
            } catch (error) {
                console.error("Kon post niet verwijderen van server, maar UI is wel bijgewerkt", error);
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'failed' });
                return false;
            }
        }
        
        return true; // Succesvol in offline modus
    };
    
    // Optimistic Restore functie
    const optimisticRestorePost = async (post) => {
        // Verwijder deletedAt eigenschap als die bestaat
        const { deletedAt, ...postData } = post;
        
        // Update UI direct (optimistic)
        dispatch({ type: DATA_ACTIONS.RESTORE_POST, payload: postData });
        
        // Verwijder uit verwijderde posts in localStorage
        removeDeletedPostFromStorage(post.id);
        
        // Update aantal verwijderde posts
        const deletedPosts = getDeletedPosts();
        dispatch({ 
            type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT, 
            payload: deletedPosts.length 
        });
        
        // Als online, probeer server bij te werken
        if (!state.isOffline) {
            try {
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'syncing' });
                
                // Controleer eerst of post al bestaat op server
                try {
                    await fetchPostById(post.id);
                    // Post bestaat al, niets meer te doen
                } catch (error) {
                    // Post bestaat niet, toevoegen
                    await addPost(postData);
                }
                
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'idle' });
                return true;
            } catch (error) {
                console.error("Kon post niet herstellen op server, maar UI is wel bijgewerkt", error);
                dispatch({ type: DATA_ACTIONS.SET_SYNC_STATUS, payload: 'failed' });
                return false;
            }
        }
        
        return true; // Succesvol in offline modus
    };

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
