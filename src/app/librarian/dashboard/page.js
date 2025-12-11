'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import bookService from '../../../services/bookService';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { BookOpen, Users, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function LibrarianDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    reservedBooks: 0,
    maintenanceBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const books = await bookService.getAllBooks();
      setStats({
        totalBooks: books.length,
        availableBooks: books.filter(b => b.status === 'AVAILABLE').length,
        reservedBooks: books.filter(b => b.status === 'RESERVED').length,
        maintenanceBooks: books.filter(b => b.status === 'UNDER_MAINTENANCE').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your library resources</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reservedBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.maintenanceBooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/librarian/books"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Books</h3>
          <p className="text-gray-600 text-sm">Add, edit, or delete books from the catalog</p>
        </Link>

        <Link
          href="/librarian/categories"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Categories</h3>
          <p className="text-gray-600 text-sm">Organize books into categories</p>
        </Link>

        <Link
          href="/librarian/users"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <Users className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm">View and manage library members</p>
        </Link>
      </div>
    </div>
  );
}

export default function LibrarianDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['LIBRARIAN']}>
      <LibrarianDashboardContent />
    </ProtectedRoute>
  );
}