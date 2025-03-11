import ReadSpeedSelector from "../components/ReadSpeedSelector";
import {useReadSpeed} from "../contexts/ReadSpeedContext.jsx";

import {calcReadTime, getAllPosts} from "../helpers/postHelpers";
import {Link} from "react-router-dom";

export function Posts() {
    const { readSpeed } = useReadSpeed();
    const posts = getAllPosts();

    return (
        <div className="posts-page">
            <h1>Alle Posts</h1>
            <ReadSpeedSelector />

            <p>Totaal aantal posts: {posts.length}</p>

            <ul className="posts-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <Link to={`/posts/${post.id}`}>
                            <h3>{post.title} ({calcReadTime(post.content, readSpeed)} minuten)</h3>
                            <p>{post.author}</p>
                            <p>{post.comments} reacties - {post.shares} keer gedeeld</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
