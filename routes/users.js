var router = require('express').Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

router.get('/register',function (req,res,next) {
    res.render('register');
});

router.get('/login',function (req,res,next) {
    res.render('login');
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: 'users/login',
                                     failureFlash:true}),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        //res.redirect('/users/' + req.user.username);
       res.redirect('/');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
        User.comparePassword(password,user.password,function (err,isMatch) {
            if(err) return done(err) ;
            if(isMatch){
                return done(null, user);
            }
            else {
              return done(null, false, { message: 'Incorrect password.' })
            }
        });


        });
    }
));

router.post('/register',upload.single('profileImage'),function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.password2;
    if(req.file){
        console.log('Uploading file.......');
        var profileImage = req.file.fieldname;

    }
    else{
        console.log('No file upload');
        var profileImage = 'noImage.jpg';
    }
    console.log(name,email,username);

    //form validator
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    //req.checkBody('confirmPassword','Password is not match').equals(req.body.password);

    //check error
    var errors = req.validationErrors();
    if(errors){
        console.log('Error');
        res.render('register',{errors:errors});
    }
    else {
        console.log('No Error');
        var newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password,
            profileImage:profileImage
        });

        User.createUser(newUser,function (err,user) {
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg','You are registered and can now login ');
        res.location('/');
        res.redirect('/');
    }

});

router.get('/logout',function (req,res) {
    req.logOut();
    req.flash('success_msg','You are logout');
    res.redirect('/users/login');
})

module.exports=router;