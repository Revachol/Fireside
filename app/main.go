package main

import (
	"encoding/json"
	"net/http"
	"sort"
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
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, SORT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		// Если это preflight-запрос, возвращаем OK
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case "GET":
		json.NewEncoder(w).Encode(books)
	case "POST":
		var book Book
		if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		book.ID = generateID()
		AddBook(&books, book)
		json.NewEncoder(w).Encode(book)
	case "DELETE":
		// Получаем ID книги из запроса
		var book Book
		if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		RemoveBook(&books, book.ID)
		w.WriteHeader(http.StatusOK)

		http.Error(w, "Book not found", http.StatusNotFound)
	case "SORT":
		SortByYear(&books, true)

		w.WriteHeader(http.StatusOK)

		http.Error(w, "Book not found", http.StatusNotFound)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getSortedBooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Получение параметра сортировки из URL
	sortParam := r.URL.Query().Get("sort")

	// Копируем массив books для сортировки
	sortedBooks := make([]Book, len(books))
	copy(sortedBooks, books)

	// Сортируем книги в зависимости от параметра
	switch sortParam {
	case "title":
		sort.Slice(sortedBooks, func(i, j int) bool {
			return sortedBooks[i].Title < sortedBooks[j].Title
		})
	case "author":
		sort.Slice(sortedBooks, func(i, j int) bool {
			return sortedBooks[i].Author < sortedBooks[j].Author
		})
	case "year":
		sort.Slice(sortedBooks, func(i, j int) bool {
			return sortedBooks[i].Year < sortedBooks[j].Year
		})
	}

	json.NewEncoder(w).Encode(sortedBooks)
}

func main() {
	http.HandleFunc("/books", booksHandler)
	http.HandleFunc("/sortedBooks", getSortedBooks)

	http.ListenAndServe(":8080", nil)
}
