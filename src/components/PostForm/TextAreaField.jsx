// TextAreaField.jsx
function TextAreaField({ id, name, label, value, onChange, error, styles, inputProps }) {
    return (
        <div className={`${styles.formField} ${error ? styles.hasError : ''}`}>
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? styles.inputError : ""}
                {...inputProps}
            ></textarea>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default TextAreaField;
