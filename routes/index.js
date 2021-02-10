const express = require('express');
const router = express.Router();
const User = require('../config/model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/',checkAuthUser, (req, res) => {
    res.render('index', { user: req.user, isLoggedIn: req.isLogged });
})

router.get('/login',checkNotAuthentication, (req, res) => {
    res.render('login');
})

router.get('/register',checkNotAuthentication, (req, res) => {
    res.render('register');
})

router.get('/user',checkAuthentication, (req, res) => {
    res.render('user', { message: req.user });
})

router.post('/register',checkCredentials, (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true,
}))

// logout
router.get('/logout',
  function(req, res){
    req.logout(); // terminate session which is used for authentication
    res.redirect('/');
});

// middlewares
async function checkCredentials( req, res, next ){
    const { firstname, lastname, username, password, confirmpassword } = req.body;

    if(password !== confirmpassword){
        req.flash('error', 'Password not match!')
        res.render('register')
        return
    }
    try{
        // check username if it's already existed
        const user = await User.findOne({ username });
        if(user){
            req.flash('error', 'Username is already registed!')
            res.render('register')
            return
        }
        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 8);
        await User.create({ firstname: firstname, lastname: lastname, username: username, password: hashedPassword });
        req.flash('info', 'successfully registed! try login')
        next();
    }catch(err){
        console.log(err);
        next(err);
    }
}

function checkAuthentication( req,res,next ){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

// for preventing user navigate to login or register route while logged in
function checkNotAuthentication( req, res, next ){
    if(req.isAuthenticated()){
        res.redirect('/')
    }else {
        next()
    }
}

// for displaying coresponding links in template engine accordingly
function checkAuthUser(req, res, next){
    if(req.isAuthenticated()){
        req.isLogged = true;
        next()
    }else {
        req.isLogged = false;
        next()
    }
    
}

module.exports = router;