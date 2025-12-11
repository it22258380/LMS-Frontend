'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, Users, FolderTree } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const isLibrarian = user?.role === 'LIBRARIAN';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Library MS</span>
            </Link>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              {/* Common Links */}
              <Link
                href={isLibrarian ? '/librarian/dashboard' : '/user/dashboard'}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {/* Librarian Links */}
              {isLibrarian && (
                <>
                  <Link
                    href="/librarian/books"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Books</span>
                  </Link>
                  <Link
                    href="/librarian/categories"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <FolderTree className="w-4 h-4" />
                    <span>Categories</span>
                  </Link>
                  <Link
                    href="/librarian/users"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </Link>
                </>
              )}

              {/* User Links */}
              {!isLibrarian && (
                <>
                  <Link
                    href="/user/books"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Browse Books</span>
                  </Link>
                  <Link
                    href="/user/profile"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user?.email}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Not Authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}