
// Blur handlers that run when users interact with the form

import {
    confirmPasswordRules,
    passwordRules,
    usernameRules,
    validateField,
    validatePasswordMatch
} from "./validation-rules.ts";

// Shows an error message under a field and adds a red border to the field
function showError(inputId: string, messageId: string, errorText: string): void {
    const input = document.querySelector<HTMLInputElement>(`#${inputId}`);
    const messageEl = document.querySelector<HTMLParagraphElement>(`#${messageId}`);

    // If the input element is found, add a solid red border to it
    if (input) {
        input.style.border = '2px solid red';
    }

    // If the message element is found, displays the new error message and make it red
    if (messageEl) {
        messageEl.textContent = errorText;
        messageEl.style.color = 'red';
    }
}

// Clears the error message and red border from a field
function clearError(inputId: string, messageId: string): void {
    const input = document.querySelector<HTMLInputElement>(`#${inputId}`);
    const messageEl = document.querySelector<HTMLParagraphElement>(`#${messageId}`);

    // If the input element is found, remove the red border
    if (input) {
        input.style.border = '';
    }

    // If the message element is found, clear the error message and color
    if (messageEl) {
        messageEl.textContent = '';
        messageEl.style.color = '';
    }
}

// Validates a field and displays an error message if invalid, clears the error message if valid
function validateAndDisplay(
    inputId: string,
    messageId: string,
    rules: Array<(value: string) => string | null>
): boolean {
    const input = document.querySelector<HTMLInputElement>(`#${inputId}`);
    if (!input) return false;

    // Declares a variable to hold the error message
    const error = validateField(rules, input.value);

    // If there is an error, display it and return false, otherwise clear the error and return true
    if (error) {
        showError(inputId, messageId, error);
        return false;
    } else {
        clearError(inputId, messageId);
        return true;
    }
}

// Sets up the blur validation for the registration form
function setupRegistrationValidation(): void {
    // Username validation
    const usernameInput = document.querySelector<HTMLInputElement>('#register-username');
    usernameInput?.addEventListener('blur', () => {
        validateAndDisplay('register-username', 'username-message', usernameRules)
    });

    // Password validation
    const passwordInput = document.querySelector<HTMLInputElement>('#register-password');
    passwordInput?.addEventListener('blur', () => {
        validateAndDisplay('register-password', 'password-message', passwordRules);
    });

    // Confirm password validation
    const confirmPasswordInput = document.querySelector<HTMLInputElement>('#register-confirm-password');
    confirmPasswordInput?.addEventListener('blur', () => {
        // Declares a variable for the confirm password validation
        const isValid = validateAndDisplay('register-confirm-password', 'confirm-password-message', confirmPasswordRules);

        // If the confirm password is filled, it checks if the password and confirm password match
        if (isValid) {
            const password = document.querySelector<HTMLInputElement>('#register-password')?.value || '';
            const confirmPassword = confirmPasswordInput.value;
            const matchError = validatePasswordMatch(password, confirmPassword);

            // If the passwords do not match, it displays an error message
            if (matchError) {
                showError('register-confirm-password', 'confirm-password-message', matchError);
            } else {
                clearError('register-confirm-password', 'confirm-password-message');
            }
        }
    });
}

// Validates the registration form and returns true if valid, false if invalid
function validateRegistrationForm(): boolean {
    const usernameValid = validateAndDisplay('register-username', 'username-message', usernameRules);
    const passwordValid = validateAndDisplay('register-password', 'password-message', passwordRules);
    const confirmPasswordValid = validateAndDisplay('register-confirm-password', 'confirm-password-message', confirmPasswordRules);

    // Assigns a variable to hold the password match validation
    let passwordMatchValid = true;

    // Checks if the password and confirm password match, if so, clears the error message
    if (passwordValid && confirmPasswordValid) {
        const password = document.querySelector<HTMLInputElement>('#register-password')?.value || '';
        const confirmPassword = document.querySelector<HTMLInputElement>('#register-confirm-password')?.value || '';
        const matchError = validatePasswordMatch(password, confirmPassword);

        // If the passwords do not match, it displays an error message
        if (matchError) {
            showError('register-confirm-password', 'confirm-password-message', matchError);
            passwordMatchValid = false;
        }
    }
    return usernameValid && passwordValid && confirmPasswordValid && passwordMatchValid;
}

// Triggers the validation for all fields in the registration form. This avoids the issue of the forced
// username/password transfer when the user inputs a username or password in the login form and switches to the registration form
function triggerFieldValidation(fieldName: 'username' | 'password' | 'confirm-password'): void {
    switch (fieldName) {
        case 'username':
            validateAndDisplay('register-username', 'username-message', usernameRules);
            break;
        case 'password':
            validateAndDisplay('register-password', 'password-message', passwordRules);
            break;
        case 'confirm-password':
            const isValid = validateAndDisplay('register-confirm-password', 'confirm-password-message', confirmPasswordRules);
            if (isValid) {
                const password = document.querySelector<HTMLInputElement>('#register-password')?.value || '';
                const confirmPassword = document.querySelector<HTMLInputElement>('#register-confirm-password')?.value || '';
                const matchError = validatePasswordMatch(password, confirmPassword);
                if (matchError) {
                    showError('register-confirm-password', 'confirm-password-message', matchError);
                }
            }
            break;
    }
}

export { showError, clearError, setupRegistrationValidation, validateRegistrationForm, triggerFieldValidation }