import {Link, useParams} from "react-router-dom";
import formatDate from "../helpers/formatDate.js";
import {calcReadTime, getPostById} from "../helpers/postHelpers.js";


function SinglePost() {
    const {id} = useParams();
    const post = getPostById(id);

    if (!post) {
        return (
            <div>
                <p>Post not found</p>
                <Link to="/posts">Ga terug naar de overzichtspagina</Link>
            </div>


        )
    }
    const { title, subtitle, content, author, created, comments, shares } = post;
    const readingTime = calcReadTime(post.content)

return (
    <div className="post-container">
        <article>
            <h1>{title} <time>({readingTime}) minuten </time></h1>
            <h2>{subtitle}</h2>
            <p>Geschreven door {author} op <time>{formatDate(created)}</time></p>

            <div className="post-content">
                <p>{content}</p>
            </div>

            <div className="post-stats">
                <p>{comments} reacties - {shares} keer gedeeld</p>
            </div>
        </article>

        <Link to="/posts">Terug naar de overzichtspagina</Link>
    </div>
)}

export default SinglePost;
