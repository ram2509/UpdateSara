var express = require('express');
//var morgan = require('morgan')
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var flash = require('connect-flash');
var session = require('express-session');
//var usersDB = require('./model/usersdb');
var port = process.env.PORT || 5000;

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames=[];
//app.use(morgan('dev'));

//connect the socket




//view engine
app.engine('.hbs', expressHandlebars({defaultLayout: 'layout',
    partialsDir: __dirname+'/views/partials',
    layoutsDir: __dirname+'/views/layouts',
    extname:'.hbs'
}));


app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connect',function (socket) {
    console.log('Connect with socket');

    //send message
    socket.on('send_message',function (data) {
        io.emit('new_message',{msg:data,user:socket.username});
    })

    //connect with new user
    socket.on('new_users',function (data,callback) {
        if(usernames.indexOf(data)!=-1){
            callback(false);
        }
        else {
            socket.username = data;
            usernames.push(socket.username);
            callback(true);
            updateLoginUsers();
        }
    });
    //add new login users
    function updateLoginUsers() {
        socket.emit('usernames',usernames);
    }

    //disconnect the user
    socket.on('disconnect',function (data) {
        if(!socket.username){
            return;
        }
        usernames.splice(socket.username,1);
        updateLoginUsers();
    })
});

app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'secretwork',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//global variables
app.use(function (req,res,next) {
    res.locals.user = req.user || null;
    next();
})

var routes = {
   index : require('./routes/index'),
   users : require('./routes/users'),
}

//catch 404 and forward to error handler
// app.use(function (req,res) {
//     res.render('notFound');
// });

app.use('/',routes.index);
app.use('/users',routes.users);

// usersDB.connectDB(function () {
//     app.listen(port,function (req,res) {
//         console.log('server is running on the port 5000');
//     });
// })
server.listen(port,function (req,res) {
    console.log('Server is runnning on port 5000');
});