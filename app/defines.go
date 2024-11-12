package main

type Book struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
	Year   int    `json:"year"`
}

func NewBook(id int, title, author string, year int) Book {
	return Book{
		ID:     id,
		Title:  title,
		Author: author,
		Year:   year,
	}
}

// type LibraryItem interface {
// 	GetDetails() string
// }
