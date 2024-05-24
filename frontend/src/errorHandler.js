// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging purposes
    res.status(500).json({ error: err.message }); // Send a 500 Internal Server Error response with the error message
};

module.exports = errorHandler;
