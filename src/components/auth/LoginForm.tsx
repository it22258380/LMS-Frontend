'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      
      // If there was a redirect param, go there after login
      if (redirectTo) {
        router.push(redirectTo);
      }
      // Otherwise, AuthContext handles the redirect based on role
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error"
          onClose={() => setError('')}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        autoFocus
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon className="text-gray-400" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password Field */}
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon className="text-gray-400" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePassword}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link 
          href="/forgot-password" 
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {loading ? (
          <CircularProgress size={24} className="text-white" />
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/register" 
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Demo Credentials (Optional - Remove in production) */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-xs text-gray-600 font-semibold mb-2">
          Demo Credentials:
        </p>
        <p className="text-xs text-gray-500">
          📚 Librarian: librarian@library.com / password123
        </p>
        <p className="text-xs text-gray-500">
          👤 User: user@library.com / password123
        </p>
      </div>
    </form>
  );
}