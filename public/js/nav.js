/*
	Handles all of the smoke and mirrors involved in page navigation.

	After the user accesses the page for the first time in their session all future pages will be written to the content div to prevent the page from refreshing and breaking the music player.
*/
function setContentURL(url, addToHistory) {
	$.ajax({
		url: url,
		success: function(data, status, req) {
			setContentHTML(req, data, addToHistory);
		},
		error: function(xhr, textStatus, errorThrown) {
			window.location = url;
		}
	});
}

function setContentHTML(req, data, addToHistory) {
	//Get actual URL from the server. Prevents the wrong URL from showing if there is a redirect.
	url = req.getResponseHeader("Ajax-Nav-URL");

	//Make sure the user didn't get logged out somehow without us knowing. If so reload the page.
	if(req.getResponseHeader("Ajax-Nav-Username") != $("#username").text())
		window.location = url;

	var title = req.getResponseHeader("Ajax-Nav-Title");
	document.title = "AudioVoid - " + title;
	$("#title").text(title);

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

function ajaxPageReload() {
	setContentURL(window.location.href, false);
}

$(document).ready(function(){
	$(document).on('click', "a[href^='/']", function(e) {
		if(!$(this)[0].hasAttribute("noajax")) {
			url = $(this).attr('href');
			setContentURL(url, true);
			e.preventDefault();
		}
	});

	$(document).on('submit', null, function(e) {
		$(this).prop('disabled', true);
		if(!$(e.target)[0].hasAttribute("noajax")) {
			$.ajax({
				type: "POST",
				url: e.target.action,
				data: new FormData(e.target),
				processData: false,
				contentType: false,
				success: function(data, status, req) {
					setContentHTML(req, data, true);
				}
			});
			e.preventDefault();
		}
	});
})

$(window).on("popstate", function() {
	setContentURL(window.location);
});
