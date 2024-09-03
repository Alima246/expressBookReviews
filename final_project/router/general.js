const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const LOCAL_BOOKS_API_URL = 'http://localhost:5000/local-books';  //sample url

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        // if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        // } else {
        //     return res.status(404).json({message: "User already exists!"});
        // }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Fetch data from the simulated local endpoint using Axios
        const response = await axios.get(LOCAL_BOOKS_API_URL);

        // Send the fetched data as a response in the same format as before
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error fetching book list', error: error.message });
    }
});
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
// //   return res.status(300).json({message: "Yet to be implemented"});
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        // Fetch data from the simulated local endpoint using Axios
        const response = await axios.get(`${LOCAL_BOOKS_API_URL}`);
        const book = response.data[isbn];

        if (book) {
            // Send the fetched book data as a response
            res.send(book);
        } else {
            // Book not found
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error fetching book details', error: error.message });
    }
});
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//     res.send(books[isbn]);
// //   return res.status(300).json({message: "Yet to be implemented"});
//  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        // Fetch data from the simulated local endpoint using Axios
        const response = await axios.get(`${LOCAL_BOOKS_API_URL}`);
        const allBooks = response.data;

        // Find all books by the author
        const result = Object.keys(allBooks)
            .filter(key => allBooks[key].author.toLowerCase() === author.toLowerCase())
            .reduce((acc, key) => {
                const { title, reviews } = allBooks[key];
                acc.push({ isbn: key, title, reviews }); // 'isbn' here is used as the original key in the response
                return acc;
            }, []);

        if (result.length > 0) {
            return res.status(200).json({ booksbyauthor: result });
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: 'Error fetching books by author', error: error.message });
    }
});
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author;

//     // Find all books by the author
//     const result = Object.keys(books)
//         .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
//         .reduce((acc, key) => {
//             const { title, reviews } = books[key];
//             acc.push({ isbn: key, title, reviews }); // 'isbn' here is used as the original key in the response
//             return acc;
//         }, []);
//     if (result.length > 0) {
//         return res.status(200).json({ booksbyauthor: result });
//     } else {
//         return res.status(404).json({ message: "No books found for this author" });
//     }});

// Get all books based on title

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    try {
        // Fetch data from the simulated local endpoint using Axios
        const response = await axios.get(`${LOCAL_BOOKS_API_URL}`);
        const allBooks = response.data;

        // Find all books with the matching title
        const result = Object.keys(allBooks)
            .filter(key => allBooks[key].title.toLowerCase() === title)
            .reduce((acc, key) => {
                const { author, title, reviews } = allBooks[key];
                acc.push({ isbn: key, author, title, reviews }); // Include the key (ISBN-like) in the response
                return acc;
            }, []);

        if (result.length > 0) {
            return res.status(200).json({ booksbytitle: result });
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: 'Error fetching books by title', error: error.message });
    }
});
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title.toLowerCase();

//     // Find all books with the matching title
//     const result = Object.keys(books)
//         .filter(key => books[key].title.toLowerCase() === title)
//         .reduce((acc, key) => {
//             const { author, title, reviews } = books[key];
//             acc.push({ isbn: key, author, title, reviews }); // Include the key (ISBN-like) in the response
//             return acc;
//         }, []);

//     if (result.length > 0) {
//         return res.status(200).json({ booksbytitle: result });
//     } else {
//         return res.status(404).json({ message: "No books found with this title" });
//     }
// });




module.exports.general = public_users;