var express = require('express');
var router = express.Router();
var mv = require("mv");

router.get('/', function(req, res, next) {
	if(req.user == undefined)
		res.redirect("/");
	res.render('song', { req : req, title: 'Song Upload' });
});

router.post('/upload', function(req, res, next) {
	if(req.user == undefined) {
		res.redirect("/");
		return;
	}

	console.log(req.files);
	if(req.files.songfile == undefined || req.files.coverfile == undefined) {
		console.log("Missing files");
		res.redirect("/song");
		return;
	}

	Song.create({
		title: req.body.SongTitle,
		genre: req.body.SongGenre,
		description: req.body.SongDescription,
		UserId: req.user.id
	}).then(function(song, err) {
		mv(req.files.songfile.file, "./public/uploads/" + song.id + ".mp3", {mkdirp: true}, function(err) {
			console.log(err);
			mv(req.files.coverfile.file, "./public/uploads/" + song.id + ".png", {mkdirp: true}, function(err) {
				console.log(err);
				res.redirect("/");
			});
		});
	});
});

module.exports = router;
