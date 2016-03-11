function likePost(postID) {

}

function followUser(userID) {
	$.post("/user/follow", { userid: userID }).done(function(data){
		console.log(data);
	});
}

function repostSong(songID) {

}
