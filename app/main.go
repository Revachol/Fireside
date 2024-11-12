package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("/books", func(w http.ResponseWriter, r *http.Request) {
		// books := []Book{
		// 	{ID: 1, Title: "The Hobbit", Author: "J.R.R. Tolkien", Year: 1984},
		// 	{ID: 2, Title: "1984", Author: "George Orwell", Year: 1984},
		// 	{ID: 3, Title: "To Kill a Mockingbird", Author: "Harper Lee", Year: 1984},
		// }
		var books []Book

		book1 := NewBook(1, "The Go Programming Language", "Alan A. A. Donovan", 2015)
		book2 := NewBook(2, "Clean Code", "Robert C. Martin", 2008)
		book3 := NewBook(3, "Introduction to Algorithms", "Thomas H. Cormen", 2009)

		AddBook(&books, book1)
		AddBook(&books, book2)
		AddBook(&books, book3)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(books)
	})

	http.ListenAndServe(":8080", nil)
	// var books []Book
	// publisherBookCount := make(map[string]int)

	// book1 := NewBook("The Go Programming Language", "Alan A. A. Donovan", 2015, "9780134190440", "A", "Moscow")
	// book2 := NewBook("Clean Code", "Robert C. Martin", 2008, "9780132350884", "A", "Moscow")
	// book3 := NewBook("Introduction to Algorithms", "Thomas H. Cormen", 2009, "9780262033848", "B", "Moscow")

	// items := []LibraryItem{book1, book2}
	// PrintLibraryDetails(items)

	// AddBook(&books, book1, publisherBookCount)
	// AddBook(&books, book2, publisherBookCount)
	// AddBook(&books, book3, publisherBookCount)
	// SortByYear(books, true)

	// fmt.Println("All books:")
	// PrintAllBooks(books)
	// for key, value := range publisherBookCount {
	// 	fmt.Printf("Publisher: %s, Count: %d\n", key, value)
	// }
	// fmt.Printf("\n============================\n\n")

	// fmt.Println("Books by Robert C. Martin:")
	// authorBooks := FindBooksByAuthor(books, "Robert C. Martin")
	// PrintAllBooks(authorBooks)
	// fmt.Printf("\n============================\n\n")

	// fmt.Println("Update 'Clean Code' year:")
	// updatedBook := NewBook("Clean Code", "Robert C. Martin", 2010, "9780132350884", "A", "Moscow")
	// UpdateBook(&books, "9780132350884", updatedBook)
	// PrintAllBooks(books)
	// fmt.Printf("\n============================\n\n")

	// // fmt.Println("Remove 'Clean Code':")
	// // RemoveBook(&books, "9780262033848", publisherBookCount)
	// // PrintAllBooks(books)
	// // PrintPublisher(publisherBookCount)

	// groupedBooks := BooksByPublisher(books)
	// fmt.Println(groupedBooks["A"])

	// fmt.Printf("\n============================\n\n")

	// sortedBooks := SortByYear(books, false)
	// PrintAllBooks(sortedBooks)

	// fmt.Printf("\n============================\n\n")

	// sortedBooks = SortByYear(books, true)
	// PrintAllBooks(sortedBooks)
}
