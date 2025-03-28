import {useReadSpeed} from "../../hooks/useReadSpeed.js";
import {calcReadTime} from "../../helpers/postHelpers.js";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import BackupButton from "../buttons/BackupButton.jsx";
import BackupDropdown from "../dropdowns/BackupDropdown.jsx";
import styles from "./PostsGridOffline.module.css";
import buttonStyles from "../buttons/Button.module.css";
import DeleteButton from "../buttons/DeleteButton.jsx";
import RecoverPostsDropdown from "../dropdowns/RecoverPostsDropdown.jsx";
import { useData } from "../../contexts/OfflineDataContext.jsx";
import { getDeletedPosts } from "../../services/backupService.js";

function PostsGridOffline() {
    // Dummy tags voor placeholders
    const dummyTags = [
        ['Reizen', 'Europa', 'Cultuur'],
        ['Backpacken', 'Azië', 'Budget'],
        ['Citytrip', 'Weekend', 'Luxe'],
        ['Natuur', 'Wandelen', 'Buiten'],
        ['Eten', 'Lokaal', 'Culinair']
    ];
    
    // Gebruik context in plaats van lokale state
    const { 
        posts, 
        loading, 
        error, 
        usingBackup, 
        backupTimestamp, 
        lastBackupCreated,
        deletedPostsCount,
        isOffline,
        syncStatus,
        dispatch,
        optimisticDeletePost 
    } = useData();
    
    const {readSpeed} = useReadSpeed();
    const [hoveredPostId, setHoveredPostId] = useState(null);

    // Effect om het aantal verwijderde posts bij te werken wanneer dit component mount
    useEffect(() => {
        const deletedPosts = getDeletedPosts();
        dispatch({ 
            type: 'UPDATE_DELETED_POSTS_COUNT', 
            payload: deletedPosts.length 
        });
    }, [dispatch]);

    const handleDeletePost = async (postId) => {
        try {
            // Zoek eerst de post op in de huidige lijst voordat we deze verwijderen
            const postToDelete = posts.find(post => post.id === postId);
            
            if (!postToDelete) {
                console.error("De post kon niet worden gevonden");
                return;
            }
            
            // Optimistic delete handelt alles af
            await optimisticDeletePost(postId);
            
        } catch (e) {
            console.error("Fout bij het verwijderen van post:", e);
        }
    };

    const handleRestorePost = (restoredPost) => {
        // Dit wordt nu afgehandeld in de RecoverPostsDropdown component
    };
    
    const handleRestoreBackup = (backupData) => {
        if (backupData) {
            // Gebruik de bestaande herstel backup actie
            dispatch({ 
                type: 'RESTORE_BACKUP', 
                payload: { data: backupData, timestamp: new Date().toISOString() } 
            });
        }
    };

    const handleBackupCreated = (backup) => {
        console.log("Nieuwe backup gemaakt:", backup);
        // Update lastBackupCreated in de context om BackupDropdown te laten re-renderen
        dispatch({ type: 'CREATE_BACKUP' });
    };
    
    // Functie om connectivity status weer te geven
    const getConnectivityStatus = () => {
        if (isOffline) {
            return (
                <div className={styles.offlineIndicator}>
                    <span className={styles.offlineIcon}>●</span> Offline modus
                </div>
            );
        }
        if (syncStatus === 'syncing') {
            return (
                <div className={styles.syncingIndicator}>
                    <span className={styles.syncingIcon}>↻</span> Synchroniseren...
                </div>
            );
        }
        if (syncStatus === 'failed') {
            return (
                <div className={styles.syncFailedIndicator}>
                    <span className={styles.syncFailedIcon}>⚠</span> Synchronisatie mislukt
                </div>
            );
        }
        return null;
    };

    // Render states
    if (loading) return <p>Posts laden...</p>;

    return (
        <div>
            <div className={styles.postsHeader}>
                <div className={styles.postsHeaderTop}>
                    <h2>Alle Posts {usingBackup && "(uit backup)"}</h2>
                    {getConnectivityStatus()}
                </div>
                <div className={styles.postStats}>
                    <p>Totaal aantal posts: {posts.length}</p>
                    {deletedPostsCount > 0 && (
                        <p className={styles.deletedPostsCounter}>
                            Verwijderde posts: {deletedPostsCount}
                        </p>
                    )}
                </div>
                {backupTimestamp && (
                    <p className={styles.backupInfo}>
                        Backup van: {new Date(backupTimestamp).toLocaleString()}
                    </p>
                )}
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <div className={buttonStyles.buttonGroup}>
                <BackupButton
                    posts={posts}
                    onBackupCreated={handleBackupCreated}
                />
                <BackupDropdown
                    onRestore={handleRestoreBackup}
                    lastBackupCreated={lastBackupCreated}
                />
                <RecoverPostsDropdown />
                <Link to="/settings" className={buttonStyles.settingsLink}>
                    Instellingen
                </Link>
            </div>

            {/* Lijst met posts */}
            <ul className={styles.postsList}>
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((post, index) => (
                        <li
                            key={post.id}
                            className={styles.postItem}
                            onMouseEnter={() => setHoveredPostId(post.id)}
                            onMouseLeave={() => setHoveredPostId(null)}
                        >
                            <DeleteButton
                                postId={post.id}
                                onDelete={handleDeletePost}
                                title={post.title}
                                visible={hoveredPostId === post.id} // Pass visibility prop
                            />
                            <Link to={`/posts/${post.id}`}>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                {post.subtitle && <div className={styles.postSubtitle}>{post.subtitle}</div>}
                                {/* Tags placeholder - maximaal 3 per post */}
                                <div className={styles.postTags}>
                                    {dummyTags[index % dummyTags.length].map((tag, tagIndex) => (
                                        <span key={tagIndex} className={styles.postTag}>#{tag}</span>
                                    ))}
                                </div>

                                <div className={styles.postMetadata}>
                                    <div className={styles.metaLeft}>
                                        <span className={styles.postAuthor}>{post?.author || 'Onbekend'}</span>
                                    </div>
                                    <div className={styles.metaRight}>
                                        <span className={styles.readTime}>{calcReadTime(post.content, readSpeed)}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>Geen posts gevonden</p>
                )}
            </ul>
        </ div>
    );
}

export default PostsGridOffline;