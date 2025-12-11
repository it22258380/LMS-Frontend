'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import bookService from '../../../../services/bookService';
import reservationService from '../../../../services/reservationService';
import { useAuth } from '../../../../contexts/AuthContext';
import { ArrowLeft, BookOpen, User, Calendar, Globe, Tag } from 'lucide-react';
import { RESERVATION_PERIODS } from '../../../../utils/constants';

function BookDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  const fetchBook = async () => {
    try {
      const data = await bookService.getBookById(params.id);
      setBook(data);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      setMessage({ type: 'error', text: 'Failed to load book details' });
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    if (!book || book.status !== 'AVAILABLE') {
      setMessage({ type: 'error', text: 'This book is not available for reservation' });
      return;
    }

    setReserving(true);
    setMessage({ type: '', text: '' });

    try {
      // Get user ID from email (you might need to adjust this based on your backend)
      // For now, we'll need to fetch user profile to get the ID
      // This is a simplified version - you may need to store user ID in context
      
      await reservationService.createReservation(user.id, book.id);
      
      setMessage({
        type: 'success',
        text: `Successfully reserved "${book.title}" for ${selectedPeriod} days!`
      });
      
      // Refresh book data
      setTimeout(() => {
        fetchBook();
      }, 2000);
    } catch (error) {
      console.error('Reservation failed:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to reserve book. Please try again.'
      });
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading book details..." />;
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Book not found</p>
          <button
            onClick={() => router.push('/user/books')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Books
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    AVAILABLE: 'bg-green-100 text-green-800 border-green-300',
    RESERVED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    UNDER_MAINTENANCE: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/user/books')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Books
      </button>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Book Details */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-12 flex items-center justify-center">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="max-h-96 w-auto object-contain rounded-lg shadow-lg"
              />
            ) : (
              <BookOpen className="w-48 h-48 text-blue-300" />
            )}
          </div>

          {/* Book Information */}
          <div className="p-8">
            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
                  statusColors[book.status]
                }`}
              >
                {book.status}
              </span>
            </div>

            {/* Title and Author */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

            {/* Details Grid */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Tag className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-semibold mr-2">ISBN:</span>
                <span>{book.isbn}</span>
              </div>

              {book.category && (
                <div className="flex items-center text-gray-700">
                  <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-semibold mr-2">Category:</span>
                  <span>{book.category.name}</span>
                </div>
              )}

              {book.genre && (
                <div className="flex items-center text-gray-700">
                  <Tag className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-semibold mr-2">Genre:</span>
                  <span>{book.genre}</span>
                </div>
              )}

              {book.language && (
                <div className="flex items-center text-gray-700">
                  <Globe className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-semibold mr-2">Language:</span>
                  <span>{book.language}</span>
                </div>
              )}
            </div>

            {/* Reservation Section */}
            {book.status === 'AVAILABLE' && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reserve This Book</h2>
                
                {/* Period Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Reservation Period
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {RESERVATION_PERIODS.map((period) => (
                      <button
                        key={period.value}
                        onClick={() => setSelectedPeriod(period.value)}
                        className={`px-4 py-3 rounded-lg border-2 font-semibold transition ${
                          selectedPeriod === period.value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reserve Button */}
                <button
                  onClick={handleReservation}
                  disabled={reserving}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {reserving ? 'Reserving...' : `Reserve for ${selectedPeriod} Days`}
                </button>
              </div>
            )}

            {book.status === 'RESERVED' && (
              <div className="border-t pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    This book is currently reserved by another user.
                  </p>
                </div>
              </div>
            )}

            {book.status === 'UNDER_MAINTENANCE' && (
              <div className="border-t pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">
                    This book is currently under maintenance and not available for reservation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <BookDetailsContent />
    </ProtectedRoute>
  );
}