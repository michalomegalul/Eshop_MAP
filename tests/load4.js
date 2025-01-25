import http from 'k6/http';
import { check, sleep } from 'k6';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const API_URL = 'http://localhost:5000/api';  // Update with your API URL

// Generate random product data
function createRandomProduct() {
    return {
        name: `Product_${generateUUID()}`,  // Make sure to call the function to get the actual UUID string
        description: 'A sample product description.',
        price: Math.random() * 100 + 10,  // Random price between 10 and 110
        stock_quantity: Math.floor(Math.random() * 50) + 1,  // Random stock between 1 and 50
        category_id: '71286d7d-10b6-425c-b8dd-1f3fb6583630'  // Use valid category ID if necessary
    };
}

// Test configuration
export let options = {
    scenarios: {
        creating_products: {
            executor: 'ramping-arrival-rate',
            startRate: 10,  // Start with 10 requests per second
            timeUnit: '1s',  // Requests per second
            stages: [
                { duration: '30s', target: 100 },  // Ramp up to 100 requests per second in 30 seconds
                { duration: '1m', target: 500 },  // Ramp up to 500 requests per second in 1 minute
                { duration: '1m', target: 1000 },  // Ramp up to 1000 requests per second in 1 minute
                { duration: '1m', target: 1500 },  // Ramp up to 1500 requests per second in 1 minute
            ],
            preAllocatedVUs: 200,  // Pre-allocate virtual users
            maxVUs: 5000,  // Max virtual users (depending on your machine capacity)
        },
    },
};

export default function loadTest() {
    // Randomly create a product
    const productData = createRandomProduct();
    const productResponse = http.post(`${API_URL}/products`, JSON.stringify(productData), {
        headers: { 'Content-Type': 'application/json' }
    });

    check(productResponse, { 'status is 201': (r) => r.status === 201 });

    sleep(0.1);  // Minimal delay between iterations
}
