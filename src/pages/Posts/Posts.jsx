import ReadSpeedSelector from "../../components/ReadSpeedSelector.jsx";
import styles from "../../components/postsGrid/PostsGrid.module.css";
import PageLayout from '../../components/pageLayOut/PageLayout.jsx';
import PostsGrid from "../../components/postsGrid/PostsGrid.jsx";

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


    return (
        <PageLayout className={styles.postsPage}>

            <PostsGrid/>
            <ReadSpeedSelector/>

        </PageLayout>
    );
}
/* If the .postItem class is in another CSS module */
