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
const ws = require("ws")
const fs = require("fs")

const User = require("./models/User")
const Message = require("./models/Message")

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
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (userDoc) {
        const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
        if (isMatchedPassword) {
            //logged in
            jwt.sign({ username, userId: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                //cookie อยู่ที่ res
                res.cookie("token", token).json({
                    userId: userDoc._id,
                    username,
                    password,
                })
            })
        } else {
            res.status(400).json("wrong credentials")
        }
    } else {
        res.status(404).json("user not found")
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

//logout
app.post("/logout", (req, res) => {
    res.clearCookie("token","").json("ok");
});

//check user
app.get("/people", async(req, res) => {
    const users = await User.find({}, {'_id': 1 , username : 1})
    res.json(users)

})

// Start the server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
})


//web Socket Server
//web socket server
const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
    const notifyAboutOnlinePeople = () => {
        [...wss.clients].forEach((client) => {
            client.send(
                JSON.stringify({
                    online: [...wss.clients].map((c) => ({
                        userId: c.userId,
                        username: c.username,
                    })),
                })
            );
        });
    };
    connection.isAlive = true;
    connection.timer = setInterval(() => {
        connection.ping();
        connection.deadTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
            console.log('dead');
        }, 1000);
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deadTimer);
    });

    //read username and id from the cookie for this connection
    const cookie = req.headers.cookie;
    if (cookie) {
        const tokenCookieString = cookie.split(";").find(str => str.startsWith("token="))
        if (tokenCookieString) {
            const token = tokenCookieString.split("=")[1]
            if (token) {
                jwt.verify(token, secret, {}, (err, userData) => {
                    if (err) throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                });
            }
        }
    }

    connection.on("message", async (message) => {
        const messageDate = JSON.parse(message.toString())
        const { recipient, sender, file } = messageDate;
        let filename = null;
        if (file) {
            const parts = file.name.split(".");
            const ext = parts[parts.length - 1];
            filename = Date.now() + "." + ext;
            const path = __dirname + "/uploads/" + filename;
            const bufferData = new Buffer(file.data.split(".")[1], "base64")
            fs.writeFile(path, bufferData, () => {
                console.log("file save" + path);
            })
        }
        if (recipient && (text || file)) {
            //save to database
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
                file: file ? filename : null
            });
            [...wss.clients].filter(c => c.userId === recipient).forEach(c => c.send(JSON.stringify({
                sender: connection.userId,
                recipient,
                text,
                file: file ? filename : null,
                _id: messageDate._id
            })))
        }
    })
    notifyAboutOnlinePeople();
});