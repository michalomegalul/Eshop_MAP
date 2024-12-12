import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomUUID } from 'k6/uuid';

const API_URL = 'http://localhost:5000/api';  // Update with your API URL

// Generate random user data
function createRandomUser() {
    return {
        username: `user_${randomUUID()}`,
        first_name: 'John',
        last_name: 'Doe',
        email: `user_${randomUUID()}@example.com`,
        telephone: '1234567890',
        role: 'user',
        status: 'active',
        password: 'password123'
    };
}

// Generate random product data
function createRandomProduct() {
    return {
        name: `Product_${randomUUID()}`,
        description: 'A sample product description.',
        price: Math.random() * 100 + 10,  // Random price between 10 and 110
        stock_quantity: Math.floor(Math.random() * 50) + 1,  // Random stock between 1 and 50
        category_id: '54aa31fa-7263-4db9-a864-0fd6dc887eb6'  // Update with valid category id if necessary
    };
}

// Test configuration
export let options = {
    scenarios: {
        high_traffic: {
            executor: 'constant-arrival-rate',
            rate: 1000,  // 1000 requests per second
            duration: '5m',  // Test duration: 5 minutes
            preAllocatedVUs: 500,  // Pre-allocate virtual users
            maxVUs: 2000,  // Max virtual users
        },
    },
};

export default function loadTest() {
    // Randomly create a user
    const userData = createRandomUser();
    const userResponse = http.post(`${API_URL}/register`, JSON.stringify(userData), {
        headers: { 'Content-Type': 'application/json' }
    });

    check(userResponse, { 'status is 201': (r) => r.status === 201 });

    // Randomly create a product
    const productData = createRandomProduct();
    const productResponse = http.post(`${API_URL}/products`, JSON.stringify(productData), {
        headers: { 'Content-Type': 'application/json' }
    });

    check(productResponse, { 'status is 201': (r) => r.status === 201 });

    sleep(0.1);  // Minimal delay between iterations
}
