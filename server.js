const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('express-flash');
const logger = require('./config/logger');
require('dotenv').config();

// db connection
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => logger.info(`database connected!`))
.catch((err) => logger.error(err));

// ejs
app.set('view engine', 'ejs');

// use static assets
app.use(express.static('public'));

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 1000 * 60 * 60 *24, // 1 day
    }
}));

// passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// routes
app.use('/', require('./routes/index.js'));

// error handling
app.use(function(err, req, res, next){
    logger.error(err)
    res.status(500).json('something went wrong :/')
})


app.listen(port, () => logger.info(`starting server on port ${port}`));