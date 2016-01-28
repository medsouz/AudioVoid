/*
	Handles all of the smoke and mirrors involved in page navigation.

	After the user accesses the page for the first time in their session all future pages will be written to the content div to prevent the page from refreshing and breaking the music player.
*/
function setContentURL(url) {
	$.ajax({
		url: url,
		success: function(data) {
			console.log("Switching to " + url);
			$("#content").html(data);
			componentHandler.upgradeElements($("#content")[0]);
		}
	});
}

$(document).ready(function(){
	$(document).on('click', "a[href^='/']", function(e) {
		if(!$(this)[0].hasAttribute("noajax")) {
			url = $(this).attr('href');
			history.pushState(null, null, url);
			setContentURL(url);
			e.preventDefault();
		}
	});
})

$(window).on("popstate", function() {
	setContentURL(window.location);
});
