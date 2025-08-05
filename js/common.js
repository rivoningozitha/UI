// Session management section: 
// Store user session
export function setUserSession(user) {
    sessionStorage.setItem('userSession', JSON.stringify(user));
}

// Get user session
export function getUserSession() {
    const session = sessionStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
}

// Clear session on logout
export function clearUserSession() {
    sessionStorage.removeItem('userSession');
}

// Check if user is logged in
export function isUserLoggedIn() {
    return getUserSession() !== null;
}

// Get auth token (for fetch API headers)
export function getAuthToken() {
    const session = getUserSession();
    return session?.Token ?? null;
}

// Get user role
export function getUserRole() {
  const session = getUserSession();
  //console.log("Session data:", session);

  if (!session) {
    return null;
  }

  try {
    let role = session.role;
    //console.log("User Role: ", role);
    return role ? role.toLowerCase() : null;
  } catch (error) {
    console.error("Failed to parse user session:", error);
    return null;
  }
}

//Must create a functio that returns the userId for the logged in user???

// Logout and redirect
export function logoutUser() {
    clearUserSession();
    window.location.href = 'login.html';
}
//End Of Session Management Section

/* 
 * Method Fetches data from the api endpoint
 * 
 */
// Function to fetch data from an API endpoint
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}