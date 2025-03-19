import React from 'react';
import InputField from './InputField';

/**
 * TextInputField component - specifiek voor tekstinvoer
 * @param {Object} props - Component properties
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Label text
 * @param {Object} props.error - Error message from form validation
 * @param {Object} props.inputProps - Additional props for input element
 * @returns {JSX.Element}
 */
function TextInputField({ id, name, label, error, inputProps = {} }) {
    return (
        <InputField
            id={id}
            name={name}
            label={label}
            type="text"
            error={error}
            inputProps={inputProps}
        />
    );
}

export default TextInputField;