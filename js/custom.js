let API_URL = 'https://gutendex.com/books';
let currentPage = 1;
let booksData = [];
let genres = [];

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPageSpan = document.getElementById('current-page');
const loadingElement = document.getElementById('loading');
const searchField = document.getElementById('search-field');
const genreFilter = document.getElementById('genre-filter');
const paginationDiv = document.getElementById('pagination');

async function fetchBookList(url) {
    try {
        loadingElement.style.display = 'block'; 
        paginationDiv.style.display = 'none'; 
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        booksData = data.results;
        // console.log("Books data fetched:", booksData);

        displayBooks(booksData);
        genreList(booksData);
        updatePaginationButtons(data.previous, data.next);
    } catch (error) {
        console.error('There was a problem fetching the book list:', error);
    } finally {
        loadingElement.style.display = 'none'; 
        paginationDiv.style.display = 'inherit'; 
    }
}

function displayBooks(books) {
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    if (books.length === 0) {
        container.innerHTML = '<p class="text-center p-5 mx-auto w-full text-2xl">No books found with the given Title!</p>'; 
        return;
    }

    books.forEach(book => {
        const author = book.authors.length > 0 ? book.authors[0].name : 'Unknown author';
        const subjects = book.subjects.join(', ') || 'No subjects listed';
        const coverImage = book.formats['image/jpeg'] || 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg';
        const bookID = book.id;

        const savedBooks = JSON.parse(localStorage.getItem('wishlistedBooks')) || [];
        const isWishlisted = savedBooks.some(savedBook => savedBook.id === bookID);

        const bookDiv = document.createElement('div');
        bookDiv.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');

        bookDiv.innerHTML = `
      <div>
        <div id="cover-img" class="cover-img w-full h-[300px]">
          <img class="hover:grow hover:shadow-lg w-full h-full rounded"
          src="${coverImage}" alt="${book.title} cover">
        </div>
        <div class="pt-5 flex items-start justify-between w-full">
          <a href="book-details.html" id="book-title" class="font-bold hover:text-black text-[18px] w-4/5">${book.title}</a>
          <div class="flex justify-end w-1/5 mt-1">
          <img class="w-5 h-5 cursor-pointer love-icon" data-book-id="${bookID}" src="${isWishlisted ? `images/heart-solid.svg` : `images/heart-regular.svg`} " alt="">
          </div>
        </div>
        <p id="author-name" class="author-name text-sm">Written by: ${author}</p>
        <div class="flex justify-between mt-5 text-sm w-full">
          <p id="genre" class="w-2/3">Genre: ${subjects}</p>
          <p id="book-id" class="text-gray-900 w-1/3 text-right">ID: ${bookID}</p>
        </div>
      </div>
    `;

        container.appendChild(bookDiv);
    });

    document.querySelectorAll('.love-icon').forEach(icon => {
        icon.addEventListener('click', toggleWishlist);
    });
}

function toggleWishlist(event) {
    const bookID = event.target.getAttribute('data-book-id');

    console.log(`Toggling wishlist for book ID: ${bookID}`); 

    let savedBooks = JSON.parse(localStorage.getItem('wishlistedBooks')) || [];
    const bookIndex = savedBooks.findIndex(book => book.id == bookID);

    if (bookIndex > -1) {
        savedBooks.splice(bookIndex, 1);
        event.target.src = 'images/heart-regular.svg'; 
    } else {
        const bookToWishlist = booksData.find(book => book.id == bookID);
        
        if (!bookToWishlist) {
            console.error(`Book with ID ${bookID} not found in booksData`);
            return;
        }

        savedBooks.push(bookToWishlist);
        event.target.src = 'images/heart-solid.svg';
    }

    localStorage.setItem('wishlistedBooks', JSON.stringify(savedBooks));
}

function genreList(books){
    const uniqueGenres = new Set();

    books.forEach( book => {
        book.subjects.forEach(subject => 
            uniqueGenres.add(subject)
        );
    });

    genreFilter.innerHTML = '<option value="">Select a genre</option>';

    uniqueGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

function filterBooksByGenre(genre){
    if (genre === ""){
        displayBooks(booksData);
    } else {
        const filteredBooks = booksData.filter(book => 
            book.subjects.includes(genre)
        );
        displayBooks(filteredBooks);
    }
}

function updatePaginationButtons(previous, next) {
    if (previous) {
        prevBtn.disabled = false;
        prevBtn.setAttribute('data-url', previous);
    } else {
        prevBtn.disabled = true;
    }
    if (next) {
        nextBtn.disabled = false;
        nextBtn.setAttribute('data-url', next);
    } else {
        nextBtn.disabled = true;
    }
    currentPageSpan.textContent = `Page: ${currentPage}`;
}

// Add event listeners for pagination buttons after the DOM is loaded
prevBtn.addEventListener('click', () => {
    const prevUrl = prevBtn.getAttribute('data-url');
    if (prevUrl) {
        currentPage--;
        fetchBookList(prevUrl);
    }
});

nextBtn.addEventListener('click', () => {
    const nextUrl = nextBtn.getAttribute('data-url');
    if (nextUrl) {
        currentPage++;
        fetchBookList(nextUrl);
    }
});

searchField.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = booksData.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );
    displayBooks(filteredBooks);
});

genreFilter.addEventListener('change', (e) => {
    const selectGenre = e.target.value;
    filterBooksByGenre(selectGenre);
})


// Fetch the initial book list
fetchBookList(API_URL);
