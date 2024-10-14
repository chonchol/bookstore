const API_URL = 'https://gutendex.com/books'; 

async function fetchBookList() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const books = data.results;

    document.getElementById('loading').style.display = 'none';

    displayBooks(books);
  } catch (error) {
    console.error('There was a problem fetching the book list:', error);
    document.getElementById('loading').style.display = 'none';
  }
}

function displayBooks(books) {
  const container = document.getElementById('books-container'); 

  container.innerHTML = '';

  books.forEach(book => {
    const author = book.authors.length > 0 ? book.authors[0].name : 'Unknown author';
    const subjects = book.subjects.join(', ') || 'No subjects listed';
    const coverImage = book.formats['image/jpeg'] || 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg'; 
    const bookID = book.id;

    const bookDiv = document.createElement('div');
    bookDiv.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');

    bookDiv.innerHTML = `
      <div>
        <div id="cover-img" class="cover-img w-full h-[300px]">
          <img class="hover:grow hover:shadow-lg w-full h-full rounded"
          src="${coverImage}" alt="${book.title} cover">
        </div>
        <div class="pt-5 flex items-center justify-between">
          <a href="https://www.gutenberg.org/ebooks/${bookID}" id="book-title" class="hover:text-black text-[18px]">${book.title}</a>
          <svg class="h-5 w-5 fill-current text-gray-500 hover:text-black cursor-pointer" xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
        </div>
        <p id="author-name" class="author-name text-sm">Written by: ${author}</p>
        <div class="flex justify-between mt-5 text-sm">
          <p id="genre">Genre: ${subjects}</p>
          <p id="book-id" class="text-gray-900">ID: ${bookID}</p>
        </div>
      </div>
    `;


    container.appendChild(bookDiv);
  });
}

fetchBookList();
