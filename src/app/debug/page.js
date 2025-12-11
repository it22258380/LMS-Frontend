
'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEYS } from '../../utils/constants';

export default function DebugPage() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTokenInfo(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }

    if (user) {
      try {
        setUserInfo(JSON.parse(user));
      } catch (error) {
        console.error('Failed to parse user:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 JWT Token Debug Inspector
        </h1>

        {/* User Info from LocalStorage */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📦 User Info (from localStorage)
          </h2>
          {userInfo ? (
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-600">No user info found. Please log in.</p>
          )}
        </div>

        {/* Decoded JWT Token */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🔓 Decoded JWT Token
          </h2>
          {tokenInfo ? (
            <>
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 mb-2">Token Structure:</h3>
                <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(tokenInfo, null, 2)}
                </pre>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-700 mb-2">Role Detection Analysis:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="font-medium w-32">Email (sub):</span>
                    <span className="text-gray-600">{tokenInfo.sub || 'Not found'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-32">Roles claim:</span>
                    <span className={tokenInfo.roles ? 'text-green-600' : 'text-red-600'}>
                      {tokenInfo.roles || '❌ Not found'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-32">Authorities:</span>
                    <span className={tokenInfo.authorities ? 'text-green-600' : 'text-red-600'}>
                      {tokenInfo.authorities 
                        ? JSON.stringify(tokenInfo.authorities) 
                        : '❌ Not found'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-32">Scope:</span>
                    <span className={tokenInfo.scope ? 'text-green-600' : 'text-red-600'}>
                      {tokenInfo.scope || '❌ Not found'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-32">Expiry:</span>
                    <span className="text-gray-600">
                      {new Date(tokenInfo.exp * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">No token found. Please log in.</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">📝 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Log in as a LIBRARIAN user</li>
            <li>Visit this debug page</li>
            <li>Check if "roles" or "authorities" claim exists in the JWT</li>
            <li>If missing, update your backend JwtTokenProvider (see backend-jwt-fix artifact)</li>
            <li>The frontend will automatically detect the role once the backend is fixed</li>
          </ol>
        </div>

        {/* Clear Storage Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            🗑️ Clear All Storage & Reload
          </button>
        </div>
      </div>
    </div>
  );
}