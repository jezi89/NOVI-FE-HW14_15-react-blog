// TextAreaField.jsx
function TextAreaField({ id, name, label, value, onChange, error, styles, required, hint, inputProps = {} }) {
    const textareaId = id || name;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    
    // Combineer aria attributes
    const ariaProps = {
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined,
        'aria-required': required ? 'true' : undefined
    };
    
    return (
        <div className={`${styles.formField} ${error ? styles.hasError : ''}`}>
            <label htmlFor={textareaId} className={styles.formLabel}>
                {label}
                {required && <span className={styles.requiredMark}>*</span>}
            </label>
            
            <textarea
                id={textareaId}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? styles.inputError : styles.formTextarea}
                required={required}
                {...ariaProps}
                {...inputProps}
            ></textarea>
            
            {hint && <p id={hintId} className={styles.formHint}>{hint}</p>}
            {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
        </div>
    );
}

export default TextAreaField;
