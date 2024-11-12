import React, { useState } from 'react';
import axios from 'axios';

const BookSearch = () => {
    const [title, setTitle] = useState('');
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

  const searchBooks = async () => {
    try {
      const response = await axios.get(`/api/books`, {
        params: { title, page },
      });
      setBooks(response.data.docs);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    searchBooks(); // Add this line
  };
  
  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    searchBooks(); // Add this line
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-48 bg-blue-100 p-4 rounded">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Books</h2>
      
      <div className="flex flex-col md:flex-row gap-2 w-full max-w-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {books.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Results:</h3>
          <ul className="space-y-4">
            {books.map((book) => (
              <li key={book.key} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">{book.title}</h4>
                <p className="text-gray-600">
                  Author: {book.author_name ? book.author_name.join(', ') : 'Unknown'}
                </p>
                <p className="text-gray-600">First Published: {book.first_publish_year || 'N/A'}</p>
                <p className="text-gray-600">Editions: {book.edition_count || 'N/A'}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
            >
              Previous Page
            </button>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSearch;