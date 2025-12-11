'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import BookCard from '../../../components/BookCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import bookService from '../../../services/bookService';
import { Search, Filter } from 'lucide-react';

function UserBooksContent() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    searchType: 'title', // title, author, genre
    status: 'all', // all, AVAILABLE, RESERVED
    language: 'all',
    genre: 'all',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, searchTerm, filters]);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...books];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(book => {
        const term = searchTerm.toLowerCase();
        switch (filters.searchType) {
          case 'title':
            return book.title.toLowerCase().includes(term);
          case 'author':
            return book.author.toLowerCase().includes(term);
          case 'genre':
            return book.genre?.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(book => book.status === filters.status);
    }

    // Language filter
    if (filters.language !== 'all') {
      result = result.filter(book => book.language === filters.language);
    }

    // Genre filter
    if (filters.genre !== 'all') {
      result = result.filter(book => book.genre === filters.genre);
    }

    setFilteredBooks(result);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
      return;
    }

    setLoading(true);
    try {
      let searchResults;
      switch (filters.searchType) {
        case 'title':
          searchResults = await bookService.searchByTitle(searchTerm);
          break;
        case 'author':
          searchResults = await bookService.searchByAuthor(searchTerm);
          break;
        case 'genre':
          searchResults = await bookService.searchByGenre(searchTerm);
          break;
        default:
          searchResults = books;
      }
      setFilteredBooks(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const languages = [...new Set(books.map(b => b.language).filter(Boolean))];
  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];

  if (loading && books.length === 0) {
    return <LoadingSpinner message="Loading books..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
        <p className="text-gray-600 mt-2">Discover and reserve your next read</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <select
              value={filters.searchType}
              onChange={(e) => setFilters({...filters, searchType: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Options */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
          </select>

          {languages.length > 0 && (
            <select
              value={filters.language}
              onChange={(e) => setFilters({...filters, language: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}

          {genres.length > 0 && (
            <select
              value={filters.genre}
              onChange={(e) => setFilters({...filters, genre: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                searchType: 'title',
                status: 'all',
                language: 'all',
                genre: 'all',
              });
              setFilteredBooks(books);
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredBooks.length}</span> books
        </p>
      </div>

      {/* Books Grid */}
      {loading ? (
        <LoadingSpinner message="Searching..." />
      ) : filteredBooks.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

export default function UserBooksPage() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <UserBooksContent />
    </ProtectedRoute>
  );
}