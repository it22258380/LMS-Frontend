'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { User, Mail, Phone, MapPin } from 'lucide-react';

function UserProfileContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your account information</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900">{user?.email}</h2>
            <p className="text-gray-600">Member</p>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center text-gray-700">
            <Mail className="w-5 h-5 mr-3 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <User className="w-5 h-5 mr-3 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-600">
            To view your complete profile and reservation history, you'll need to fetch 
            user data from the backend using the user ID.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <UserProfileContent />
    </ProtectedRoute>
  );
}