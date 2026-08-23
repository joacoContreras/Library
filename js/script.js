// Object Book
const categories = [];

function addCategory(name, description) {
    const id = crypto.randomUUID();
    const newCategory = new Category(id, name, description);
    categories.push(newCategory);
    return newCategory;
}

function Book(id, title, author, pages, read, category) {
    // the constructor...
    this.id = id,
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.category = category
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
};

// Object Category
function Category (id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.books = [];
} 

// Metodos en el prototipo para no duplicar funciones en memoria
Category.prototype.addBook = function(book) {
    this.books.push(book);
}

Category.prototype.removeBook = function(bookId) {
    this.books = this.books.filter(book => book.id !==book);
}


function addBookToLibrary(title, author, pages, read, category) {
    // take params, create a book then store it in the array
    const newID = crypto.randomUUID();
    let book = new Book(newID, title, author, pages, read, category);
    myLibrary.push(book);
}

// ==========================================================================
// Modal Logic
// ==========================================================================
const btnNewCategory = document.getElementById('new-category');
const modalCategory = document.getElementById('modal-category');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const categoryDescriptionInput = document.getElementById('category-description');

// Abrir el modal
function openModal() {
    modalCategory.classList.remove('hidden');
    categoryNameInput.focus();
}

// Cerrar el modal y limpiar formulario
function closeModal() {
    modalCategory.classList.add('hidden');
    categoryForm.reset();
}

// Event Listeners para abrir y cerrar
btnNewCategory.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);

// Cerrar al hacer clic sobre el fondo oscuro (backdrop)
modalCategory.addEventListener('click', (e) => {
    if (e.target === modalCategory) {
        closeModal();
    }
});

// Cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalCategory.classList.contains('hidden')) {
        closeModal();
    }
});

// Manejo del formulario de categoría
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = categoryNameInput.value.trim();
    const description = categoryDescriptionInput.value.trim();

    if (!name) return;

    console.log('New Category created:', { name, description });

    // Cierra el modal tras guardar
    closeModal();
});