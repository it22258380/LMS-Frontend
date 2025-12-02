'use client';

import Link from 'next/link';
import { BookCard } from '../../components/books/BookCard'; // Assuming you have this simple component

interface Book {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
}

interface FeaturedBooksProps {
  books: Book[];
}

export const FeaturedBooks = ({ books }: FeaturedBooksProps) => {
  if (books.length === 0) {
    return <div className="text-center text-gray-500 py-10">No featured books available right now.</div>;
  }
    
  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {/* Horizontal scroll container with scrollbar hidden on most browsers */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      
      {books.map((book) => (
        <div key={book.id} className="flex-none w-60">
          <BookCard book={book} />
        </div>
      ))}
      
      {/* End link to push the scroll view */}
      <div className="flex-none w-60 flex items-center justify-center p-4">
        <Link href="/books/search" className="text-center text-indigo-600 font-semibold hover:underline">
          <p>See All</p>
          <p className="text-3xl">→</p>
        </Link>
      </div>
    </div>
  );
};