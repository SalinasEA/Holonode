
// Validation rules mirroring the ones in the backend and
// returns error message if invalid, null if valid

// Returns an error if the field is empty or contains only whitespace
function required(fieldName: string) {
    return (value: string): string | null => {
        if (!value || value.trim() === '') {
            return `${fieldName} cannot be blank. Please try again.`;
        }
        return null
    };
}

// Returns an error if the field length is outside the specified min and max range
function length(min: number, max: number, fieldName: string) {
    return (value: string): string | null => {
        const len = value.length;
        if (len < min || len > max) {
            return `${fieldName} must be between ${min} and ${max} characters long. Please try again.`;
        }
        return null;
    }
}

// Returns an error if the field value does not match the provided regular expression
function pattern(regex: RegExp, message: string) {
    return (value: string): string | null => {
        if (!regex.test(value)) {
            return message;
        }
        return null;
    }
}

// Field validation rules, first failing rule returns error message

// Validates that username is present, between 4-32 characters, and contains only letters, numbers, and underscores
const usernameRules = [
    required('Username'),
    length(4, 32, 'Username'),
    pattern(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
]

// Validates that password is present, between 12-60 characters, and contains at least one number, uppercase letter, lowercase letter, and special character
const passwordRules = [
    required('Password'),
    length(12, 60, 'Password'),
    pattern(/^(?=.*\d).+/, 'Password must contain at least 1 number.'),
    pattern(/^(?=.*[A-Z]).+/, 'Password must contain at least 1 uppercase letter.'),
    pattern(/^(?=.*[a-z]).+/, 'Password must contain at least 1 lowercase letter.'),
    pattern(/^(?=.*[!@#$%^&*()_+\-=\[\]|;:'",.<>/?]).+/, 'Password must contain at least 1 special character.')
]

// Validates that confirm password field is not empty
const confirmPasswordRules = [
    required('Confirm Password')
]

// Runs each validation rule in order and returns the first error found or null if all pass
function validateField(rules: Array<(value: string) => string | null>, value: string): string | null {
    for (const rule of rules) {
        const error = rule(value);
        if (error) {
            return error;
        }
    }
    return null;
}

// Returns an error if the password and confirm password fields do not match
function validatePasswordMatch(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) {
        return 'Passwords do not match. Please try again.';
    }
    return null;
}

export { usernameRules, passwordRules, confirmPasswordRules, validateField, validatePasswordMatch }