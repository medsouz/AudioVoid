var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user) {
		getFollowerContent(req.user, function(posts, songs, users) {
			console.log("Posts: " + posts.length);
			console.log("Songs: " + songs.length);
			console.log("Users: " + Object.keys(users).length);
			res.render('dashboard', { req : req, title: 'Dashboard', posts: posts, songs: songs, users: users });
		});
	} else {
		res.render('index', { req : req, title: 'Home' });
	}
});

function getFollowerContent(user, callback) {
	user.getFollowed().then(function (follows, err) {
		var followedIDs = [];
		var userIDs = [];
		for(var f in follows)
			followedIDs[followedIDs.length] = follows[f].followedId;
		getUserContent(followedIDs, callback);
	});
}

module.exports = router;
