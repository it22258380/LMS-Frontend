'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import bookService from '../../../services/bookService';
import reservationService from '../../../services/reservationService';
import BookCard from '../../../components/BookCard';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';

function UserDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    reservedBooks: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [allBooks, availableBooks] = await Promise.all([
        bookService.getAllBooks(),
        bookService.getAvailableBooks(),
      ]);

      setStats({
        totalBooks: allBooks.length,
        availableBooks: availableBooks.length,
        reservedBooks: allBooks.filter(b => b.status === 'RESERVED').length,
      });

      // Show 6 most recent available books
      setRecentBooks(availableBooks.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">Explore our library collection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <p className="text-sm text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reservedBooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/user/books"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition"
          >
            <BookOpen className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">Browse All Books</h3>
            <p className="text-sm text-blue-100">Explore our complete catalog</p>
          </Link>
          <Link
            href="/user/profile"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition"
          >
            <Clock className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">My Reservations</h3>
            <p className="text-sm text-blue-100">View your borrowed books</p>
          </Link>
        </div>
      </div>

      {/* Recent Books */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Available</h2>
          <Link
            href="/user/books"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All →
          </Link>
        </div>

        {recentBooks.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No books available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <UserDashboardContent />
    </ProtectedRoute>
  );
}