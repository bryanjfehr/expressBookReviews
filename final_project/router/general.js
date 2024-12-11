const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4)); 
});

// Get the book list with async-await
public_users.get('/async', async function (req, res) {
    try {
        const bookList = books;
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        console.error('Error while retrieving the book information:', error);
        res.status(500).json({ message: 'Error while loading the books' });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbnLookup = req.params.isbn;
    const isbnBookList= Object.values(books).filter(book=>book.ISBN===isbnLookup);
    if (isbnBookList.length>0){
      res.send(isbnBookList);  
    }else{
        res.status(404).json({message: `No books found with ISBN ${isbnLookup}`})
    }
});

public_users.get('/isbn-async/:isbn', async function (req, res) {
    try {
        const isbnLookup = req.params.isbn;
        const bookDetails = Object.values(books).find(book => book.ISBN === isbnLookup);
        if (bookDetails) {
            res.send(bookDetails);
        } else {
            res.status(404).json({ message: `No book found with ISBN ${isbnLookup}` });
        }
    } catch (error) {
        console.error('Error while retrieving the book data.:', error);
        res.status(500).json({ message: 'Error while loading books during async' });
    }
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorToFind = req.params.author;
    const authorBookList = Object.values(books).filter(book => book.author === authorToFind);

    if (authorBookList.length > 0) {
        res.send(authorBookList);
    } else {
        res.status(404).json({ message: `No books by the author ${authorToFind}` });
    }
});

// Get book details based on author using async-await
public_users.get('/author-async/:author', async function (req, res) {
    try {
        const authorToFind = req.params.author;
        const authorBookList = Object.values(books).filter(book => book.author === authorToFind);
        if (authorBookList.length > 0) {
            res.send(authorBookList);
        } else {
            res.status(404).json({ message: `No books by the author ${authorToFind}` });
        }
    } catch (error) {
        console.error('Error while searching for the author', error);
        res.status(500).json({ message: 'Error during loading of the book list.' });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleToFind=req.params.title;
  const titleBookList=Object.values(books).filter(book=>book.title===titleToFind);
  if (titleBookList.length>0){
      res.send(titleBookList);
  } else{
    res.status(404).json({ message: `No books with the title${titleToFind}` });
}

});

// Get book details based on title using async-await
public_users.get('/title-async/:title', async function (req, res) {
    try {
        const titleToFind = req.params.title;
        const titleBookList = Object.values(books).filter(book => book.title === titleToFind);

        if (titleBookList.length > 0) {
            res.send(titleBookList);
        } else {
            res.status(404).json({ message: `No books with the title ${titleToFind}` });
        }
    } catch (error) {
        console.error('Error receiving response:', error);
        res.status(500).json({ message: 'Error while loading book information' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnLookup = req.params.isbn;
    const isbnBookList = Object.values(books).find(book => book.ISBN === isbnLookup);
    if (isbnBookList) {
        const reviews = isbnBookList.reviews || {};
        res.send(reviews);
    } else {
        res.status(404).json({ message: `Nessun libro trovato per ISBN ${isbnLookup}` });
    }
});

module.exports.general = public_users;