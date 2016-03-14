var express = require('express');
var router = express.Router();
var Promise = require('bluebird')

router.get('/', function(req, res, next) {
	User.findAll().then(function(users){
		var promises = [];
		users.forEach(function(u) {
			promises.push(
				Promise.all([
					Post.count({ where: { UserId: u.id } }),
					Song.count({ where: { UserId: u.id } })
				]).spread(function(posts, songs) {
					u.numPosts = posts;
					u.numSongs = songs;
					return u;
				})
			)
		});
		return Promise.all(promises);
	}).then(function(users) {
		res.render('explore', { req : req, title: 'Explore', users: users });
	});
});

module.exports = router;
