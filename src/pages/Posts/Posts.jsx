import ReadSpeedSelector from "../../components/ReadSpeedSelector.jsx";
import {useReadSpeed} from "../../hooks/useReadSpeed.js";
import {calcReadTime, getAllPosts, getPostCount} from "../../helpers/postHelpers.js";
import {Link} from "react-router-dom";
import styles from "./Posts.module.css";


// JSDoc is een manier om typeannotaties en documentatie toe te voegen aan standaard JavaScript-code en dient als een alternatief voor TypeScript-typen. Het stelt je in staat om type-informatie te verstrekken die IDE's en andere tools kunnen gebruiken voor code-aanvulling, validatie en refactoring, zonder dat de code gecompileerd hoeft te worden zoals bij TypeScript.
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

    return (
        <section>
            <div className={`global-class ${styles.postsPage}`}>
                <h1>Alle Posts </h1>
                <ReadSpeedSelector/>

                <p>Totaal aantal posts: {getPostCount()}</p>

                <ul className="posts-list">
                    {posts.map(
                        /** @param {Post} post */
                        (post) => (
                            <li key={post.id} className="post-item">
                                <Link to={`/posts/${post.id}`}>
                                    <h3 className={styles.postTitle}>{post.title}</h3>
                                    <h4>(Leestijd: {calcReadTime(post.content, readSpeed)})</h4>
                                    <p>{post?.author ? `Geschreven door: ${post.author}` : 'Onbekend'}</p>
                                    <p>{post?.comments ?? 0} reacties - {post?.shares ?? 0} keer gedeeld</p>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </section>
    );
}
