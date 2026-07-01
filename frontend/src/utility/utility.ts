// Utility functions

// Creates a delay function that returns a promise that resolves after the specified number of milliseconds,
// it is essentially a timer function
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Gets the user ID from the JWT token stored in local storage, returns null if not found
function getUserIdFromToken() {
    const token = localStorage.getItem('authToken');
    // If no token is found, returns null
    if (!token) return null;

    // Tries to parse the token, if it fails, returns null
    try {
        // Splits the JWT into header, payload, and signature
        const base64Payload = token.split('.')[1];

        // Translates the base64 ASCII payload into a JSON string
        const jsonPayload = atob(base64Payload);

        // Creates POJO from JSON string and returns the user ID via parsing the sub
        const decoded = JSON.parse(jsonPayload);

        // Checks if the token has expired, if so, removes it from local storage and returns null
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now){
            localStorage.removeItem('authToken');
            return null;
        }

        return parseInt(decoded.sub);
    }
    catch {
        return null;
    }
}

export { delay, getUserIdFromToken }