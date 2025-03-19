import ReadSpeedSelector from "../../components/ReadSpeedSelector.jsx";
import {useReadSpeed} from "../../hooks/useReadSpeed.js";
import {calcReadTime, getAllPosts, getPostCount} from "../../helpers/postHelpers.js";
import {Link} from "react-router-dom";
import styles from "./Posts.module.css";
import PageLayout from '../../components/PageLayOut/PageLayout.jsx';

/**
 * @typedef {object} Post
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} [author]
 * @property {number} [comments]
 * @property {number} [shares]
 */

export function Posts() {
    const {readSpeed} = useReadSpeed();
    /** @type {Post[]} */
    const posts = getAllPosts();
    
    // Dummy tags voor placeholders
    const dummyTags = [
        ['Reizen', 'Europa', 'Cultuur'],
        ['Backpacken', 'Azië', 'Budget'],
        ['Citytrip', 'Weekend', 'Luxe'],
        ['Natuur', 'Wandelen', 'Buiten'],
        ['Eten', 'Lokaal', 'Culinair']
    ];

    return (
        <PageLayout className={styles.postsPage}>
            <h1>Alle Posts</h1>
            <ReadSpeedSelector/>

            <p>Totaal aantal posts: {getPostCount()}</p>

            <ul className="posts-list">
                {posts.map((post, index) => (
                    <li key={post.id} className="post-item">
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
                ))}
            </ul>
        </PageLayout>
    );
}
