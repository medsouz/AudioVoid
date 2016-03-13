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
		getUserContent(req.user, function(posts, songs, users) {
			res.render('user', { req : req, user: req.user, title: req.user.username + "'s Profile", posts: posts, songs: songs, following: false, users: users });
		});
	} else {
		User.findOne({
			where: {
				username: username
			}
		}).then(function(user, err) {
			if(user != null) {
				if(req.user && req.user.id != user.id) {
					Follow.findOne({
						where: {
							UserId: req.user.id,
							followedId: user.id
						}
					}).then(function(follow, err) {
						getUserContent(user, function(posts, songs, users) {
							res.render('user', { req : req, user: user, title: user.username + "'s Profile", posts: posts, songs: songs, following: (follow != null), users: users });
						});
					});
				} else {
					getUserContent(user, function(posts, songs, users) {
						res.render('user', { req : req, user: user, title: user.username + "'s Profile", posts: posts, songs: songs, following: false, users: users });
					});
				}

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
					res.send(true);
				});
			} else {
				res.send(false);
			}
		});
	} else {
		res.send(false);
	}
});

router.post('/unfollow', function(req, res, next) {
	if(req.user) {
		Follow.findOne({
			where: {
				UserId: req.user.id,
				followedId: req.body.userid
			}
		}).then(function(follow, err) {
			follow.destroy();
			res.send(true);
		});
	} else {
		res.send(false);
	}
});

router.post('/repost', function(req, res, next) {
	if(req.user) {
		if(req.body.type == 0) {
			Post.findById(req.body.id).then(function(reposted, err) {
				if(reposted != null) {
					Repost.create({
						UserId: req.user.id,
						PostId: reposted.id,
						type: 0
					}).then(function(repost) {
						res.send(true);
					});
				} else {
					res.send(false);
				}
			});
		} else if(req.body.type == 1) {
			Song.findById(req.body.id).then(function(reposted, err) {
				if(reposted != null) {
					Repost.create({
						UserId: req.user.id,
						SongId: reposted.id,
						type: 1
					}).then(function(repost) {
						res.send(true);
					});
				} else {
					res.send(false);
				}
			});
		} else {
			res.send(false);
		}
	} else {
		res.send(false);
	}
});

function getUserContent(user, callback) {
	user.getReposts().then(function(reposts){
		var repostedPosts = [];
		var repostedSongs = [];
		var userIDs = [];
		for(r in reposts) {
			if(reposts[r].type == 0)
				repostedPosts[repostedPosts.length] = reposts[r].PostId;
			else if (reposts[r].type == 1)
				repostedSongs[repostedSongs.length] = reposts[r].SongId;
			else
				console.log("Invalid repost type: " + reposts[r].type);
		}
		console.log("Reposted songs: " + repostedSongs.length);
		console.log("Reposted posts: " + repostedPosts.length);
		Post.findAll({
			where: {
				$or: [{ UserId: user.id }, {id: { $in: repostedPosts }}]
			},
			order: [['updatedAt', 'DESC']]
		}).then(function(posts){
			for(var p in posts) {
				if(userIDs.indexOf(posts[p].UserId) == -1)
					userIDs[userIDs.length] = posts[p].UserId;
			}
			Song.findAll({
				where: {
					$or: [{ UserId: user.id }, {id: { $in: repostedSongs }}]
				},
				order: [['updatedAt', 'DESC']]
			}).then(function(songs){
				for(var s in songs) {
					if(userIDs.indexOf(songs[s].UserId) == -1)
						userIDs[userIDs.length] = songs[s].UserId;
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
