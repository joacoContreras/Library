// ==========================================================================
// Entities & State (OOP)
// ==========================================================================
const categories = [];

function Book(id, title, author, pages, read, categoryId) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.categoryId = categoryId;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
};

function Category(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.books = [];
}

Category.prototype.addBook = function (book) {
    this.books.push(book);
};

Category.prototype.removeBook = function (bookId) {
    this.books = this.books.filter(book => book.id !== bookId);
};

// ==========================================================================
// DOM Rendering (Shelves & Books)
// ==========================================================================
const booksContainer = document.querySelector('.books-container');

function createBookCardElement(book, category) {
    const card = document.createElement('div');
    card.classList.add('book-card');
    card.dataset.bookId = book.id;

    card.innerHTML = `
        <div class="book-card-header">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
        </div>
        <div class="book-card-body">
            <p class="book-pages">${book.pages} pages</p>
            <span class="badge ${book.read ? 'badge-read' : 'badge-unread'}">
                ${book.read ? 'Read' : 'Not Read'}
            </span>
        </div>
        <div class="book-card-actions">
            <button type="button" class="btn-toggle-read">
                ${book.read ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            <button type="button" class="btn-delete-book">Delete</button>
        </div>
    `;

    // Alternar estado de lectura
    const btnToggle = card.querySelector('.btn-toggle-read');
    btnToggle.addEventListener('click', () => {
        book.toggleRead();
        renderShelves();
    });

    // Eliminar libro
    const btnDelete = card.querySelector('.btn-delete-book');
    btnDelete.addEventListener('click', () => {
        category.removeBook(book.id);
        renderShelves();
    });

    return card;
}

function createShelfElement(category) {
    const shelf = document.createElement('section');
    shelf.classList.add('shelf');
    shelf.dataset.categoryId = category.id;

    const header = document.createElement('div');
    header.classList.add('shelf-header');

    const info = document.createElement('div');
    info.classList.add('shelf-info');

    const title = document.createElement('h2');
    title.classList.add('shelf-title');
    title.textContent = category.name;

    const descr = document.createElement('p');
    descr.classList.add('shelf-description');
    descr.textContent = category.description || 'No description provided.';

    info.appendChild(title);
    info.appendChild(descr);

    // Botón para agregar libro a esta categoría específica
    const btnAddBook = document.createElement('button');
    btnAddBook.type = 'button';
    btnAddBook.classList.add('btn-add-book');
    btnAddBook.dataset.categoryId = category.id;
    btnAddBook.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add Book</span>
    `;

    btnAddBook.addEventListener('click', () => {
        openBookModal(category.id);
    });

    header.appendChild(info);
    header.appendChild(btnAddBook);

    // Contenedor de Libros
    const booksGrid = document.createElement('div');
    booksGrid.classList.add('shelf-books');

    if (category.books.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.classList.add('empty-shelf-msg');
        emptyMsg.textContent = 'No books in this shelf yet. Click "Add Book" to start cataloging.';
        booksGrid.appendChild(emptyMsg);
    } else {
        category.books.forEach(book => {
            const bookCard = createBookCardElement(book, category);
            booksGrid.appendChild(bookCard);
        });
    }

    shelf.appendChild(header);
    shelf.appendChild(booksGrid);

    return shelf;
}

function renderShelves() {
    booksContainer.innerHTML = '';
    categories.forEach(category => {
        const shelfElement = createShelfElement(category);
        booksContainer.appendChild(shelfElement);
    });
}

// ==========================================================================
// Category Modal Logic
// ==========================================================================
const btnNewCategory = document.getElementById('new-category');
const modalCategory = document.getElementById('modal-category');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const categoryDescriptionInput = document.getElementById('category-description');

function openCategoryModal() {
    modalCategory.classList.remove('hidden');
    categoryNameInput.focus();
}

function closeCategoryModal() {
    modalCategory.classList.add('hidden');
    categoryForm.reset();
}

btnNewCategory.addEventListener('click', openCategoryModal);
btnCloseModal.addEventListener('click', closeCategoryModal);
btnCancelModal.addEventListener('click', closeCategoryModal);

modalCategory.addEventListener('click', (e) => {
    if (e.target === modalCategory) closeCategoryModal();
});

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = categoryNameInput.value.trim();
    const description = categoryDescriptionInput.value.trim();

    if (!name) return;

    const newCategory = new Category(crypto.randomUUID(), name, description);
    categories.push(newCategory);
    renderShelves();
    closeCategoryModal();
});

// ==========================================================================
// Book Modal Logic
// ==========================================================================
const modalBook = document.getElementById('modal-book');
const btnCloseBookModal = document.getElementById('btn-close-book-modal');
const btnCancelBookModal = document.getElementById('btn-cancel-book-modal');
const bookForm = document.getElementById('book-form');
const bookCategoryIdInput = document.getElementById('book-category-id');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const bookPagesInput = document.getElementById('book-pages');
const bookReadInput = document.getElementById('book-read');

function openBookModal(categoryId) {
    bookCategoryIdInput.value = categoryId;
    modalBook.classList.remove('hidden');
    bookTitleInput.focus();
}

function closeBookModal() {
    modalBook.classList.add('hidden');
    bookForm.reset();
}

btnCloseBookModal.addEventListener('click', closeBookModal);
btnCancelBookModal.addEventListener('click', closeBookModal);

modalBook.addEventListener('click', (e) => {
    if (e.target === modalBook) closeBookModal();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const categoryId = bookCategoryIdInput.value;
    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const pages = parseInt(bookPagesInput.value, 10);
    const read = bookReadInput.checked;

    if (!title || !author || !pages) return;

    const targetCategory = categories.find(cat => cat.id === categoryId);
    if (targetCategory) {
        const newBook = new Book(crypto.randomUUID(), title, author, pages, read, categoryId);
        targetCategory.addBook(newBook);
        renderShelves();
    }

    closeBookModal();
});

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!modalCategory.classList.contains('hidden')) closeCategoryModal();
        if (!modalBook.classList.contains('hidden')) closeBookModal();
    }
});

// ==========================================================================
// Initial Sample Data (for demonstration)
// ==========================================================================
const sampleCat1 = new Category(
    crypto.randomUUID(),
    'Philosophy & Classical Literature',
    'Foundational treatises on ethics, governance, and philosophy of thought.'
);
sampleCat1.addBook(new Book(crypto.randomUUID(), 'Meditations', 'Marcus Aurelius', 254, true, sampleCat1.id));
sampleCat1.addBook(new Book(crypto.randomUUID(), 'The Republic', 'Plato', 416, false, sampleCat1.id));

const sampleCat2 = new Category(
    crypto.randomUUID(),
    'Science Fiction & Speculative',
    'Works exploring far futures, cybernetics, and interstellar societies.'
);
sampleCat2.addBook(new Book(crypto.randomUUID(), 'Dune', 'Frank Herbert', 412, true, sampleCat2.id));
sampleCat2.addBook(new Book(crypto.randomUUID(), 'Neuromancer', 'William Gibson', 271, false, sampleCat2.id));

categories.push(sampleCat1, sampleCat2);
renderShelves();


