var router = require('express').Router();

//Get the home page
router.get('/',ensureAuthentication,function (req,res,next) {
      res.render('index');
});

function ensureAuthentication(req,res,next) {
    if(req.isAuthenticated()){
          return next();
    }
    else {
         // req.flash('error_msg','You are not login');
          res.redirect('/users/login');
    }
}

module.exports = router;