/*
	Handles all of the smoke and mirrors involved in page navigation.

	After the user accesses the page for the first time in their session all future pages will be written to the content div to prevent the page from refreshing and breaking the music player.
*/
function setContentURL(url, addToHistory) {
	$.ajax({
		url: url,
		success: function(data) {
			console.log("Switching to " + url);

			if(addToHistory)
				history.pushState(null, null, url);

			$("#content").html(data);
			componentHandler.upgradeElements($("#content")[0]);
			// Hide the navbar if it is currently open
			if($(".mdl-layout__drawer").hasClass("is-visible"))
				$(".mdl-layout")[0].MaterialLayout.drawerToggleHandler_();
			//Scroll to the top of the new page
			$("#content").scrollTop(0);
		}
	});
}

$(document).ready(function(){
	$(document).on('click', "a[href^='/']", function(e) {
		if(!$(this)[0].hasAttribute("noajax")) {
			url = $(this).attr('href');
			setContentURL(url, true);
			e.preventDefault();
		}
	});
})

$(window).on("popstate", function() {
	setContentURL(window.location);
});
