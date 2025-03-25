import {useReadSpeed} from "../../hooks/useReadSpeed.js";
import {calcReadTime, getLocalPostCount, getPostCount} from "../../helpers/postHelpers.js";
import {Link} from "react-router-dom";
import styles from "./PostsGrid.module.css";
import {useEffect, useState} from "react";
import {getPostsWithFallback} from "../../services/postsFetchService.js";
import RestoreBackupButton from "../buttons/RestoreBackupButton.jsx";


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
    const {readSpeed} = useReadSpeed();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postCount, setPostCount] = useState(getLocalPostCount())
    const [usingBackup, setUsingBackup] = useState(false);



        async function fetchPosts(useBackup = false) {
            try {
                setLoading(true);
                const data = await getPostsWithFallback(useBackup);
                if (data) {
                    setPosts(data);
                    setUsingBackup(useBackup)
                }
            } catch (e) {
                console.error("Error fetching posts", e);
                setError("Failed to load posts")
            } finally {
                setLoading(false);
            }


        }

    useEffect(() => {
        const controller = new AbortController();


        fetchPosts();

        async function fetchPostCount() {
            try {
                const count = await getPostCount();
                setPostCount(count)
            } catch (e) {
                console.error("failed to get post count", error)
            }
        }

        fetchPostCount();


        return () => {
            controller.abort();
        }
    }, []);

    // Render states
    if (loading) return <p>loading posts ...</p>;
    if (error) return <p>{error}</p>;

    return (

        <>
            <p>Totaal aantal posts: {postCount} {usingBackup && "(uit backup)"}</p>
            <ul className="posts-list">
                {Array.isArray(posts) && posts.length > 0 ? posts.map((post, index) => (
                    posts && (
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
                    )
                )) : <p>No Posts found</p>}
            </ul>
            <RestoreBackupButton onRestore={fetchPosts}/>

        </>
    )
}

export default PostsGrid;
