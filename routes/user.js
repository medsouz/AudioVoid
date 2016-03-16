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
		getUserContent(req, [req.user.id], function(posts, songs, users) {
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
						getUserContent(req, [user.id], function(posts, songs, users) {
							res.render('user', { req : req, user: user, title: user.username + "'s Profile", posts: posts, songs: songs, following: (follow != null), users: users });
						});
					});
				} else {
					getUserContent(req, [user.id], function(posts, songs, users) {
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

router.post('/unrepost', function(req, res, next) {
	if(req.user) {
		if(req.body.type == 0) {
			Repost.findAll({
				where: {
					UserId: req.user.id,
					type: 0,
					PostId: req.body.id
				}
			}).then(function(reposts, err) {
				reposts.forEach(function(r) {
					r.destroy();
				});
				res.send(true);
			});
		} else if(req.body.type == 1) {
			Repost.findAll({
				where: {
					UserId: req.user.id,
					type: 1,
					SongId: req.body.id
				}
			}).then(function(reposts, err) {
				reposts.forEach(function(r) {
					r.destroy();
				});
				res.send(true);
			});
		} else {
			res.send(false);
		}
	} else {
		res.send(false);
	}
});

module.exports = router;
