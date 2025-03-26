// In src/components/dropdowns/RecoverPostsDropdown.jsx
import {useState, useEffect, useRef} from 'react';
import {getDeletedPosts} from '../../services/backupService.js';
import {restoreDeletedPost} from '../../helpers/postHelpers.js';
import styles from './Dropdown.module.css';

function RecoverPostsDropdown({onRestore}) {
    const [isOpen, setIsOpen] = useState(false);
    const [deletedPosts, setDeletedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Laad verwijderde posts wanneer dropdown wordt geopend
    useEffect(() => {
        if (isOpen) {
            setDeletedPosts(getDeletedPosts());
        }
    }, [isOpen]);

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
            setDeletedPosts(prev => prev.filter(p => p.id !== post.id));
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

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
                className={styles.dropdownToggle}
                onClick={handleToggle}
                disabled={loading}
            >
                Verwijderde posts {deletedPosts.length > 0 && `(${deletedPosts.length})`}
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <h3 className={styles.dropdownTitle}>Verwijderde posts</h3>

                    {deletedPosts.length === 0 ? (
                        <p className={styles.emptyMessage}>
                            Geen verwijderde posts gevonden.
                        </p>
                    ) : (
                        <ul className={styles.postsList}>
                            {deletedPosts.map(post => (
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

export default RecoverPostsDropdown;
