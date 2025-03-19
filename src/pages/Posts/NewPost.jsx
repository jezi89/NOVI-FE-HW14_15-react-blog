import PostForm from "../../components/PostForm/PostForm.jsx";
import PageLayout from '../../components/PageLayOut/PageLayout.jsx';

export function NewPost() {
    return (
        <PageLayout className="new-post-page">
        <PostForm />
        </PageLayout>
    );
}
