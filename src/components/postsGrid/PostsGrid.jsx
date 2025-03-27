import {useReadSpeed} from "../../hooks/useReadSpeed.js";
import {calcReadTime} from "../../helpers/postHelpers.js";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import BackupButton from "../buttons/BackupButton.jsx";
import BackupDropdown from "../dropdowns/BackupDropdown.jsx";
import styles from "./PostsGrid.module.css";
import buttonStyles from "../buttons/Button.module.css";
import {createManualBackup, restoreBackup, getDeletedPosts} from "../../services/backupService.js";
import DeleteButton from "../buttons/DeleteButton.jsx";
import {removePost} from "../../helpers/postHelpers.js";
import RecoverPostsDropdown from "../dropdowns/RecoverPostsDropdown.jsx";
import {useData, DATA_ACTIONS} from "../../contexts/DataContext.jsx";
import ReadSpeedSelector from "../ReadSpeedSelector.jsx";

function PostsGrid() {
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
        offlineMode,
        syncStatus,
        dispatch,
        loadPosts,
        checkServerConnection
    } = useData();

    const {readSpeed} = useReadSpeed();
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    // Effect om het aantal verwijderde posts bij te werken wanneer dit component mount
    useEffect(() => {
        const deletedPosts = getDeletedPosts();
        dispatch({
            type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT,
            payload: deletedPosts.length
        });
    }, [dispatch]);

    const handleDeletePost = async (postId) => {
        try {
            // Zoek eerst de post op in de huidige lijst voordat we deze verwijderen
            const postToDelete = posts.find(post => post.id === postId);

            if (!postToDelete) {
                dispatch({
                    type: DATA_ACTIONS.LOAD_POSTS_ERROR,
                    payload: "De post kon niet worden gevonden"
                });
                return;
            }

            // Update de UI direct door de post uit de state te verwijderen
            dispatch({type: DATA_ACTIONS.DELETE_POST, payload: postId});

            // Probeer de post te verwijderen van de server
            const result = await removePost(postId);

            if (!result) {
                console.warn("De post kon niet worden verwijderd van de server, maar blijft verborgen in de UI");
            }
        } catch (e) {
            console.error("Fout bij het verwijderen van post:", e);
            dispatch({
                type: DATA_ACTIONS.LOAD_POSTS_ERROR,
                payload: "Er is een fout opgetreden bij het verwijderen. De post blijft verborgen maar probeer later opnieuw."
            });
        }
    };

    const handleRestorePost = (restoredPost) => {
        // Voeg de herstelde post toe aan de context
        dispatch({type: DATA_ACTIONS.RESTORE_POST, payload: restoredPost});
    };

    const handleRestoreBackup = (backupData) => {
        if (backupData) {
            // Herstel de backup via de context
            dispatch({
                type: DATA_ACTIONS.RESTORE_BACKUP,
                payload: {data: backupData, timestamp: new Date().toISOString()}
            });
        }
    };

    const handleBackupCreated = (backup) => {
        console.log("Nieuwe backup gemaakt:", backup);
        // Update lastBackupCreated in de context om BackupDropdown te laten re-renderen
        dispatch({type: DATA_ACTIONS.CREATE_BACKUP});
    };

    const handleRefresh = async () => {
        await loadPosts(true);
    };

    const handleCheckConnection = async () => {
        setIsCheckingConnection(true);

        try {
            const isAvailable = await checkServerConnection();

            if (isAvailable && offlineMode) {
                // Als de server nu beschikbaar is maar we waren in offline modus
                dispatch({type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: false});
                await loadPosts(true);
            } else if (isAvailable) {
                // Als de server al beschikbaar was
                await loadPosts(true);
            } else {
                // Server is nog steeds niet beschikbaar
                dispatch({type: DATA_ACTIONS.SET_OFFLINE_MODE, payload: true});
            }
        } catch (e) {
            console.error("Fout bij het controleren van de verbinding:", e);
        } finally {
            setIsCheckingConnection(false);
        }
    };

    // Render states
    if (loading) return <p className={styles.loadingMessage}>Posts laden...</p>;

    return (
        <div>
            <div className={styles.postsHeader}>
                <h2>
                    Alle Posts
                    {usingBackup && " (uit backup)"}
                    {offlineMode && (
                        <span className={styles.offlineIndicator}> (Offline Modus)</span>
                    )}
                </h2>
                <div className={styles.postStats}>
                    <p>Totaal aantal posts: {posts.length}</p>
                    {deletedPostsCount > 0 && (
                        <p className={styles.deletedPostsCounter}>
                            Verwijderde posts: {deletedPostsCount}
                        </p>
                    )}
                    <div className={styles.connectionControls}>
                        <button
                            className={`${buttonStyles.actionButton} ${styles.refreshButton}`}
                            onClick={handleRefresh}
                            disabled={loading || isCheckingConnection}
                        >
                            {loading ? "Bezig..." : "Vernieuwen"}
                        </button>
                        <button
                            className={`${buttonStyles.actionButton} ${offlineMode ? styles.reconnectButton : styles.onlineButton}`}
                            onClick={handleCheckConnection}
                            disabled={isCheckingConnection}
                        >
                            {isCheckingConnection
                                ? "Controleren..."
                                : offlineMode
                                    ? "Verbinding controleren"
                                    : "Online"
                            }
                        </button>
                    </div>
                </div>
                {backupTimestamp && (
                    <p className={styles.backupInfo}>
                        Backup van: {new Date(backupTimestamp).toLocaleString()}
                    </p>
                )}
                {syncStatus === 'failed' && (
                    <p className={styles.syncError}>
                        Laatste synchronisatie met server mislukt. Wijzigingen zijn wel lokaal opgeslagen.
                    </p>
                )}
                {syncStatus === 'syncing' && (
                    <p className={styles.syncMessage}>
                        Bezig met synchroniseren...
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
                <RecoverPostsDropdown onRestore={handleRestorePost}/>
                <Link to="/settings" className={`${buttonStyles.settingsLink} ${buttonStyles.rightAlignedButton}`}>
                    Instellingen
                </Link>
            </div>
            <ReadSpeedSelector/>
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
        </div>
    );
}

export default PostsGrid;
