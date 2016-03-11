function likePost(postID) {

}

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

function repostSong(songID) {

}
