// TextInputField.jsx
function TextInputField({id, name, label, value, onChange, error, styles, required, hint, ...props}) {
    const inputId = id || name;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    
    // Combineer aria attributes
    const ariaProps = {
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined,
        'aria-required': required ? 'true' : undefined
    };
    
    return (
        <div className={`${styles.formField} ${error ? styles.hasError : ''}`}>
            <label htmlFor={inputId} className={styles.formLabel}>
                {label}
                {required && <span className={styles.requiredMark}>*</span>}
            </label>
            
            <input
                type="text"
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? styles.inputError : styles.formInput}
                required={required}
                {...ariaProps}
                {...props}
            />
            
            {hint && <p id={hintId} className={styles.formHint}>{hint}</p>}
            {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
        </div>
    );
}

export default TextInputField;
