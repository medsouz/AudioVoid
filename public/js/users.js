function followUser(userID) {
	$.post("/user/follow", { userid: userID }).done(function(success){
		if(success)
			ajaxPageReload();
	});
}

function unfollowUser(userID) {
	$.post("/user/unfollow", { userid: userID }).done(function(success){
		if(success)
			ajaxPageReload();
	});
}

function repostPost(postID) {
	$.post("/user/repost", { id: postID, type: 0 }).done(function(success) {
		if(success)
			ajaxPageReload();
	});
}

function unrepostPost(postID) {
	$.post("/user/unrepost", { id: postID, type: 0 }).done(function(success) {
		if(success)
			ajaxPageReload();
	});
}

function repostSong(songID) {
	$.post("/user/repost", { id: songID, type: 1 }).done(function(success) {
		if(success)
			ajaxPageReload();
	});
}

function unrepostSong(songID) {
	$.post("/user/unrepost", { id: songID, type: 1 }).done(function(success) {
		if(success)
			ajaxPageReload();
	});
}
