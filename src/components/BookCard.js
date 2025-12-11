'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function BookCard({ book, linkPrefix = '/user' }) {
  const statusColors = {
    AVAILABLE: 'bg-green-100 text-green-800',
    RESERVED: 'bg-yellow-100 text-yellow-800',
    UNDER_MAINTENANCE: 'bg-red-100 text-red-800',
  };

  return (
    <Link href={`${linkPrefix}/books/${book.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Book Image */}
        <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <BookOpen className="w-20 h-20 text-blue-300" />
          )}
          
          {/* Status Badge */}
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${
              statusColors[book.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {book.status}
          </span>
        </div>

        {/* Book Details */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

          {/* Additional Info */}
          <div className="mt-auto space-y-1">
            {book.category && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Category:</span> {book.category.name}
              </p>
            )}
            {book.genre && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Genre:</span> {book.genre}
              </p>
            )}
            {book.language && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Language:</span> {book.language}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              ISBN: {book.isbn}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}