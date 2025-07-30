// Toast utility functions
export const showSuccessToast = (message, duration = 1000) => {
  if (window.showToast) {
    window.showToast(message, 'success', duration);
  }
};

export const showErrorToast = (message, duration = 1000) => {
  if (window.showToast) {
    window.showToast(message, 'error', duration);
  }
};

export const showInfoToast = (message, duration = 1000) => {
  if (window.showToast) {
    window.showToast(message, 'info', duration);
  }
};

// Display only the message field from backend response
export const showBackendMessage = (response, type = 'success') => {
  // Handle case where response might be a string
  let parsedResponse = response;
  if (typeof response === 'string') {
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      showErrorToast(response);
      return;
    }
  }
  
  if (parsedResponse && parsedResponse.message) {
    const messageToShow = parsedResponse.message;
    
    if (type === 'success') {
      showSuccessToast(messageToShow);
    } else {
      showErrorToast(messageToShow);
    }
  }
};

// Handle login errors from backend
export const showLoginErrorToast = (error) => {
  // Try to parse error response for backend message
  if (error.message && error.message.includes("HTTP error!")) {
    // Extract the JSON message from the error response
    const messageMatch = error.message.match(/message: (.+)$/);
    if (messageMatch) {
      try {
        // Parse the JSON object from the error message
        const errorResponse = JSON.parse(messageMatch[1]);
        if (errorResponse.message) {
          showErrorToast(errorResponse.message);
        } else {
          showErrorToast(error.message);
        }
      } catch (parseError) {
        showErrorToast(error.message);
      }
    } else {
      showErrorToast(error.message);
    }
  } else {
    // For network errors, show the actual error message
    showErrorToast(error.message);
  }
}; 