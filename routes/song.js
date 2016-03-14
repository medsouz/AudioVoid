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
	if(req.files.songfile.filename == "" || req.files.coverfile.filename == "") {
		console.log("Missing files");
		req.flash("error", "Audio or Cover Photo Missing")
		res.redirect("/song");
		return;
	}

	if(req.body.SongTitle == "" || req.body.SongGenre == "" || req.body.SongDescription == "")
	{
		if(req.body.SongTitle == "")
			req.flash("error", "Song Title Required");
		if(req.body.SongGenre == "")
			req.flash("error", "Song Genre Required");
		if(req.body.SongDescription == "")
			req.flash("error", "Song Description Required");
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
