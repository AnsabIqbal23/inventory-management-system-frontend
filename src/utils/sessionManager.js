import { showBackendMessage } from './toast';

// Session timeout in milliseconds (60 minutes)
const SESSION_TIMEOUT = 60 * 60 * 1000;

// Key for storing session timestamp
const SESSION_TIMESTAMP_KEY = 'sessionTimestamp';

/**
 * Initialize session timestamp when user logs in
 */
export const initializeSession = () => {
  const timestamp = Date.now();
  sessionStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp.toString());
};

/**
 * Update session timestamp on user activity
 */
export const updateSessionActivity = () => {
  const timestamp = Date.now();
  sessionStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp.toString());
};

/**
 * Check if session is expired
 */
export const isSessionExpired = () => {
  const userData = sessionStorage.getItem('userData');
  const sessionTimestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
  
  if (!userData || !sessionTimestamp) {
    return true;
  }
  
  const timestamp = parseInt(sessionTimestamp);
  const currentTime = Date.now();
  
  return (currentTime - timestamp) > SESSION_TIMEOUT;
};

/**
 * Clear session data and show expiration message
 */
export const clearExpiredSession = () => {
  sessionStorage.removeItem('userData');
  sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
  
  // Show session expired message
  showBackendMessage({
    success: false,
    message: "Your session has expired. Please log in again."
  }, 'error');
};

/**
 * Handle automatic logout for expired sessions
 */
export const handleSessionExpiration = (navigate) => {
  if (isSessionExpired()) {
    clearExpiredSession();
    // Redirect to login page
    navigate('/login', { replace: true });
    return true;
  }
  return false;
};

/**
 * Validate session and handle expiration
 */
export const validateSession = (navigate) => {
  if (handleSessionExpiration(navigate)) {
    return false;
  }
  
  // Update activity timestamp if session is valid
  updateSessionActivity();
  return true;
};

/**
 * Set up automatic session checking
 */
export const setupSessionMonitoring = (navigate) => {
  // Check session every 5 minutes
  const interval = setInterval(() => {
    if (isSessionExpired()) {
      clearInterval(interval);
      handleSessionExpiration(navigate);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
  
  return interval;
};

/**
 * Add event listeners for user activity to extend session
 */
export const setupActivityListeners = () => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  const updateActivity = () => {
    if (!isSessionExpired()) {
      updateSessionActivity();
    }
  };
  
  events.forEach(event => {
    document.addEventListener(event, updateActivity, true);
  });
  
  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, updateActivity, true);
    });
  };
};
