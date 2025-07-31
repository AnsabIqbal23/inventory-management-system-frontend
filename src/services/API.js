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
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
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
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
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

export async function registerUser(username, email, password, confirmPassword, phone = null, location = null, city = null, state = null, country = null) {
    let url = `http://localhost:8081/api/users/register`;

    let headers = {
        'Content-Type': 'application/json',
    };

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
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
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
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
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
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
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
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
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