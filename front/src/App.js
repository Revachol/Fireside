import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: 0 });

  useEffect(() => {
    fetch("http://localhost:8080/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const addedBook = await response.json();
        setBooks([...books, addedBook]);
        setNewBook({ title: '', author: '', year: 0 });
      } else {
        console.error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const deleteBook = (id) => {
    fetch("http://localhost:8080/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id })
    })
      .then((response) => {
        if (response.ok) {
          setBooks(books.filter((book) => book.id !== id));
        } else {
          console.error("Error deleting book");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Book Manager</h1>
        <p>Welcome to your personal book collection manager.</p>
      </div>

      <h2>Book List</h2>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <span className="book-title">{book.title}</span> by {book.author}, {book.year}
            <button onClick={() => deleteBook(book.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>

      <h2>Add a New Book</h2>
      <form onSubmit={addBook} style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Year"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default App;
