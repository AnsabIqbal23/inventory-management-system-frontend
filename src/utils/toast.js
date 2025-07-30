// Toast utility functions
export const showSuccessToast = (message, duration = 1000) => {
  console.log("showSuccessToast called with message:", message);
  if (window.showToast) {
    window.showToast(message, 'success', duration);
  }
};

export const showErrorToast = (message, duration = 1000) => {
  console.log("showErrorToast called with message:", message);
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
  console.log("showBackendMessage called with response:", response);
  console.log("Response type:", typeof response);
  
  // Handle case where response might be a string
  let parsedResponse = response;
  if (typeof response === 'string') {
    try {
      parsedResponse = JSON.parse(response);
      console.log("Parsed string response:", parsedResponse);
    } catch (e) {
      console.log("Failed to parse response as JSON, treating as message");
      showErrorToast(response);
      return;
    }
  }
  
  console.log("Response.message:", parsedResponse?.message);
  
  if (parsedResponse && parsedResponse.message) {
    const messageToShow = parsedResponse.message;
    console.log("Showing message:", messageToShow);
    
    if (type === 'success') {
      showSuccessToast(messageToShow);
    } else {
      showErrorToast(messageToShow);
    }
  } else {
    console.log("No message found in response or response is invalid");
    // Fallback: show the entire response as a string for debugging
    console.log("Full response for debugging:", JSON.stringify(parsedResponse, null, 2));
  }
};

// Handle login errors from backend
export const showLoginErrorToast = (error) => {
  console.log("showLoginErrorToast called with error:", error);
  
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
        console.log("Failed to parse error response JSON:", parseError);
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