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
      // If it's not valid JSON, treat it as a plain message
      const messageToShow = response;
      if (type === 'success') {
        showSuccessToast(messageToShow);
      } else {
        showErrorToast(messageToShow);
      }
      return;
    }
  }
  
  // Extract message from the response object
  let messageToShow = "Operation completed";
  
  if (parsedResponse && parsedResponse.message) {
    messageToShow = parsedResponse.message;
  } else if (parsedResponse && typeof parsedResponse === 'string') {
    messageToShow = parsedResponse;
  } else if (parsedResponse && parsedResponse.error) {
    messageToShow = parsedResponse.error;
  } else if (type === 'error') {
    messageToShow = "An error occurred";
  }
  
  if (type === 'success') {
    showSuccessToast(messageToShow);
  } else {
    showErrorToast(messageToShow);
  }
};

// Handle login errors from backend
export const showLoginErrorToast = (error) => {
  let messageToShow = "An error occurred";
  
  // Try to parse error response for backend message
  if (error.message && error.message.includes("HTTP error!")) {
    // Extract the JSON message from the error response
    const messageMatch = error.message.match(/message: (.+)$/);
    if (messageMatch) {
      try {
        // Parse the JSON object from the error message
        const errorResponse = JSON.parse(messageMatch[1]);
        if (errorResponse.message) {
          messageToShow = errorResponse.message;
        } else {
          messageToShow = error.message;
        }
      } catch (parseError) {
        // If parsing fails, try to extract just the JSON part
        const jsonMatch = error.message.match(/\{.*\}/);
        if (jsonMatch) {
          try {
            const errorResponse = JSON.parse(jsonMatch[0]);
            if (errorResponse.message) {
              messageToShow = errorResponse.message;
            } else {
              messageToShow = error.message;
            }
          } catch (e) {
            messageToShow = error.message;
          }
        } else {
          messageToShow = error.message;
        }
      }
    } else {
      messageToShow = error.message;
    }
  } else if (error.message) {
    // For other errors, show the actual error message
    messageToShow = error.message;
  }
  
  showErrorToast(messageToShow);
}; 