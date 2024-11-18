import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  useEffect(() => {
    fetch("http://localhost:8080/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Функция для отправки новой книги на сервер
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
        setBooks([...books, addedBook]); // Обновляем список книг
        setNewBook({ title: '', author: '' }); // Очищаем форму
      } else {
        console.error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div style={{padding: '20px' }}>
      <h1>Book Manager</h1>
      <p class="help">Welcome to your personal book collection manager.</p>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
            <button type="delete">Delete Book</button>
          </li>
        ))}
      </ul>

      {/* Форма добавления новой книги */}
      <h2>Add a New Book</h2>
      <form onSubmit={addBook} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default App;
