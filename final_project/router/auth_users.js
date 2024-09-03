const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    // Example user
    { username: "test", password: "test0123" } // In a real application, passwords should be hashed
];

const isValid = (username) => {
    return users.some(user => user.username === username);
};


const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// regd_users.post("/login", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     if (!username || !password) {
//         return res.status(400).json({ message: "Username and password are required" });
//     }

//     if (authenticatedUser(username, password)) {
//         let accessToken = jwt.sign({ username }, 'access_secret_key', { expiresIn: '1h' });

//         req.session.authorization = { accessToken, username };
//         return res.status(200).send("User successfully logged in");
//     } else {
//         return res.status(401).json({ message: "Invalid Login. Check username and password" });
//     }
// });

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book has reviews
    // if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    //     return res.status(404).json({ message: "Review not found for the user" });
    // }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user test deleted`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;