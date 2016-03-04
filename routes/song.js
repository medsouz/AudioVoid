var express = require('express');
var router = express.Router();
var multer  = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads');
	},
	filename: function (req, file, cb) {
		console.log(file);
		switch(file.mimetype) {
			case "audio/mp3":
				cb(null, req.song.id + ".mp3");
				break;
			case "image/png":
				cb(null, req.song.id + ".png");
				break;
			default:
				console.log("Unsupported format");
				return;
		}
	}
});

var upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
	if(req.user == undefined)
		res.redirect("/");
	res.render('song', { req : req, title: 'Song Upload' });
});

var cpUpload = upload.fields([{ name: 'songfile', maxCount: 1 }, { name: 'coverfile', maxCount: 1 }]);

router.post('/upload', function(req, res, next) {
	if(req.user == undefined)
		res.redirect("/");

	Song.create({
		title: req.body.SongTitle,
		genre: req.body.SongGenre,
		description: req.body.SongDescription,
		UserId: req.user.id
	}).then(function(song, err) {
		req.song = song;
		cpUpload(req, res, function(err) {

			res.redirect("/");
		});
	});
});

module.exports = router;
