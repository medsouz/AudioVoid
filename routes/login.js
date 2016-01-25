var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var crypto = require("crypto");
var validator = require("validator");

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
			done(null, false, { message: "Invalid User ID" });
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
		}).then(function(user, err) {
			if(user != null) {
				done(null, user);
			} else {
				console.log("Invalid username or password.");
				done(null, false, { message: "Invalid username or password." });
			}
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

router.get("/logout", function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.post("/register", function(req, res, next) {
	//TODO: Setup flash messages to tell the user about success/failure.
	if(validator.isEmail(req.body.email) && validator.matches(req.body.username, "^[a-z0-9_]{3,20}$")) {
		User.findOne({
			where: {
				$or: [{username: req.body.username}, {email: req.body.email}]
			}
		}).then(function(user) {
			if(user != null) {
				console.log("User exists")
			} else {
				console.log("New user");
				var key = crypto.pbkdf2Sync(req.body.password, "NaCL" /* TODO: Better salting */, 30000, 512, "sha512");
				User.create({
					username: req.body.username,
					email: req.body.email,
					password: key
				}).then(function(user){
					console.log("Created new user!");
					res.redirect("/login");
				});
			}
		});
	} else {
		console.log("Invalid username or password");
		res.redirect("/login");
	}
});

module.exports = router;
