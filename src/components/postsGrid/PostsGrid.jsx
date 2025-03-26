import {useReadSpeed} from "../../hooks/useReadSpeed.js";
import {calcReadTime, getLocalPostCount} from "../../helpers/postHelpers.js";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import BackupButton from "../buttons/BackupButton.jsx";
import RestoreBackupButton from "../buttons/RestoreBackupButton.jsx";
import ResetBackupButton from "../buttons/ResetBackupButton.jsx";
import styles from "./PostsGrid.module.css";
import buttonStyles from "../buttons/Button.module.css";
import {fetchPosts} from "../../services/postsFetchService.js";
import {getLatestBackup, isBackupInitialized, saveInitialBackup} from "../../services/backupService.js";
import PageLayout from "../pageLayOut/PageLayout.jsx";
import DeleteButton from "../buttons/DeleteButton.jsx";
import { removePost } from "../../helpers/postHelpers.js";
import RecoverPostsDropdown from "../dropdowns/RecoverPostsDropdown.jsx";

function PostsGrid() {
    // Dummy tags voor placeholders
    const dummyTags = [
        ['Reizen', 'Europa', 'Cultuur'],
        ['Backpacken', 'Azië', 'Budget'],
        ['Citytrip', 'Weekend', 'Luxe'],
        ['Natuur', 'Wandelen', 'Buiten'],
        ['Eten', 'Lokaal', 'Culinair']
    ];
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usingBackup, setUsingBackup] = useState(false);
    const [backupTimestamp, setBackupTimestamp] = useState(null);
    const {readSpeed} = useReadSpeed();
    const [postCount, setPostCount] = useState(getLocalPostCount());
    const [hoveredPostId, setHoveredPostId] = useState(null); // New state

    const handleDeletePost = async (postId) => {
        try {
            await removePost(postId);
            // Update de posts lijst door de verwijderde post eruit te filteren
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            // Update de postCount
            setPostCount(prevCount => prevCount - 1);
        } catch (e) {
            console.error("Fout bij het verwijderen van post:", e);
            setError("De post kon niet worden verwijderd. Probeer het opnieuw.");
        }
    };

    const handleRestorePost = (restoredPost) => {
        // Voeg de herstelde post toe aan de huidige lijst
        setPosts(prevPosts => [...prevPosts, restoredPost]);
        // Update de postCount
        setPostCount(prevCount => prevCount + 1);
    };


    useEffect(() => {
        const controller = new AbortController();

        async function loadPosts() {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchPosts({signal: controller.signal});

                if (data) {
                    setPosts(data);

                    if (!isBackupInitialized()) {
                        saveInitialBackup(data);
                    }
                    setUsingBackup(false);
                    setBackupTimestamp(null);
                    setPostCount(data.length);

                }
            } catch (e) {
                console.error("Fout bij het ophalen van de posts", e);
                setError("Kon posts niet laden. Probeer de backup te herstellen.");

                // Controleer of we al een backup laten zien
                if (!usingBackup) {
                    handleRestoreFromBackup();

                }
            } finally {
                setLoading(false);
            }
        }

        loadPosts();

        return () => {
            controller.abort();

        };
    }, []);

    // Functie om posts uit backup te herstellen
    const handleRestoreFromBackup = () => {
        const backup = getLatestBackup();

        if (backup && backup.data) {
            setPosts(backup.data);
            setUsingBackup(true);
            setBackupTimestamp(backup.timestamp);
            setPostCount(backup.data.length);
            setError(null);
        }
    };

    // Functie om backup te maken
    const handleBackupCreated = (backup) => {
        console.log("Nieuwe backup gemaakt:", backup);
    };


    // Functie om uit backup te resetten
    const handleBackupReset = (backup) => {
        if (usingBackup) {
            setPosts(backup.data);
            setBackupTimestamp(backup.timestamp);
        }
    }

    // Render states
    if (loading) return <p>Posts laden...</p>;
    if (error) return <p className={styles.errorMessage}>{error}</p>;

    return (
        <div>
            <div className={styles.postsHeader}>
                <h2>Alle Posts {usingBackup && "(uit backup)"}</h2>
                <p>Totaal aantal posts: {postCount}</p>
                <i>(Ververs pagina om nieuwe posts te zien)</i>
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
                <RestoreBackupButton
                    onRestore={data => {
                        setPosts(data);
                        setUsingBackup(true);
                        const backup = getLatestBackup();
                        setBackupTimestamp(backup?.timestamp || null);
                    }}
                />
                <ResetBackupButton onBackupReset={handleBackupReset}/>
                <RecoverPostsDropdown onRestore={handleRestorePost}/>
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

export default PostsGrid;
