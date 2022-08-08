//BOOK class represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI CLASS to handle UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML =
            `<td>${book.title}</td >
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a><td>` ;

        list.appendChild(row);
    }
    static deleteBook(target) {
        if (target.classList.contains('delete')) {
            if (confirm('Are you sure?')) {
                target.parentElement.parentElement.remove();

            }
        }
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //make invisble after 3 seconds

        setTimeout(() => document.querySelector('.alert').remove(), 3000);

    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}
//store class : handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') == null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

}
//event : display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//event: add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //get form values
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate a book
    if (title == '' || author == '' || isbn == '')
        UI.showAlert('Please fill in all fields', 'danger');
    else {
        const book = new Book(title, author, isbn);
        //add book to UI
        UI.addBookToList(book);
        //add book to store
        Store.addBook(book);
        UI.showAlert('Book successfully added', 'success');

        //CLEAR FIELDS
        UI.clearFields();
    }
});
//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    //REMOVE BOOK FROM STORE
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book Removed from the list!', 'success');
});
