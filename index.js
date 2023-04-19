const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/db');
const usersRoute = require('./routes/usersRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const path = require('path');
const { fileURLToPath } = require('url');

// if es6 not support
//const fileURLToPath = require('url')
// configure env
require('dotenv').config();

// database config
connectDB();

// rest object
const app = express();

// port
const PORT = process.env.PORT || 8080;

//esmodule fix
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
//app.use(express.static(path.join(__dirname, "./client/build")));

// routes
app.use('/api/v1/auth', usersRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

// rest api
// app.use("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
