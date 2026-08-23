const myLibrary = [];

function Book(id, title, author, pages, read) {
    // the constructor...
    this.id = id,
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
        return id, title, author, pages, read;
    }
}

function addBookToLibrary(title, author, pages, read) {
    // take params, create a book then store it in the array
    const newID = crypto.randomUUID();
    let book = new Book(newID, title, author, pages, read);
    myLibrary.push(book);
}