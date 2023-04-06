function displayQuote(data) {
  fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
      const containerEl = document.querySelector('#quote');

      const quoteEl = document.createElement('p');
      quoteEl.classList.add('quote');
      const authorEl = document.createElement('p');
      authorEl.classList.add('author');

      quoteEl.textContent = data.content;
      authorEl.textContent = data.author;

      containerEl.appendChild(quoteEl);
      containerEl.appendChild(authorEl);
    });
}

function displayQuote2(data) {
  fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
      const quoteEl = document.querySelector('#quote');

      // const quoteEl = document.createElement('p');
      // quoteEl.classList.add('quote');
      // const authorEl = document.createElement('p');
      // authorEl.classList.add('author');

      quoteEl.textContent = data.content;
      quoteEl.textContent += data.author;
      quoteEl.textContent = `💬  ${data.content}     ~${data.author}  💬`;

      containerEl.appendChild(quoteEl);
      containerEl.appendChild(authorEl);
    });
}

displayQuote2();