var express = require('express');
var router = express.Router();
var mv = require("mv");
var path = require('path');
var fs = require("fs");
var os = require("os");

router.get('/', function(req, res, next) {
	if(req.user == undefined)
		res.redirect("/");
	res.render('song', { req : req, title: 'Song Upload' });
});

router.get('/:id/song', function(req, res, next) {
	if(!isNaN(req.params.id)) {
		Song.findById(req.params.id).then(function(song, err) {
			//It is extremely easy to fake song plays this way but it is 2am and I'm the only person doing any work so I don't give a shit
			song.update({plays: song.plays + 1}).then(function() {
				res.sendFile(path.resolve("uploads/" + req.params.id + ".mp3"));
			});
		});
	} else {
		res.send("Error");
	}
});

router.get('/:id/cover', function(req, res, next) {
	if(!isNaN(req.params.id))
		res.sendFile(path.resolve("uploads/" + req.params.id + ".png"));
	else
		res.send("Error");
});

router.post('/upload', function(req, res, next) {
	if(req.user == undefined) {
		res.redirect("/");
		return;
	}

	if(req.body.SongGenre == "")
		req.body.SongGenre = "No Genre";
	if(req.body.SongDescription == "")
		req.body.SongDescription = "No Description";
	if(req.files.coverfile.filename == "") {
		req.files.coverfile.file = os.tmpdir() + "/express-busboy/" + req.files.coverfile.uuid + "/cover.png";
		fs.createReadStream("./public/img/demoprofilepic.jpg").pipe(fs.createWriteStream(req.files.coverfile.file));
	}

	console.log(req.files);
	if(req.files.songfile.filename == "") {
		console.log("Missing files");
		req.flash("error", "Audio File Missing");
		res.redirect("/song");
		return;
	}

	if(req.body.SongTitle == "")
	{
		req.flash("error", "Song Title Required");
		res.redirect("/song");
		return;
	}


	Song.create({
		title: req.body.SongTitle,
		genre: req.body.SongGenre,
		description: req.body.SongDescription,
		UserId: req.user.id
	}).then(function(song, err) {
		mv(req.files.songfile.file, "./uploads/" + song.id + ".mp3", {mkdirp: true}, function(err) {
			console.log(err);
			mv(req.files.coverfile.file, "./uploads/" + song.id + ".png", {mkdirp: true}, function(err) {
				console.log(err);
				res.redirect("/");
			});
		});
	});
});

module.exports = router;
