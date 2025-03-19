import React from 'react';
import InputField from './InputField';

/**
 * TextAreaField component - specifiek voor langere teksten
 * @param {Object} props - Component properties
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Label text
 * @param {Object} props.error - Error message from form validation
 * @param {Object} props.inputProps - Additional props for textarea element
 * @returns {JSX.Element}
 */
function TextAreaField({ id, name, label, error, inputProps = {} }) {
    // Default rows to 10 if not provided
    const defaultProps = { rows: 10, ...inputProps };
    
    return (
        <InputField
            id={id}
            name={name}
            label={label}
            type="textarea"
            error={error}
            inputProps={defaultProps}
        />
    );
}

export default TextAreaField;