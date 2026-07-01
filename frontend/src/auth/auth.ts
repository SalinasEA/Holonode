import { updateRightSidebarAuth } from "../sidebar/right-sidebar.ts";
import { getUserIdFromToken } from "../utility/utility.ts";

// Updates the navbar to show either the login or logout button based on authentication state
function updateAuth() {
    // Retrieves the JWT token from local storage to check if the user is authenticated
    const authToken = localStorage.getItem('authToken')
    const userId = getUserIdFromToken()

    // Selects the login and logout buttons from the navbar
    const loginModalBtn = document.querySelector<HTMLButtonElement>('.login-modal-btn')
    const logoutBtn = document.querySelector<HTMLButtonElement>('.logout-btn')

    // Returns early if the auth token or buttons are not found
    if (!loginModalBtn || !logoutBtn) {
        return
    }

    // Shows the logout button and hides the login button if authenticated, otherwise reverses the visibility
    if (authToken && userId) {
        loginModalBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';
    }
    else {
        loginModalBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
    }

    // Updates the right sidebar auth state
    updateRightSidebarAuth()
}

export { updateAuth }