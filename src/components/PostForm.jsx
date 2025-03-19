import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import './PostForm.css';

function PostForm() {
    const navigate = useNavigate();

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            // Extract form values
            const title = formData.get("title");
            const subtitle = formData.get("subtitle");
            const content = formData.get("content");
            const author = formData.get("author");

            // Validate input fields
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

            // If there are validation errors, return them
            if (Object.keys(errors).length > 0) {
                return { type: "error", errors };
            }

            // Calculate read time (words * 0.3 / 100)
            const wordCount = content.trim().split(/\s+/).length;
            const readTimeRaw = wordCount * 0.3 / 100;
            const readTime = Math.round(readTimeRaw);

            // Create the complete post object
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

            // Log the complete post to console
            console.log(completePost);

            // Wait a bit to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1000));

            // After successful submission, redirect to posts page
            navigate("/posts");

            return {
                type: "success",
                message: "Post succesvol aangemaakt!"
            };
        },
        null // Initial state
    );

    // Helper function to determine if a field has an error
    const getFormGroupClassName = (fieldName) => {
        if (!result?.errors) return "form-group";
        return result.errors[fieldName] 
            ? "form-group has-error" 
            : "form-group has-success";
    };

    return (
        <div className="form-container">
            <h2>Nieuwe Blogpost</h2>

            {result?.type === "success" && (
                <p className="success-message">{result.message}</p>
            )}

            {isPending && <p className="loading">Bezig met verzenden...</p>}

            <form action={submitAction}>
                <div className={getFormGroupClassName("title")}>
                    <label htmlFor="title">Titel</label>
                    <input type="text" id="title" name="title" />
                    {result?.errors?.title && (
                        <span className="error">{result.errors.title}</span>
                    )}
                </div>

                <div className={getFormGroupClassName("subtitle")}>
                    <label htmlFor="subtitle">Ondertitel</label>
                    <input type="text" id="subtitle" name="subtitle" />
                    {result?.errors?.subtitle && (
                        <span className="error">{result.errors.subtitle}</span>
                    )}
                </div>

                <div className={getFormGroupClassName("author")}>
                    <label htmlFor="author">Auteur</label>
                    <input type="text" id="author" name="author" />
                    {result?.errors?.author && (
                        <span className="error">{result.errors.author}</span>
                    )}
                </div>

                <div className={getFormGroupClassName("content")}>
                    <label htmlFor="content">Bericht</label>
                    <textarea id="content" name="content" rows="10"></textarea>
                    {result?.errors?.content && (
                        <span className="error">{result.errors.content}</span>
                    )}
                </div>

                <button type="submit" disabled={isPending}>
                    {isPending ? 'Bezig met verzenden...' : 'Verzenden'}
                </button>
            </form>
        </div>
    );
}

export default PostForm;
