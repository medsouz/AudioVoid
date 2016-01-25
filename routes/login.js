var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var crypto = require('crypto');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(userID, done) {
	User.findOne({
		where: {
			id: userID
		}
	}).then(function (user) {
		if(user != null)
			done(null, user);
		else
			done("Invalid user ID", null);
	});
});

passport.use(new LocalStrategy(
	function(name, password, done) {
		var key = crypto.pbkdf2Sync(password, "NaCL" /* TODO: Better salting */, 30000, 512, "sha512");
		User.findOne({
			where: {
				username: name,
				password: key
			}
		}).then(function (user) {
			if(user != null)
				done(null, user);
			else
				done("Invalid username or password", null);
		});
	}
));

router.get("/", function(req, res, next) {
	//If the user is already authenticated then send them back to their homepage
	if(req.user)
		res.redirect("/");
	else
		res.render("login", { req : req, title: 'AudioVoid' });
});

router.post("/", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login" }));

router.post("/register", function(req, res, next) {
	console.log("Tried to register");
});

module.exports = router;
