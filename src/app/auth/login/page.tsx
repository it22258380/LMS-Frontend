import LoginForm from '../../../components/auth/LoginForm';
import { MenuBook as BookIcon } from '@mui/icons-material';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 mb-4">
              <BookIcon className="text-white text-3xl" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Library Management
            </h1>
            
            <p className="text-gray-600 text-sm">
              Sign in to access your account
            </p>
          </div>

          {/* Login Form Component */}
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            © 2024 Library Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}