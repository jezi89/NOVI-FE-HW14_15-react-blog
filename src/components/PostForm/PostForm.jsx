import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TextInputField from './TextInputField';
import TextAreaField from './TextAreaField';
import styles from './PostForm.module.css';
import { calculateReadTimeinMinutes, createPost } from "../../helpers/postHelpers.js";

function PostForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            // Extract form values
            const formTitle = formData.get("title");
            const formSubtitle = formData.get("subtitle");
            const formContent = formData.get("content");
            const formAuthor = formData.get("author");

            // Validate input fields
            const errors = {};
            if (!formTitle?.trim()) errors.title = "Titel is verplicht";
            if (!formSubtitle?.trim()) errors.subtitle = "Ondertitel is verplicht";
            if (!formAuthor?.trim()) errors.author = "Auteur is verplicht";

            if (!formContent?.trim()) {
                errors.content = "Bericht is verplicht";
            } else if (formContent.length < 30) {
                errors.content = "Bericht moet minimaal 30 karakters bevatten";
            } else if (formContent.length > 2000) {
                errors.content = "Bericht mag maximaal 2000 karakters bevatten";
            }

            // If there are validation errors, return them
            if (Object.keys(errors).length > 0) {
                return { type: "error", errors };
            }

            // Calculate read time
            const readTime = calculateReadTimeinMinutes(formContent);

            // Create the complete post object
            const completePost = {
                title: formTitle,
                subtitle: formSubtitle,
                content: formContent,
                author: formAuthor,
                created: new Date().toISOString(),
                readTime,
                comments: 0,
                shares: 0
            };

            try {
                const newPost = await createPost(completePost)

                // After successful submission, redirect to posts page
                navigate(`/posts/${newPost.id}`);

                return {
                    type: "success",
                    message: "Post succesvol aangemaakt!"
                };
            } catch (e) {
                return {
                    type: "error",
                    message: "Er ging iets mis bij het opslaan van de post."
                }
            }
        },
        null // Initial state
    );

    // Keep form data in sync with the form state
    useEffect(() => {
        if (result?.type === "error" && !isPending) {
            // Form was submitted but had validation errors
            // Don't update state here as we're using controlled components
        }
    }, [result, isPending]);

    return (
        <div className={styles.formContainer}>
            <h2>Nieuwe Blogpost</h2>

            {result?.type === "success" && (
                <p className={styles.successMessage}>{result.message}</p>
            )}

            {result?.type === "error" && result.message && (
                <p className={styles.errorMessage}>{result.message}</p>
            )}

            {isPending && <p className={styles.loading}>Bezig met verzenden...</p>}

            <form action={submitAction}>
                <TextInputField
                    id="title"
                    name="title"
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={result?.errors?.title}
                    styles={styles}
                />

                <TextInputField
                    id="subtitle"
                    name="subtitle"
                    label="Ondertitel"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    error={result?.errors?.subtitle}
                    styles={styles}
                />

                <TextInputField
                    id="author"
                    name="author"
                    label="Auteur"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    error={result?.errors?.author}
                    styles={styles}
                />

                <TextAreaField
                    id="content"
                    name="content"
                    label="Bericht"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    error={result?.errors?.content}
                    styles={styles}
                    inputProps={{ rows: 10 }}
                />

                <button type="submit" disabled={isPending}>
                    {isPending ? 'Bezig met verzenden...' : 'Verzenden'}
                </button>
            </form>
        </div>
    );
}

export default PostForm;
