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
		Post.findAll({ where: { UserId: { $in: followedIDs } }, order: [['updatedAt', 'DESC']] }).then(function(posts, err) {
			for(var p in posts) {
				if(userIDs.indexOf(posts[p].UserId) == -1)
					userIDs[userIDs.length] = posts[p].UserId;
			}
			Song.findAll({ where: { UserId: { $in: followedIDs } }, order: [['updatedAt', 'DESC']] }).then(function(songs, err) {
				for(var s in songs) {
					if(userIDs.indexOf(songs[s].UserId) == -1)
						users[userIDs.length] = songs[s].UserId;
				}
				User.findAll({ where: { id: { $in: userIDs }}}).then(function (users, err) {
					var usersOut = [];
					for(var u in users)
						usersOut[users[u].id] = users[u];
					callback(posts, songs, usersOut);
				});
			});
		});
	});
}

module.exports = router;
