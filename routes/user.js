var express = require('express');
var router = express.Router();

/* GET users page. */
router.get('/', function(req, res, next) {
	res.render('user', { req : req, title: 'AudioVoid' });
});

router.get('/:username', function(req, res, next) {
	var username = request.params.username;
	res.render('user', { req : req, title: 'AudioVoid' });
});

module.exports = router;
