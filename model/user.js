var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const saltRounds = 10;

mongoose.connect('mongodb://localhost/modifiedSara');
var db = mongoose.connection;

var userSchema = mongoose.Schema({
         name:{
             type:String,
             index:true
         } ,
         email:{
             type:String
         },
         username:{
             type:String
         },
         password:{
             type:String
         },
         profileImage:{
             type:String
         }
});

var User=module.exports = mongoose.model('User',userSchema);

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback);
};

module.exports.getUserByUsername = function (username,callback) {
    var query = {username:username};
    User.findOne(query,callback);
};

module.exports.comparePassword = function (password,hash,callback) {
    // Load hash from your password DB.
    bcrypt.compare(password, hash, function(err, isMatch) {
        callback(null,isMatch);
    });
}

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}
