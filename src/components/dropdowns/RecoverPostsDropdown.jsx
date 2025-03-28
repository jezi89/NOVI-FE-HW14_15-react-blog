import React, {useState, useEffect, useRef} from 'react';
import {getDeletedPosts} from '../../services/backupService.js';
import {restoreDeletedPost} from '../../helpers/postHelpers.js';
import {useData, DATA_ACTIONS} from '../../contexts/DataContext.jsx';
import styles from './Dropdown.module.css';
import buttonStyles from '../buttons/Button.module.css';

function RecoverPostsDropdown({onRestore}) {
    const [isOpen, setIsOpen] = useState(false);
    const [deletedPosts, setDeletedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // We halen de waardes uit de context in plaats van de state
    const {deletedPostsCount, dispatch} = useData();

    useEffect(() => {
        if (isOpen || deletedPostsCount > 0) {
            const posts = getDeletedPosts();
            setDeletedPosts(posts);
        }
    }, [isOpen, deletedPostsCount]);

    // Laad verwijderde posts wanneer dropdown wordt geopend
    useEffect(() => {
        if (isOpen) {
            const posts = getDeletedPosts();
            setDeletedPosts(posts);

            // Update de context met het aantal verwijderde posts
            dispatch({
                type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT,
                payload: posts.length
            });
        }
    }, [isOpen, dispatch]);

    // Bijwerken van verwijderde posts aantal bij mount
    useEffect(() => {
        const posts = getDeletedPosts();
        setDeletedPosts(posts);

        // Update de context met het aantal verwijderde posts
        dispatch({
            type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT,
            payload: posts.length
        });
    }, [dispatch]);

    // Sluit dropdown wanneer er buiten wordt geklikt
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleRestore = async (post) => {
        setLoading(true);
        try {
            const restoredPost = await restoreDeletedPost(post);

            // Verwijder post uit de lijst van verwijderde posts
            const updatedDeletedPosts = deletedPosts.filter(p => p.id !== post.id);
            setDeletedPosts(updatedDeletedPosts);

            // Update de context met het nieuwe aantal verwijderde posts
            dispatch({
                type: DATA_ACTIONS.UPDATE_DELETED_POSTS_COUNT,
                payload: updatedDeletedPosts.length
            });

            // Informeer de parent component
            if (onRestore) {
                onRestore(restoredPost);
            }

            alert(`Post "${post.title}" is hersteld!`);
        } catch (e) {
            console.error("Fout bij het herstellen van de post:", e);
            alert("De post kon niet worden hersteld. Probeer het opnieuw.");
        } finally {
            setLoading(false);
        }
    };

    // Formatteert datum voor weergave
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Bepaal badge styling en counter 
    const showCount = deletedPosts.length > 0;
    const badgeClass = showCount ? styles.countBadge : '';

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
                className={`${styles.dropdownToggle} ${showCount ? styles.hasItems : ''} ${loading ? buttonStyles.loading : ''}`}
                onClick={handleToggle}
                disabled={loading}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls="deleted-posts-menu"
                id="deleted-posts-button"
            >
                Verwijderde posts
                {!loading && <span className={styles.dropdownArrow}>▼</span>}
                {deletedPostsCount > 0 && (
                    <span className={badgeClass} aria-label={`${deletedPostsCount} verwijderde posts`}>
                        {deletedPostsCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div 
                    id="deleted-posts-menu"
                    className={styles.dropdownMenu}
                    role="menu"
                    aria-labelledby="deleted-posts-button"
                >
                    <h3 className={styles.dropdownTitle}>Verwijderde posts</h3>

                    {deletedPosts.length === 0 ? (
                        <p className={styles.emptyMessage}>
                            Geen verwijderde posts gevonden.
                        </p>
                    ) : (
                        <ul className={styles.postsList} role="menu">
                            {deletedPosts.map(post => (
                                <li 
                                    key={post.id} 
                                    className={styles.postItem}
                                    role="menuitem"
                                    tabIndex="0"
                                >
                                    <div className={styles.postInfo}>
                                        <h4 className={styles.postTitle}>{post.title}</h4>
                                        <p className={styles.postMeta}>
                                            <span className={styles.author}>{post.author}</span>
                                            <span className={styles.date}>
                                                Verwijderd op: {formatDate(post.deletedAt)}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        className={styles.restoreButton}
                                        onClick={() => handleRestore(post)}
                                        disabled={loading}
                                        aria-label={`Herstel post: ${post.title}`}
                                    >
                                        Herstellen
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default RecoverPostsDropdown;
