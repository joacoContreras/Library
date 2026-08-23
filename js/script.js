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
    this.books = this.books.filter(book => book.id !==bookId);
}


function addBookToLibrary(title, author, pages, read, category) {
    // take params, create a book then store it in the array
    const newID = crypto.randomUUID();
    let book = new Book(newID, title, author, pages, read, category);
    myLibrary.push(book);
}

// Shelves Logic
const booksContainer = document.querySelector('.books-container');

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

    // Btn para agregar libro a una categoria
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

    header.appendChild(info);
    header.appendChild(btnAddBook);

    // Contenedor de Libros
    const booksGrid = document.createElement('div');
    booksGrid.classList.add('shelf-books');

    if(category.books.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.classList.add('empty-shelf-msg');                                                                                                                      
        emptyMsg.textContent = 'No books in this shelf yet. Click "Add Book" to start cataloging.';                                                                     
        booksGrid.appendChild(emptyMsg);        
    } else {
        // Renderizamos las tarjetas de libros
    }

    shelf.appendChild(header);
    shelf.appendChild(booksGrid);

    return shelf;
}

function renderShelves() {
    // Limpiamos el contenedor antes de redibujar
    booksContainer.innerHTML = '';

    categories.forEach(category => {
        const shelfElement = createShelfElement(category);
        booksContainer.appendChild(shelfElement);
    })
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

    // 1. Creamos la nueva instaciona de Category
    const newCategory = new Category(crypto.randomUUID(), name, description);

    // 2. La guardamos en el array global
    categories.push(newCategory);

    // 3. Volvemos a renderizar los estantes en la pantalla
    renderShelves();

    // Cierra el modal tras guardar
    closeModal();
});