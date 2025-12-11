'use client';

import Link from 'next/link';
import { BookOpen, Users, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'LIBRARIAN') {
        router.push('/librarian/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-20 h-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Library Management System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            A modern, efficient system for managing library resources and user interactions
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-4 mb-16">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {/* User Features */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <Users className="w-10 h-10 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">For Members</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Browse and search extensive book catalog
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Filter books by category, author, genre, and language
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Reserve books for flexible periods (7, 14, or 21 days)
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                View personal profile and reservation history
              </li>
            </ul>
          </div>

          {/* Librarian Features */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <Shield className="w-10 h-10 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">For Librarians</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Complete book management (Add, Edit, Delete)
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Manage book categories and inventory
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Update book status and availability
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                User management and blacklist control
              </li>
            </ul>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Built with Modern Technology</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js', 'Spring Boot', 'JWT Auth', 'MySQL', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}