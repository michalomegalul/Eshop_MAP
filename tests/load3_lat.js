import http from 'k6/http';
import { check, sleep } from 'k6';

// Helper function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const API_URL = 'http://localhost:5000/api';  // Update with your API URL

// Helper function to simulate random API calls
function randomApiCall() {
    const randomPath = Math.random() < 0.5 ? '/register' : '/products';  // Randomly pick between /register or /products
    const randomMethod = Math.random() < 0.5 ? 'POST' : 'GET';  // Randomly pick between GET or POST
    let data = {};

    // Create random data for POST requests
    if (randomMethod === 'POST') {
        if (randomPath === '/register') {
            data = {
                username: `user_${generateUUID()}`,
                first_name: 'John',
                last_name: 'Doe',
                email: `user_${generateUUID()}@example.com`,
                telephone: '1234567890',
                role: 'user',
                status: 'active',
                password: 'password123'
            };
        } else if (randomPath === '/products') {
            data = {
                name: `Product_${generateUUID()}`,
                description: 'Random product description.',
                price: Math.random() * 100 + 10,
                stock_quantity: Math.floor(Math.random() * 50) + 1,
                category_id: '54aa31fa-7263-4db9-a864-0fd6dc887eb6'
            };
        }
    }

    // Make a random request
    let response;
    if (randomMethod === 'POST') {
        response = http.post(`${API_URL}${randomPath}`, JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (randomMethod === 'GET') {
        response = http.get(`${API_URL}${randomPath}`);
    }

    // Check if the request was successful
    check(response, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201
    });
}

// Test configuration
export let options = {
    vus: 100,  // 100 virtual users
    duration: '10m',  // Test duration: 10 minutes
};

export default function loadTest() {
    // Randomly call the API
    randomApiCall();

    // Sleep to simulate user delay
    sleep(Math.random() * 0.5);  // Sleep between 0-0.5 seconds to simulate varying load
}
