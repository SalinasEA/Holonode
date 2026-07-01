import { updateAuth } from "../auth/auth";
import { delay } from '../utility/utility'
import { clearError, setupRegistrationValidation, showError, triggerFieldValidation, validateRegistrationForm } from "./validation-handlers.ts";

// Login/register modal, form switching, API calls

// Sets up click listeners for the login modal, close modal, back to login, register link, and register button, as well as the login and register forms
// Also uses the delay function to pause between UI state changes
function setupLoginModal() {
    const loginModalBtn = document.querySelector<HTMLButtonElement>('.login-modal-btn')
    const modalCard = document.querySelector<HTMLElement>('.modal-card')
    const closeModalBtn = document.querySelector<HTMLButtonElement>('.close-modal-btn')
    const backToLoginBtn = document.querySelector<HTMLButtonElement>('.back-to-login-btn')
    const loginOverlay = document.querySelector<HTMLElement>('.login-overlay')
    const loginForm = document.querySelector<HTMLElement>('.login-form')
    const loginBtn = document.querySelector<HTMLButtonElement>('.login-btn')
    const registerLinkBtn = document.querySelector<HTMLElement>('.register-link-btn')
    const registerForm = document.querySelector<HTMLElement>('.register-form')
    const registerBtn = document.querySelector<HTMLButtonElement>('.register-btn')

    // API URL from the environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    // If any required element is not found, return early
    if (!loginModalBtn || !modalCard || !closeModalBtn || !backToLoginBtn || !loginOverlay ||
        !loginForm || !loginBtn || !registerLinkBtn || !registerForm || !registerBtn || !API_URL) {
        return
    }

    // Calls the setupRegistrationValidation function to set up validation rules for the registration form before
    // any form submission is attempted, but after the DOM is fully loaded
    setupRegistrationValidation()

    // Opens the login overlay when the login button is clicked
    loginModalBtn.addEventListener('click', () => {
        loginOverlay.classList.add('visible')
    })

    // Closes the overlay with a fade-out animation when clicking outside the modal card
    loginOverlay.addEventListener('click', (event) => {
        if (event.target === loginOverlay) {
            loginOverlay.classList.add('hiding')
            loginOverlay.addEventListener('animationend', () => {
                loginOverlay.classList.remove('visible')
                loginOverlay.classList.remove('hiding')
                loginForm.style.display = 'flex'
                registerForm.style.display = 'none'
                backToLoginBtn.style.display = 'none'
            } , { once: true })
        }
    })

    // Closes the login overlay with a fade-out animation and resets the form state after it finishes
    closeModalBtn.addEventListener('click', () => {
        loginOverlay.classList.add('hiding')
        loginOverlay.addEventListener('animationend', () => {
            loginOverlay.classList.remove('visible')
            loginOverlay.classList.remove('hiding')
            loginForm.style.display = 'flex'
            registerForm.style.display = 'none'
            backToLoginBtn.style.display = 'none'
        } , { once: true })
    })

    // Fills register form with login form values and
    // Switches to the register form with a fade-in animation and shows the back button when the register link is clicked
    registerLinkBtn.addEventListener('click', () => {
        // Fills the register form with the login form values to make it easier for the user to fill in the required fields
        const loginUsername = document.querySelector<HTMLInputElement>('#login-username')!.value
        const loginPassword = document.querySelector<HTMLInputElement>('#login-password')!.value

        // Assigns the username and password values of the register form to the login form equivalents
        document.querySelector<HTMLInputElement>('#register-username')!.value = loginUsername
        document.querySelector<HTMLInputElement>('#register-password')!.value = loginPassword

        // Clears the register form now that the login form is filled in
        document.querySelector<HTMLInputElement>('#login-username')!.value = ""
        document.querySelector<HTMLInputElement>('#login-password')!.value = ""

        loginForm.style.display = 'none'
        registerForm.style.display = 'flex'
        backToLoginBtn.style.display = 'block'

        // Triggers validation for the pre-filled register form
        if (loginUsername) {
            triggerFieldValidation('username');
        }
        if (loginPassword) {
            triggerFieldValidation('password');
        }
        modalCard.style.animation = ''
        requestAnimationFrame(() => {
            modalCard.style.animation = 'fadeIn 0.2s ease'
        })
    })

    // Collects login form values and sends them to the backend when the login button is clicked and
    // displays a success or error message based on the response
    loginBtn.addEventListener('click', async () => {
        const loginUsername = document.querySelector<HTMLInputElement>('#login-username')?.value
        const loginPassword = document.querySelector<HTMLInputElement>('#login-password')?.value
        const loginModalMessage = document.querySelector<HTMLParagraphElement>('.login-modal-message')

        // If any required element is not found, return early
        if (!loginUsername || !loginPassword || !loginModalMessage) {
            return
        }

        // Clears any previous error messages
        loginModalMessage.innerHTML = ''
        loginModalMessage.style.display = 'none'

        // Bundles the login form values into an object to be sent as JSON
        const loginData = {
            username: loginUsername,
            password: loginPassword
        }

        // Sends the login data to the backend
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        // Stores the auth token in localStorage and shows a success message after a short delay, then
        // redirects to the home page
        if (response.ok) {
            // Creates a JSON object from the response body and assigns the token to a variable
            const tokenData = await response.json();
            const authToken = tokenData.token;

            // Sets the auth token in localStorage and updates the navbar
            localStorage.setItem('authToken', authToken);
            updateAuth();

            // Shows a success message and redirects to the home page after a short delay
            loginModalMessage.style.color = 'green'
            loginModalMessage.style.display = 'block'
            loginModalMessage.innerHTML = 'Login successful! Redirecting...'
            await delay(3000);

            // Clears the login form fields and resets the modal state before switching back to the home page
            document.querySelector<HTMLInputElement>('#login-username')!.value = ''
            document.querySelector<HTMLInputElement>('#login-password')!.value = ''
            loginModalMessage.innerHTML = ''
            loginModalMessage.style.color = ''
            loginModalMessage.style.display = 'none'
            loginOverlay.classList.add('hiding')
            loginOverlay.addEventListener('animationend', () => {
                loginOverlay.classList.remove('visible')
                loginOverlay.classList.remove('hiding')
                loginForm.style.display = 'flex'
                registerForm.style.display = 'none'
                backToLoginBtn.style.display = 'none'
            } , { once: true })
        }

        // Handles rate limit errors by clearing field errors and displaying a retry message with the wait time from the server
        else if (response.status === 429) {
            clearError('register-username', 'username-message');
            clearError('register-password', 'password-message');
            clearError('register-confirm-password', 'confirm-password-message');

            const retryAfter = response.headers.get('Retry-After');

            const waitMessage = retryAfter
                ? `Too many attempts. Please wait ${retryAfter} seconds.`
                : 'Too many attempts. Please wait a moment.';

            loginModalMessage.style.display = 'block';
            loginModalMessage.style.color = 'red';
            loginModalMessage.innerHTML = waitMessage;
        }

        else {
            loginModalMessage.style.display = 'block'
            loginModalMessage.style.color = 'red'
            loginModalMessage.innerHTML = 'Login failed. Please try again.'
        }
    })

    // Collects registration form values and sends them to the backend when the register button is clicked and
    // displays a success or error message based on the response
    registerBtn.addEventListener('click', async () => {
        // Validates the registration form before sending the data
        const isFormValid = validateRegistrationForm();

        // If the form is not valid, return early, if the form is valid, continue with the registration process below
        if (!isFormValid) {
            return
        }

        const registerUsername = document.querySelector<HTMLInputElement>('#register-username')?.value
        const registerPassword = document.querySelector<HTMLInputElement>('#register-password')?.value
        const registerConfirmPassword = document.querySelector<HTMLInputElement>('#register-confirm-password')?.value
        const registerModalMessage = document.querySelector<HTMLParagraphElement>('.register-modal-message')

        // If any required element is not found, return early
        if (!registerUsername || !registerPassword || !registerConfirmPassword || !registerModalMessage) {
            return
        }

        // Clears any previous error messages
        registerModalMessage.innerHTML = ''
        registerModalMessage.style.display = 'none'

        // Bundles the registration form values into an object to be sent as JSON
        const registerData = {
            username: registerUsername,
            password: registerPassword,
            confirmPassword: registerConfirmPassword
        }

        // Sends the registration data to the backend
        const response = await fetch(`${API_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })

        // Shows a success message and redirects to the login form after a short delay
        if (response.ok) {
            registerModalMessage.style.color = 'green'
            registerModalMessage.style.display = 'block'
            registerModalMessage.innerHTML = 'Registration successful! Redirecting...'
            await delay(3000);

            // Clears the registration form fields and resets the modal state before switching back to the login form
            document.querySelector<HTMLInputElement>('#register-username')!.value = ''
            document.querySelector<HTMLInputElement>('#register-password')!.value = ''
            document.querySelector<HTMLInputElement>('#register-confirm-password')!.value = ''
            registerModalMessage.innerHTML = ''
            registerModalMessage.style.color = ''
            registerModalMessage.style.display = 'none'
            registerForm.style.display = 'none'
            loginForm.style.display = 'flex'
            backToLoginBtn.style.display = 'none'
        }

        // Handles rate limit errors by clearing field errors and displaying a retry message with the wait time from the server
        else if (response.status === 429) {
            clearError('register-username', 'username-message');
            clearError('register-password', 'password-message');
            clearError('register-confirm-password', 'confirm-password-message');

            const retryAfter = response.headers.get('Retry-After');

            const waitMessage = retryAfter
                ? `Too many attempts. Please wait ${retryAfter} seconds.`
                : 'Too many attempts. Please wait a moment.';

            registerModalMessage.style.display = 'block';
            registerModalMessage.style.color = 'red';
            registerModalMessage.innerHTML = waitMessage;
        }

        else {
            const errorData = await response.json();

            // A for loop to display error messages for each field in the JSON response
            for (const [fieldName, errorMessage] of Object.entries(errorData)) {
                const inputId = `register-${fieldName}`;
                const messageId = `${fieldName}-message`;
                showError(inputId, messageId, errorMessage as string);
            }
        }
    })

    // Returns to the login form with a fade-in animation and hides the back button when clicked
    backToLoginBtn.addEventListener('click', () => {
        registerForm.style.display = 'none'
        loginForm.style.display = 'flex'
        backToLoginBtn.style.display = 'none'
        modalCard.style.animation = ''
        requestAnimationFrame(() => {
            modalCard.style.animation = 'fadeIn 0.2s ease'
        })
    })
}

// Sets up a click listener for the logout button to clear authentication and update the UI
function setupLogoutModal() {
    // Selects the logout button from the navbar
    const logoutBtn = document.querySelector<HTMLButtonElement>('.logout-btn')

    // Returns early if the logout button is not found
    if (!logoutBtn) {
        return
    }

    // Removes the auth token from local storage and updates the navbar when the logout button is clicked
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      updateAuth();
    })
}

export { setupLoginModal, setupLogoutModal}