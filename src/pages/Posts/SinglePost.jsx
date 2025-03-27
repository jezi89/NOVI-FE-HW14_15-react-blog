import {Link, useParams} from "react-router-dom";
import formatDate from "../../helpers/formatDate.js";
import {calcReadTime} from "../../helpers/postHelpers.js";
import PageLayout from '../../components/pageLayOut/PageLayout.jsx';
import './SinglePost.css';
import {useEffect, useState} from "react";
import {useData} from "../../contexts/DataContext.jsx";
import {fetchPostById} from "../../services/postsFetchService.js";

function SinglePost() {
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Gebruik de context om toegang te krijgen tot alle posts en status
    const {
        posts,
        offlineMode,
        usingBackup,
        backupTimestamp
    } = useData();

    useEffect(() => {
        async function loadPost() {
            setLoading(true);
            setError(null);
            
            try {
                // Probeer eerst de post te vinden in de context (local-first approach)
                const localPost = posts.find(p => p.id == id); // == want id kan string zijn van URL param
                
                if (localPost) {
                    console.log("Post gevonden in context:", localPost);
                    setPost(localPost);
                    setLoading(false);
                    return;
                }
                
                // Als we offline zijn of een backup gebruiken en de post niet in de context staat
                if (offlineMode || usingBackup) {
                    throw new Error("Post niet gevonden in lokale data");
                }
                
                // Als de post niet in de context staat en we zijn online, probeer deze van de server te halen
                console.log("Post niet gevonden in context, ophalen van server...");
                const postData = await fetchPostById(id);
                
                if (postData) {
                    setPost(postData);
                } else {
                    throw new Error("Post niet gevonden op de server");
                }
            } catch (e) {
                console.error("Post kan niet worden geladen:", e);
                setError(e.message || "Post kon niet worden geladen");
            } finally {
                setLoading(false);
            }
        }

        loadPost().catch(e => console.error("Onbehandelde fout in loadPost:", e));
    }, [id, posts, offlineMode, usingBackup]);

    if (loading) {
        return (
            <PageLayout>
                <div className="post-container">
                    <div className="loading-indicator">
                        <span className="loading-spinner"></span>
                        <p>Post laden...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (error || !post) {
        return (
            <PageLayout>
                <div className="post-container">
                    <div className="post-not-found">
                        <h2>Post niet gevonden</h2>
                        <p>De opgevraagde blogpost kon niet worden gevonden.</p>
                        {offlineMode && (
                            <p className="offline-warning">
                                Je bent momenteel offline. Controleer je internetverbinding of ga terug naar de overzichtspagina.
                            </p>
                        )}
                        <Link to="/posts" className="back-link">
                            <span>←</span> Ga terug naar de overzichtspagina
                        </Link>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const {title, subtitle, content, author, created, comments, shares} = post;
    const readingTime = calcReadTime(post.content);

    // Dummy tags voor de placeholder
    const dummyTags = ['Reizen', 'Europa', 'Backpacken', 'Budget Tips', 'Cultuur'];

    // Eerste paragraaf voor speciale styling
    const paragraphs = content.split('\n\n');
    const firstParagraph = paragraphs[0];
    const restContent = paragraphs.slice(1).join('\n\n');

    return (
        <PageLayout>
            <div className="post-container">
                {offlineMode && (
                    <div className="offline-badge">
                        Offline modus - Lokale versie wordt weergegeven
                    </div>
                )}
                
                {usingBackup && backupTimestamp && (
                    <div className="backup-badge">
                        Backup versie van {new Date(backupTimestamp).toLocaleString()}
                    </div>
                )}
                
                <article>
                    <div className="post-header">
                        <h1 className="post-title">{title}</h1>
                        <h2 className="post-subtitle">{subtitle}</h2>

                        <div className="post-meta">
                            <div className="post-author">
                                <img
                                    src="https://i.pravatar.cc/150?img=12"
                                    alt={author}
                                    className="author-avatar"
                                />
                                <span className="author-name">{author}</span>
                            </div>

                            <div className="post-date">
                                <span>📅</span>
                                <time>{formatDate(created)}</time>
                            </div>

                            <div className="post-readtime">
                                <span>⏱️</span>
                                <span>{readingTime}</span>
                            </div>
                        </div>

                        <div className="post-tags">
                            {dummyTags.map((tag, index) => (
                                <span key={index} className="post-tag">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="post-content">
                        <p className="first-paragraph">{firstParagraph}</p>

                        {/* Google Maps placeholder */}
                        <div className="map-container">
                            <div className="map-placeholder">
                                <span className="map-placeholder-icon">📍</span>
                                <span>Kaart van de locatie</span>
                                <span>Hier zou een interactieve Google Maps komen</span>
                            </div>
                        </div>

                        {restContent.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    <div className="post-stats">
                        <div className="post-stats-item">
                            <span>💬</span>
                            <span>{comments} reacties</span>
                        </div>

                        <div className="post-stats-item">
                            <span>🔄</span>
                            <span>{shares} keer gedeeld</span>
                        </div>

                        <div className="post-actions">
                            <button className="post-action-btn" disabled={offlineMode}>
                                <span>👍</span> Like
                            </button>
                            <button className="post-action-btn" disabled={offlineMode}>
                                <span>📢</span> Deel
                            </button>
                        </div>
                    </div>
                </article>

                <Link to="/posts" className="back-link">
                    <span>←</span> Terug naar de overzichtspagina
                </Link>

                {/* Gerelateerde posts sectie */}
                <section className="related-posts">
                    <h3>Gerelateerde artikelen</h3>
                    <div className="related-posts-grid">
                        {posts.length > 1 ? (
                            // Toon maximaal 3 willekeurige posts (behalve de huidige)
                            posts
                                .filter(p => p.id != id) // != want id kan string zijn
                                .sort(() => 0.5 - Math.random()) // Willekeurige sortering
                                .slice(0, 3)
                                .map(relatedPost => (
                                    <div key={relatedPost.id} className="related-post">
                                        <Link to={`/posts/${relatedPost.id}`}>
                                            <h4>{relatedPost.title}</h4>
                                            <p>{relatedPost.subtitle}</p>
                                        </Link>
                                    </div>
                                ))
                        ) : (
                            <div className="related-post-placeholder">
                                <p>Geen gerelateerde artikelen beschikbaar</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default SinglePost;
