const Error = require('../utils/error_response');

const errorHandler = (err, req, res, next) => {

    const error = {...err};

    error.message = err.message;

    console.log(err);

    if(err.code === 11000){
        const message = `Duplicate field value!`;
        error = new Error(message, 400);
    }
    if(err.name === "Validation error"){
        const message = Object.values(err.errors).map((val) => val.message);
        error = new Error(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error : error.message || "Server error!"
    })

}

module.exports = errorHandler;