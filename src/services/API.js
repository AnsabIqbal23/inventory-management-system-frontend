//////////////////////////////////////// ADMIN API ////////////////////////////////////////

export async function registerAdmin(username, email, password, confirmPassword, phone, location, city, state, country) {
    let url = `http://localhost/api/users/admin/register`;

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

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
    return response;
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
        throw error;
    }
};

//////////////////////////////////////// USER API ////////////////////////////////////////

export async function registerUser(username, email, password, confirmPassword) {
    let url = `http://localhost/api/users/register`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        username,
        email,
        password,
        confirmPassword,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
    return response;
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
        throw error;
    }
};
