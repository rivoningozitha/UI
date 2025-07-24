
// Store user session
function setUserSession(user) {
    sessionStorage.setItem('userSession', JSON.stringify(user));
}

// Get user session
function getUserSession() {
    const session = sessionStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
}

// Clear session on logout
function clearUserSession() {
    sessionStorage.removeItem('userSession');
}

// Check if user is logged in
function isUserLoggedIn() {
    return getUserSession() !== null;
}

// Get auth token (for fetch API headers)
function getAuthToken() {
    const session = getUserSession();
    return session?.Token ?? null;
}

// Get user role
function getUserRole() {
    const session = getUserSession();
    return session?.Role?.toLowerCase() ?? null;
}

// Redirect based on role
function redirectToDashboardByRole() {
    const role = getUserRole();
    if (!role) {
        window.location.href = 'login.html';
        return;
    }

    // Customize this as needed
    switch (role) {
        case 'plumber':
        case 'supervisor':
        case 'manager':
            window.location.href = 'dashboard.html';
            break;
        default:
            alert("Unknown role: " + role);
            window.location.href = 'login.html';
            break;
    }
}

// Logout and redirect
function logoutUser() {
    clearUserSession();
    window.location.href = 'login.html';
}
