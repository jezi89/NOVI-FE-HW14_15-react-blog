import {Link, useParams} from "react-router-dom";
import formatDate from "../../helpers/formatDate.js";
import {calcReadTime, getPostById} from "../../helpers/postHelpers.js";
import PageLayout from '../../components/pageLayOut/PageLayout.jsx';
import './SinglePost.css';
import {useEffect, useState} from "react";

function SinglePost() {
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);
                const postData = await getPostById(id);
                setPost(postData);

            } catch (e) {
                console.error("Post kan niet worden geladen", e)
                setError("Failed to load the post");

            } finally {
                setLoading(false)
            }
        }

        loadPost().catch(e =>  console.error("Unhandled error in loadPost:", e));
    }, [id]);

    if (loading) {
        return (
            <PageLayout>
                <div className="post-conatiner">
                    <p>Loading post</p>
                </div>
            </PageLayout>
        )
    }


    if (error || !post) {
        return (
            <PageLayout>
            <div className="post-container">
                <div className="post-not-found">
                    <h2>Post niet gevonden</h2>
                    <p>De opgevraagde blogpost kon niet worden gevonden.</p>
                    <Link to="/posts" className="back-link">
                        <span>←</span> Ga terug naar de overzichtspagina
                    </Link>
                </div>
            </div>
            </PageLayout>

        )
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
                        <p>{firstParagraph}</p>

                        {/* Google Maps placeholder */}
                        <div className="map-container">
                            <div className="map-placeholder">
                                <span className="map-placeholder-icon">📍</span>
                                <span>Kaart van de locatie</span>
                                <span>Hier zou een interactieve Google Maps komen</span>
                            </div>
                        </div>

                        <p>{restContent}</p>
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
                            <button className="post-action-btn">
                                <span>👍</span> Like
                            </button>
                            <button className="post-action-btn">
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
                        {/* Placeholder voor gerelateerde posts */}
                        <div className="related-post-placeholder">
                            <p>Hier zouden gerelateerde artikelen verschijnen</p>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default SinglePost;
