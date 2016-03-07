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
	if(req.user && username == req.user.username) {
		res.render('user', { req : req, user: req.user, title: req.user.username + "'s Profile" });
	} else {
		User.findOne({
			where: {
				username: username
			}
		}).then(function(user, err) {
			if(user != null) {
				res.render('user', { req : req, user: user, title: user.username + "'s Profile" });
			} else {
				res.redirect('/');
			}
		});
	}
});

router.post('/post', function(req, res, next) {
	console.log(req.body);
	if(req.user) {
		res.redirect("/user/" + req.user.username);
	} else {
		res.redirect("/");
	}
});

router.post('/settings', function(req, res, next) {
	console.log(req.body);
	if(req.user) {
		User.findOne({
			where: {
				id: req.user.id
			}
		}).then(function(user) {
			user.update({
				bio: req.body.bio,
				twitter: req.body.twitter,
				soundcloud: req.body.soundcloud
			}).then(function() {
				res.redirect("/user/" + req.user.username);
			});
		});
	} else {
		res.redirect("/");
	}
});

module.exports = router;
