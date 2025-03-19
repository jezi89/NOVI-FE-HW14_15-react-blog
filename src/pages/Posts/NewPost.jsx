import PostForm from "../../components/PostForm.jsx";
import PageLayout from '../../components/PageLayout';

export function NewPost() {
    return (
        <PageLayout className="new-post-page">
        <PostForm />
        </PageLayout>
    );
}
