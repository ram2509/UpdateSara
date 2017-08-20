var router = require('express').Router();

//Get the home page
router.get('/',function (req,res,next) {
      res.render('index');
});

module.exports = router;