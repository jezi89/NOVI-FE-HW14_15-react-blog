// In src/components/dropdowns/RecoverPostsDropdownOffline.jsx
import {useState, useEffect, useRef} from 'react';
import {getDeletedPosts} from '../../services/backupService.js';
import {useData} from '../../contexts/OfflineDataContext.jsx';
import styles from './Dropdown.module.css';

function RecoverPostsDropdownOffline() {
    const [isOpen, setIsOpen] = useState(false);
    const [localDeletedPosts, setLocalDeletedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    
    // Gebruik de context
    const { 
        deletedPostsCount, 
        dispatch, 
        optimisticRestorePost 
    } = useData();

    // Effect om de lokale lijst van verwijderde posts te laden
    // wanneer dropdown wordt geopend of deletedPostsCount verandert
    useEffect(() => {
        if (isOpen || deletedPostsCount > 0) {
            const posts = getDeletedPosts();
            setLocalDeletedPosts(posts);
        }
    }, [isOpen, deletedPostsCount]);

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
            // Gebruik optimistic restore functie uit context
            await optimisticRestorePost(post);
            
            // Update lokale lijst van verwijderde posts
            setLocalDeletedPosts(prev => prev.filter(p => p.id !== post.id));
            
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
    const showCount = deletedPostsCount > 0;
    const badgeClass = showCount ? styles.countBadge : '';

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
                className={`${styles.dropdownToggle} ${showCount ? styles.hasItems : ''}`}
                onClick={handleToggle}
                disabled={loading}
            >
                Verwijderde posts
                {showCount && (
                    <span className={badgeClass}>{deletedPostsCount}</span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <h3 className={styles.dropdownTitle}>Verwijderde posts</h3>

                    {localDeletedPosts.length === 0 ? (
                        <p className={styles.emptyMessage}>
                            Geen verwijderde posts gevonden.
                        </p>
                    ) : (
                        <ul className={styles.postsList}>
                            {localDeletedPosts.map(post => (
                                <li key={post.id} className={styles.postItem}>
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

export default RecoverPostsDropdownOffline;
