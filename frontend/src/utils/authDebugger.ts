/**
 * Utility functions to help debug authentication and cookie issues
 */

/**
 * Prints information about all cookies to the console
 */
export const debugCookies = (): void => {
  console.group('Cookie Debug Information');
  
  // Get all cookies
  const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
  
  console.log(`Total cookies: ${allCookies.length}`);
  
  // Look for specific auth cookies
  const authCookies = [
    'access_token',
    'refresh_token',
    'csrf_access_token',
    'csrf_refresh_token',
    'X-CSRF-TOKEN'
  ];
  
  authCookies.forEach(cookieName => {
    const cookieExists = document.cookie.includes(cookieName);
    console.log(`${cookieName}: ${cookieExists ? 'Present' : 'Not found'}`);
  });
  
  // Display all cookies in sorted order
  console.log('All cookies:');
  allCookies.sort().forEach(cookie => {
    const [name] = cookie.split('=');
    if (name) {
      console.log(`- ${name}: ${cookie.includes('=') ? '[Value hidden]' : '[Empty]'}`);
    }
  });
  
  // Check SameSite and Secure attributes (these can only be seen in Application tab)
  console.log('Note: Check Application > Cookies in DevTools to see SameSite and Secure attributes');
  
  console.groupEnd();
};

/**
 * Checks if credentials and CORS are properly configured
 */
export const checkCORSConfig = async (): Promise<void> => {
  console.group('CORS Configuration Check');
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'https://dobsinskym.com/api';
    
    // Try a request with credentials
    console.log(`Testing a request to ${API_URL}/health with credentials...`);
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`- ${key}: ${value}`);
    });
    
    // Check for CORS headers
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers'
    ];
    
    corsHeaders.forEach(header => {
      const value = response.headers.get(header);
      console.log(`${header}: ${value || 'Not present'}`);
    });
    
    if (response.ok) {
      console.log('✅ CORS appears to be correctly configured');
    } else {
      console.log('❌ CORS check failed');
    }
    
    // Now test the refresh endpoint
    console.log('\nTesting refresh endpoint...');
    try {
      const refreshResponse = await fetch(`${API_URL}/refresh`, {
        method: 'GET',
        credentials: 'include',
      });
      
      console.log(`Refresh endpoint status: ${refreshResponse.status}`);
      
      if (refreshResponse.status === 401) {
        console.log('✓ Refresh endpoint returned 401 (expected when not authenticated)');
      } else if (refreshResponse.status === 200) {
        console.log('✓ Refresh endpoint working (you have a valid refresh token)');
      } else if (refreshResponse.status === 405) {
        console.error('❌ Refresh endpoint method not allowed - should accept GET requests');
      } else {
        console.log(`Refresh endpoint returned status ${refreshResponse.status}`);
      }
    } catch (refreshError) {
      console.error('❌ Refresh endpoint test failed:', refreshError);
    }
    
  } catch (error) {
    console.error('❌ CORS test failed with error:', error);
  }
  
  console.groupEnd();
};

/**
 * Run all debug checks
 */
export const runAuthDiagnostics = (): void => {
  console.group('Authentication Diagnostics');
  
  debugCookies();
  checkCORSConfig();
  
  console.log('Browser information:');
  console.log(`- User Agent: ${navigator.userAgent}`);
  console.log(`- Cookies enabled: ${navigator.cookieEnabled}`);
  
  console.groupEnd();
};

export default {
  debugCookies,
  checkCORSConfig,
  runAuthDiagnostics
};
