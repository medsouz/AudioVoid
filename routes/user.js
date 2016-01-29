var express = require('express');
var router = express.Router();

/* GET users page. */
router.get('/', function(req, res, next) {
	if(req.user)
		//Redirect to the user's profile
		res.redirect('/user/' + req.user.username);
	else
		//If the user is not authenticated then redirect them to the homepage
		res.redirect('/');
});

router.get('/:username', function(req, res, next) {
	var username = req.params.username;
	// If the user is viewing their own profile then save us a SQL request
	if(username == req.user.username) {
		res.render('user', { req : req, user: req.user, title: 'AudioVoid' });
	} else {
		User.findOne({
			where: {
				username: username
			}
		}).then(function(user, err) {
			if(user != null) {
				res.render('user', { req : req, user: user, title: 'AudioVoid' });
			} else {
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
