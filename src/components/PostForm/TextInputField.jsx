// TextInputField.jsx
function TextInputField({id, name, label, value, onChange, error, styles, ...props}) {
    return (
        <div className={`${styles.formField} ${error ? styles.hasError : ''}`}>
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? styles.inputError : ""}
                {...props}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default TextInputField;
