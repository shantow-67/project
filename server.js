
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require("mongoose");
require("dotenv").config();
// const morgan = require("morgan");
const cors = require('cors');
const router = require('./routes/router')


// middlewares
app.use(cors());
// app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet())




const port = 8000;

// const port = process.env.PORT || 8000;
// connect to MongoDB and start server
mongoose
    .connect("mongodb://127.0.0.1:27017/project", { autoIndex: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        })
    })
    .catch((err) => console.log(err));


// app.use("/api/v1/", router);
app.use("/api/v1", router);
