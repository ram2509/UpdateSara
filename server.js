var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var expressValidator = require('express-validator');
var cookiesParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var handlebars = require('handlebars');
//var multer = require('multer');
//var upload = multer({ dest: './uploads' });
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var port = 5000||PROCESS.env.port;
var app = express();

var routes = {
    index:require('./routes/index'),
    users:require('./routes/users')
};

//middleware
app.use(bodyParser.json());
app.use(cookiesParser());
app.use(bodyParser.urlencoded({extended:true}));

//view engine
app.engine('.hbs', exphbs({defaultLayout: 'main',
       partialsDir: __dirname+'/views/partials',
       layoutsDir: __dirname+'/views/layouts',
       extname:'.hbs'
}));


app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views'));


//Handles Session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//express validator - Error Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//express-message(connect-flash)
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(function (req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user||null;
    next();
})

app.use('/',routes.index);
app.use('/users',routes.users);


app.listen(port,function (err,data) {
    console.log("Server is running on the port 5000");
});