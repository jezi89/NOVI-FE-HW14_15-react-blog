import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TextInputField from './TextInputField';
import TextAreaField from './TextAreaField';
import styles from './PostForm.module.css';
import { calculateReadTimeinMinutes, createPost } from "../../helpers/postHelpers.js";
import { useData } from "../../contexts/DataContext.jsx";

function PostForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formResult, setFormResult] = useState(null);

    // Gebruik DataContext om te weten of we in offline modus zijn
    const { offlineMode, loadPosts } = useData();

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setFormResult(null);

        // Valideer input velden
        const errors = {};
        if (!title?.trim()) errors.title = "Titel is verplicht";
        if (!subtitle?.trim()) errors.subtitle = "Ondertitel is verplicht";
        if (!author?.trim()) errors.author = "Auteur is verplicht";

        if (!content?.trim()) {
            errors.content = "Bericht is verplicht";
        } else if (content.length < 30) {
            errors.content = "Bericht moet minimaal 30 karakters bevatten";
        } else if (content.length > 2000) {
            errors.content = "Bericht mag maximaal 2000 karakters bevatten";
        }

        // Als er validatiefouten zijn, geef ze weer
        if (Object.keys(errors).length > 0) {
            setFormResult({ type: "error", errors });
            setIsSubmitting(false);
            return;
        }

        // Bereken leestijd
        const readTime = calculateReadTimeinMinutes(content);

        // Maak het volledige post object
        const completePost = {
            title,
            subtitle,
            content,
            author,
            created: new Date().toISOString(),
            readTime,
            comments: 0,
            shares: 0
        };

        try {
            // Gebruik de createPost functie die we hebben aangepast voor offline werking
            const newPost = await createPost(completePost);

            // Herlaad de posts in de context om de nieuwe post direct weer te geven
            await loadPosts(true);

            setFormResult({
                type: "success",
                message: offlineMode ?
                    "Post succesvol lokaal opgeslagen! (Je bent offline)" :
                    "Post succesvol aangemaakt!"
            });

            // Na succesvolle indiening, navigeer naar de detailpagina of posts overzicht
            if (newPost && newPost.id) {
                setTimeout(() => navigate(`/posts/${newPost.id}`), 1500);
            } else {
                setTimeout(() => navigate('/posts'), 1500);
            }
        } catch (e) {
            console.error("Fout bij het opslaan van de post:", e);
            setFormResult({
                type: "error",
                message: "Er ging iets mis bij het opslaan van de post."
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Nieuwe Blogpost</h2>

            {offlineMode && (
                <div className={styles.offlineWarning}>
                    Je bent offline. De post wordt lokaal opgeslagen en gesynchroniseerd
                    zodra je weer online bent.
                </div>
            )}

            {formResult?.type === "success" && (
                <p className={styles.successMessage}>{formResult.message}</p>
            )}

            {formResult?.type === "error" && formResult.message && (
                <p className={styles.errorMessage}>{formResult.message}</p>
            )}

            {isSubmitting && <p className={styles.loading}>Bezig met verzenden...</p>}

            <form onSubmit={handleSubmit}>
                <TextInputField
                    id="title"
                    name="title"
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={formResult?.errors?.title}
                    styles={styles}
                />

                <TextInputField
                    id="subtitle"
                    name="subtitle"
                    label="Ondertitel"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    error={formResult?.errors?.subtitle}
                    styles={styles}
                />

                <TextInputField
                    id="author"
                    name="author"
                    label="Auteur"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    error={formResult?.errors?.author}
                    styles={styles}
                />

                <TextAreaField
                    id="content"
                    name="content"
                    label="Bericht"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    error={formResult?.errors?.content}
                    styles={styles}
                    inputProps={{ rows: 10 }}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? 'Bezig met verzenden...' : (offlineMode ? 'Lokaal opslaan' : 'Verzenden')}
                </button>
            </form>
        </div>
    );
}

export default PostForm;
