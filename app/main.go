package main

import (
	"encoding/json"
	"net/http"
)

var books = []Book{
	NewBook(1, "The Go Programming Language", "Alan A. A. Donovan", 2015),
	NewBook(2, "Clean Code", "Robert C. Martin", 2008),
	NewBook(3, "Introduction to Algorithms", "Thomas H. Cormen", 2009),
}

func generateID() int {
	maxID := 0
	for _, book := range books {
		if book.ID > maxID {
			maxID = book.ID
		}
	}
	return maxID + 1
}

func booksHandler(w http.ResponseWriter, r *http.Request) {
	// Устанавливаем заголовки CORS
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		// Если это preflight-запрос, возвращаем OK
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == "GET" {
		// Возвращаем список всех книг
		json.NewEncoder(w).Encode(books)
	} else if r.Method == "POST" {
		// Обрабатываем добавление новой книги
		var book Book
		if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		book.ID = generateID()
		AddBook(&books, book)
		json.NewEncoder(w).Encode(book)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/books", booksHandler)
	http.ListenAndServe(":8080", nil)
}
