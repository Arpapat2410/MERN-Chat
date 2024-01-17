const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
//เพื่อเชื่อมไฟล์
require("dotenv").config();
// Create Express app
const app = express();

const User = require("./models/User")

// Connect Database
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI).then(err => {
    if (!err) {
        return console.log(err);
    }
    return console.log("Connected to MongooseDB");
});

// Middleware
const CLIENT_URL = process.env.CLIENT_URL
app.use(cors({
    credentials: true,
    origin: CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
// Set static (public) folder
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get("/", (req, res) => {
    res.send("<h1>This is a RESTful API for MREN CHAT</h1>");
});

//User register
const salt = bcrypt.genSaltSync(10);
app.post("/register", async (req, res) => {
    const {
        username,
        password
    } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        res.json(userDoc)
    } catch (error) {
        console.log((error));
        res.status(400).json(error)
    }
})

//User Login
const secret = process.env.SECRET
app.post("/login", async (req, res) => {
    //เป็นการ Destructuring Object
    const {username,password} = req.body;
    const userDoc = await User.findOne({username })
    if (userDoc) {
        const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
        if (isMatchedPassword) {
            //logged in
            jwt.sign({
                username,
                id: userDoc._id
            }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie("token", token).json({
                    id: userDoc._id,
                    username,
                    password,
                })
            })
        } else {
            res.status(400).json("wrong credentials")
        }
    } else {
        res.status(400).json("user not found")
    }
})

app.get("/profile", (req, res) => {
    const token = req.cookies ?.token;
    if (token) {
        jwt.verify(token, secret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData)
        })
    } else {
        res.status(401).json("no token")
    }
})

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
})