require('dotenv').config({path: "./config.env"});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error_handler');
const ConnectDB = require('./database/userdb');

//Database connection
ConnectDB();
const app = express();
app.use(bodyParser.json());

//Routes
const admin_routes = require('./routes/admin_route');
const category_routes = require('./routes/category_route');

//Routes middleware
app.use(admin_routes);
app.use(category_routes);

//Error Handler(After all middleware routes)
app.use(errorHandler);



const PORT = process.env.PORT || 3000;

const server = app.listen(PORT , () => {
    console.log(`Server is running on ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
});