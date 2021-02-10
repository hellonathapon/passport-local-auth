const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
require('dotenv').config();

// db connection
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log(`database connected!`))
.catch((err) => console.err(err));

// ejs
app.set('view engine', 'ejs');

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 1000 * 60 * 60 *24, // 1 day
    }
}))

app.use('/', require('./routes/index.js'));

app.listen(port, () => console.log(`server is running on port ${port}`));