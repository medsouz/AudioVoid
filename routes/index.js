var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user) {
		getFollowerContent(req, req.user, function(posts, songs, users) {
			res.render('dashboard', { req : req, title: 'Dashboard', posts: posts, songs: songs, users: users });
		});
	} else {
		res.render('index', { req : req, title: 'Home' });
	}
});

router.get('/about', function(req, res, next) {
	res.render('about', { req : req, title: 'About Us' });
});

function getFollowerContent(req, user, callback) {
	user.getFollowed().then(function (follows, err) {
		var followedIDs = [];
		var userIDs = [];
		for(var f in follows)
			followedIDs[followedIDs.length] = follows[f].followedId;
		getUserContent(req, followedIDs, callback);
	});
}

module.exports = router;
