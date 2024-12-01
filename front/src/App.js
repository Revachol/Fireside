import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, Button, TextField, ListItemText, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


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

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error("Failed to fetch books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Функция для запроса сортированных книг
  const fetchSortedBooks = async (sortBy) => {
    try {
      const response = await fetch(`http://localhost:8080/sortedBooks?sort=${sortBy}`);
      if (response.ok) {
        const sortedData = await response.json();
        setBooks(sortedData);
      } else {
        console.error("Failed to fetch sorted books");
      }
    } catch (error) {
      console.error("Error fetching sorted books:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center">Book Manager</Typography>
      <Typography variant="body1" align="center">Welcome to your personal book collection manager.</Typography>

      <Box display="flex" justifyContent="center" my={2}>
        <Button variant="contained" color="primary" onClick={() => fetchSortedBooks('title')}>Sort by Title</Button>
        <Button variant="contained" color="primary" onClick={() => fetchSortedBooks('author')} style={{ marginLeft: '10px' }}>Sort by Author</Button>
        <Button variant="contained" color="primary" onClick={() => fetchSortedBooks('year')} style={{ marginLeft: '10px' }}>Sort by Year</Button>
      </Box>

      <List>
        {books.map((book) => (
          <ListItem key={book.id} secondaryAction={
            <Button onClick={() => deleteBook(book.id)} color="secondary" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          }>
            <ListItemText primary={`${book.title} by ${book.author}`} secondary={`Year: ${book.year}`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">Add a New Book</Typography>
      <form onSubmit={addBook} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <TextField
          label="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <TextField
          label="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <TextField
          label="Year"
          type="number"
          value={newBook.year}
          onChange={(e) => setNewBook({ ...newBook, year: parseInt(e.target.value) || 0 })}
          required
        />
        <Button type="submit" variant="contained" color="primary">Add Book</Button>
      </form>
    </Container>
  );
}

export default App;
