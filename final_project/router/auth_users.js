const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const lookupISBN = req.params.isbn;
    const bookList = Object.values(books).find(book => book.ISBN === lookupISBN);

    if (bookList) {
        const reviews = bookList.reviews || {};
        const username = req.session.authorization && req.session.authorization.username;

        if (username) {
            const userReview = req.body.review;

            if (userReview) {
                if (reviews[username]) {
                    reviews[username] = userReview;
                    res.send({ message: `Review modified by ${username}` });
                } else {
                    reviews[username] = userReview;
                    res.send({ message: `New review by ${username}` });
                }
            } else {
                res.status(400).json({ message: "Review not found" });
            }
        } else {
            res.status(403).json({ message: "No authentication detected. Please log in." });
        }
    } else {
        res.status(404).json({ message: `No book found with ISBN ${lookupISBN}` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const lookupISBN = req.params.isbn;
    const bookList = Object.values(books).find(book => book.ISBN === lookupISBN);

    if (bookList) {
        const reviews = bookList.reviews || {};
        const username = req.session.authorization && req.session.authorization.username;
        if (username) {
            const userReview = req.body.review;
            if (userReview) {
                if (reviews[username]) {
                    delete reviews[username]
                    res.send({ message: `Review deleted by ${username}` });
                } else {
                    res.send({ message: `No reviews by ${username}` });
                }
            } else {
                res.status(403).json({ message: "No review to delete." });
            }
        } else {
            res.status(403).json({ message: "No authentication detected. Please log in." });
        }
    } else {
        res.status(404).json({ message: `No book found with ISBN ${lookupISBN}` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;