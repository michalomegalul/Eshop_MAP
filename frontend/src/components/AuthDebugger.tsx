import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { runAuthDiagnostics, debugCookies, checkCORSConfig } from '../utils/authDebugger';
import api from '../services/api';

const AuthDebugger: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [debugOutput, setDebugOutput] = useState<string>('');

  const handleRunDiagnostics = () => {
    console.clear();
    setDebugOutput('Running diagnostics, check console for details...');
    runAuthDiagnostics();
    addNotification('Auth diagnostics run - check your browser console', 'info');
  };

  const handleCheckCookies = () => {
    console.clear();
    setDebugOutput('Checking cookies, check console for details...');
    debugCookies();
    addNotification('Cookie check complete - check your browser console', 'info');
  };

  const handleTestRefresh = async () => {
    setIsLoading(true);
    setDebugOutput('Testing token refresh...');
    
    try {
      const response = await api.get('/refresh');
      setDebugOutput(`Refresh successful: ${JSON.stringify(response.data)}`);
      addNotification('Token refresh successful', 'success');
    } catch (error: any) {
      const errorMessage = error.response 
        ? `Error ${error.response.status}: ${JSON.stringify(error.response.data)}` 
        : error.message;
      setDebugOutput(`Refresh failed: ${errorMessage}`);
      addNotification(`Token refresh failed: ${error.response?.status || 'Network Error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAuth = async () => {
    setIsLoading(true);
    setDebugOutput('Testing auth endpoint...');
    
    try {
      const response = await api.get('/auth-check');
      setDebugOutput(`Auth check successful: ${JSON.stringify(response.data)}`);
      addNotification('Authentication verified', 'success');
    } catch (error: any) {
      const errorMessage = error.response 
        ? `Error ${error.response.status}: ${JSON.stringify(error.response.data)}` 
        : error.message;
      setDebugOutput(`Auth check failed: ${errorMessage}`);
      addNotification(`Auth check failed: ${error.response?.status || 'Network Error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCORS = async () => {
    console.clear();
    setDebugOutput('Testing CORS configuration, check console for details...');
    await checkCORSConfig();
    addNotification('CORS check complete - check your browser console', 'info');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Auth Debugger</h2>
      
      <div className="mb-4">
        <span className="font-semibold">Current User:</span> {user ? user.username : 'Not logged in'}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={handleRunDiagnostics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2"
          disabled={isLoading}
        >
          Run All Diagnostics
        </button>
        
        <button 
          onClick={handleCheckCookies}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2"
          disabled={isLoading}
        >
          Check Cookies
        </button>
        
        <button 
          onClick={handleTestRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2"
          disabled={isLoading}
        >
          Test Token Refresh
        </button>
        
        <button 
          onClick={handleTestAuth}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2"
          disabled={isLoading}
        >
          Test Auth Check
        </button>

        <button 
          onClick={handleTestCORS}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2"
          disabled={isLoading}
        >
          Test CORS Config
        </button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {debugOutput && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-80">
          <pre className="whitespace-pre-wrap">{debugOutput}</pre>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Note:</strong> For more detailed debugging information, check your browser's developer console (F12).</p>
      </div>
    </div>
  );
};

export default AuthDebugger;
