'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import bookService from '../../../services/bookService';
import categoryService from '../../../services/categoryService';
import { Plus, Edit, Trash2, X, Upload, Book } from 'lucide-react';

function LibrarianBooksContent() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    language: '',
    categoryId: '',
    genre: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksData, categoriesData] = await Promise.all([
        bookService.getAllBooks(),
        categoryService.getAllCategories(),
      ]);
      setBooks(booksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        language: book.language || '',
        categoryId: book.category?.id || '',
        genre: book.genre || '',
        imageUrl: book.imageUrl || '',
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        language: '',
        categoryId: '',
        genre: '',
        imageUrl: '',
      });
    }
    setImageFile(null);
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setImageFile(null);
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      let result;

      if (imageFile) {
        // Create FormData for image upload
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('author', formData.author);
        formDataObj.append('isbn', formData.isbn);
        if (formData.language) formDataObj.append('language', formData.language);
        if (formData.categoryId) formDataObj.append('categoryId', formData.categoryId);
        if (formData.genre) formDataObj.append('genre', formData.genre);
        formDataObj.append('image', imageFile);

        if (editingBook) {
          result = await bookService.updateBookWithImage(editingBook.id, formDataObj);
        } else {
          result = await bookService.createBookWithImage(formDataObj);
        }
      } else {
        // Regular JSON request
        if (editingBook) {
          result = await bookService.updateBook(editingBook.id, formData);
        } else {
          result = await bookService.createBook(formData);
        }
      }

      setMessage({
        type: 'success',
        text: `Book ${editingBook ? 'updated' : 'created'} successfully!`
      });
      
      fetchData();
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error('Failed to save book:', error);
      setMessage({
        type: 'error',
        text: typeof error === 'string' ? error : 'Failed to save book. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookId, bookTitle) => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    try {
      await bookService.deleteBook(bookId);
      setMessage({ type: 'success', text: 'Book deleted successfully!' });
      fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to delete book:', error);
      setMessage({ type: 'error', text: 'Failed to delete book' });
    }
  };

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await bookService.updateBookStatus(bookId, newStatus);
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to update status:', error);
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  if (loading && books.length === 0) {
    return <LoadingSpinner message="Loading books..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage library books</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Books</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{books.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Available</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {books.filter(b => b.status === 'AVAILABLE').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Reserved</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {books.filter(b => b.status === 'RESERVED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Maintenance</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {books.filter(b => b.status === 'UNDER_MAINTENANCE').length}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && !showModal && (
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

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category / Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded flex items-center justify-center overflow-hidden">
                        {book.imageUrl ? (
                          <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
                        ) : (
                          <Book className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">by {book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{book.category?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{book.genre || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {book.language || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={book.status}
                      onChange={(e) => handleStatusChange(book.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="UNDER_MAINTENANCE">Maintenance</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(book)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Edit Book"
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Book"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No books found. Add your first book!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Message in Modal */}
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="text-black autofill:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter book title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="text-black autofill:text-blackw-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="text-black autofill:text-blackw-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ISBN number"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="text-black autofill:text-blackw-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="text-black autofill:text-blackw-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mystery, Romance"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="text-black autofill:text-blackw-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., English, Spanish"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
                      <Upload className="w-5 h-5 mr-2" />
                      <span className="text-sm">Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imageFile && (
                      <span className="text-sm text-gray-600">{imageFile.name}</span>
                    )}
                  </div>
                </div>

                {!imageFile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Or Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      editingBook ? 'Update Book' : 'Add Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LibrarianBooksPage() {
  return (
    <ProtectedRoute allowedRoles={['LIBRARIAN']}>
      <LibrarianBooksContent />
    </ProtectedRoute>
  );
}