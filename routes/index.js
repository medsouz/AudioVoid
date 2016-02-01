var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user)
		res.render('dashboard', { req : req, title: 'Dashboard' });
	else
		res.render('index', { req : req, title: 'Home' });
});

module.exports = router;
