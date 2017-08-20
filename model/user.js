var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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

module.exports.createUser = function (newUser,callback) {
      newUser.save(callback);
}
