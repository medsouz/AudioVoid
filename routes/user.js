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
		getUserContent(req.user, function(posts, songs) {
			res.render('user', { req : req, user: req.user, title: req.user.username + "'s Profile", posts: posts, songs: songs });
		});
	} else {
		User.findOne({
			where: {
				username: username
			}
		}).then(function(user, err) {
			if(user != null) {
				getUserContent(user, function(posts, songs) {
					res.render('user', { req : req, user: user, title: user.username + "'s Profile", posts: posts, songs: songs });
				});
			} else {
				res.redirect('/');
			}
		});
	}
});

router.post('/post', function(req, res, next) {
	if(req.user) {
		Post.create({
			message: req.body.post,
			UserId: req.user.id
		}).then(function(post) {
			res.redirect("/user/" + req.user.username);
		});
	} else {
		res.redirect("/");
	}
});

router.post('/settings', function(req, res, next) {
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

router.post('/follow', function(req, res, next) {
	if(req.user) {
		User.findById(req.body.userid).then(function(followed, err) {
			if(followed.id != req.user.id && followed != null) {
				Follow.create({
					UserId: req.user.id,
					followedId: followed.id
				}).then(function(follow) {
					console.log(follow);
					res.send("Done");
				});
			} else {
				res.send("Failed");
			}
		});
	} else {
		res.send("Failed");
	}
});

function getUserContent(user, callback) {
	user.getPosts().then(function(posts){
		user.getSongs().then(function(songs){
			callback(posts, songs);
		});
	});
}

module.exports = router;
