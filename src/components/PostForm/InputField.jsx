import React from 'react';

/**
 * Herbruikbare InputField component die verschillende typen input kan renderen
 * @param {Object} props - Component properties
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Label text
 * @param {string} props.type - Input type (text, textarea, etc.)
 * @param {Object} props.error - Error object from form validation
 * @param {Object} props.inputProps - Additional props for input element
 * @returns {JSX.Element}
 */
function InputField({ id, name, label, type = 'text', error, inputProps = {} }) {
    // Helper function to determine form-group class based on error
    const getFormGroupClassName = () => {
        if (!error) return "form-group";
        return error ? "form-group has-error" : "form-group has-success";
    };

    // Render the appropriate input based on type
    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea 
                        id={id} 
                        name={name} 
                        {...inputProps} 
                    />
                );
            default:
                return (
                    <input 
                        type={type} 
                        id={id} 
                        name={name} 
                        {...inputProps} 
                    />
                );
        }
    };

    return (
        <div className={getFormGroupClassName()}>
            <label htmlFor={id}>{label}</label>
            {renderInput()}
            {error && <span className="error">{error}</span>}
        </div>
    );
}

export default InputField;