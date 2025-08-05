// Helper function to clean error messages
function cleanErrorMessage(errorData) {
    try {
        // First try to parse as JSON
        const errorJson = JSON.parse(errorData);
        
        // Extract just the message field if it exists
        if (errorJson.message) {
            return errorJson.message;
        }
        
        // If no message field, return the clean string
        return errorData;
    } catch (parseError) {
        // If not JSON, clean up any remaining formatting
        let cleanMessage = errorData;
        
        // Remove common JSON patterns
        cleanMessage = cleanMessage.replace(/^\{.*"message"\s*:\s*"([^"]+)".*\}$/i, '$1');
        cleanMessage = cleanMessage.replace(/^\{.*"error"\s*:\s*"([^"]+)".*\}$/i, '$1');
        cleanMessage = cleanMessage.replace(/success\s*:\s*(true|false)\s*,?\s*/gi, '');
        cleanMessage = cleanMessage.replace(/[{}]/g, '');
        cleanMessage = cleanMessage.replace(/^[",\s]+|[",\s]+$/g, '');
        
        return cleanMessage || errorData;
    }
}

//////////////////////////////////////// ADMIN Login/Register API ////////////////////////////////////////

export async function registerAdmin(username, email, password, confirmPassword, phone, location, city, state, country) {
    let url = `http://localhost:8081/api/users/admin/register`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        username,
        email,
        password,
        confirmPassword,
        phone,
        location,
        city,
        state,
        country,
    };

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("Admin registration status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Admin registration response data:", data);
        return data;
    } catch (error) {
        console.error("Admin registration error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Registration failed"
        };
    }
};

export async function adminLogin(username, password) {
    let url = `http://localhost:8081/api/users/admin/login`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        username,
        password,
    };

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("Admin login status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Admin login response data:", data);
        return data;
    } catch (error) {
        console.error("Admin login error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Login failed"
        };
    }
};

//////////////////////////////////////// USER Login/Register API ////////////////////////////////////////

export async function registerUser(username, email, password, confirmPassword, token, phone = null, location = null, city = null, state = null, country = null) {
    let url = `http://localhost:8081/api/users/register`;

    let headers = {
        'Content-Type': 'application/json',
    };

    // Add authorization header if token is provided
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        throw new Error("Token is required for authentication");
    }

    let body = {
        username,
        email,
        password,
        confirmPassword,
    };

    // Add additional fields if provided
    if (phone && phone.trim() !== '') {
        body.phone = phone;
    }
    if (location && location.trim() !== '') {
        body.location = location;
    }
    if (city && city.trim() !== '') {
        body.city = city;
    }
    if (state && state.trim() !== '') {
        body.state = state;
    }
    if (country && country.trim() !== '') {
        body.country = country;
    }

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("User registration status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("User registration response data:", data);
        return data;
    } catch (error) {
        console.error("User registration error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Registration failed"
        };
    }
};

export async function userLogin(username, password) {
    let url = `http://localhost:8081/api/users/login`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        username,
        password,
    };

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("User login status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("User login response data:", data);
        return data;
    } catch (error) {
        console.error("User login error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Login failed"
        };
    }
};

/////////////////////////////////////////////// Get Users API ////////////////////////////////////////

export async function getAllUsers(token) {
    let url = `http://localhost:8081/api/users`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        else {
            throw new Error("Token is required for authentication");
        }

        let response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        console.log("Get all users status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();

        console.log("Get all users response data:", data);
        return data;

    } catch (error) {
        console.error("Get all users error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to fetch users"
        };
    }
};

export async function getUserById(id, token) {
    let url = `http://localhost:8081/api/users/${id}`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        else {
            throw new Error("Token is required for authentication");
        }

        let response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        console.log("Get user by ID status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Get user by ID response data:", data);
        return data;
    } catch (error) {
        console.error("Get user by ID error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to fetch user data"
        };
    }
};

///////////////////////////////////////// Update API /////////////////////////////////////////////

export async function updatePassword(currentpassword, newpassword, confirmpassword, token) {
    let url = `http://localhost:8081/api/users/password`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error("Token is required for authentication");
        }

        let body = {
            currentpassword,
            newpassword,
            confirmpassword,
        };

        let response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("Update password status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Update password response data:", data);
        return data;
    } catch (error) {
        console.error("Update password error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to update password"
        };
    }
};

export async function forgetPassword(username, passwordData) {
    let url = `http://localhost:8081/api/users/forget-password/${username}`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        let response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(passwordData),
        });
        
        console.log("Forget password status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Forget password response data:", data);
        return data;
    } catch (error) {
        console.error("Forget password error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to reset password"
        };
    }
};

///////////////////////////////////////// Delete User API ////////////////////////////////////////

export async function deleteUser(id, token) {
    let url = `http://localhost:8081/api/users/${id}`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        else {
            throw new Error("Token is required for authentication");
        }

        let response = await fetch(url, {
            method: 'DELETE',
            headers: headers,
        });
        console.log("Delete user status:", response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);

            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }

        const data = await response.json();
        console.log("Delete user response data:", data);
        return data;
    } catch (error) {
        console.error("Delete user error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to delete user"
        };
    }
};

////////////////////////////////////////// Store API ///////////////////////////////////////////////////

export async function createStore(name, location, ownerId, token) {
    let url = `http://localhost:8081/api/stores`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error("Token is required for authentication");
        }

        let body = {
            name,
            location,
            ownerId,
        };

        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("Create store status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Create store response data:", data);
        return data;
    } catch (error) {
        console.error("Create store error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to create store"
        };
    }
};

export async function getAllStores(token) {
    let url = `http://localhost:8081/api/stores`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided (optional for GET)
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        console.log("Get all stores status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Get all stores response data:", data);
        return data;
    } catch (error) {
        console.error("Get all stores error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to fetch stores"
        };
    }
};

export async function getStoreById(id, token) {
    let url = `http://localhost:8081/api/stores/${id}`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided (optional for GET)
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        
        console.log("Get store by ID status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Get store by ID response data:", data);
        return data;
    } catch (error) {
        console.error("Get store by ID error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to fetch store data"
        };
    }
};

export async function updateStore(id, name, location, ownerId, token) {
    let url = `http://localhost:8081/api/stores/${id}`;

    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            throw new Error("Token is required for authentication");
        }

        let body = {
            name,
            location,
            ownerId,
        };

        let response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body),
        });
        
        console.log("Update store status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log("Error response:", errorData);
            
            // Clean the error message
            const cleanMessage = cleanErrorMessage(errorData);
            throw new Error(cleanMessage);
        }
        
        const data = await response.json();
        console.log("Update store response data:", data);
        return data;
    } catch (error) {
        console.error("Update store error:", error);
        // Return a structured error response instead of throwing
        return {
            success: false,
            message: error.message || "Failed to update store"
        };
    }
};

export const deleteStore = async (storeId, token) => {
  try {
    const response = await fetch(`http://localhost:8081/api/stores/${storeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the response text first
    const responseText = await response.text();
    
    // Try to parse as JSON, if it fails, return the text as is
    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      // If JSON parsing fails, return the plain text response
      // This handles cases where API returns "Store deleted successfully"
      return responseText;
    }
  } catch (error) {
    console.error('Delete store API error:', error);
    throw error;
  }
};