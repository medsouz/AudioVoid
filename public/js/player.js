var visualizer;
var visualizerCtx;
var analyzer;
var gainNode;
var player;

var playlist = [];
var playlistIndex = 0;

function addSong(songUrl, songName, cover) {
	var song = {
		url: songUrl,
		name: songName,
		cover: cover
	}
	playlist[playlist.length] = song;
	//If this is the only song in the queue then start
	if(playlistIndex == playlist.length - 1) {
		startSong();
	}
}

function playSong(url, name, cover) {
	playlist = [];
	playlistIndex = 0;
	addSong(url, name, cover);
}

function startSong() {
	$("#songScrubber")[0].MaterialSlider.change(0);
	player.src = playlist[playlistIndex].url;
	$("#trackName").text(playlist[playlistIndex].name);
	$("#albumArt").attr("src", playlist[playlistIndex].cover);
	player.play();
}

var visualizerUpdate;
function updateVisualizer() {
	frequencyArray = new Uint8Array(analyzer.frequencyBinCount); // takes the fequencyBinCount and sets it into an array
	analyzer.getByteFrequencyData(frequencyArray); // puts the frequencyArray into analzer node and converts the data
	clearVisualizer();
	visualizerCtx.fillStyle = "#B71C1C"; // Color of the bars
	for (var i = 0; i < 20; i++)
	{
		visualizerCtx.fillRect(i * 15, visualizer.height, 10, -(frequencyArray[i * 11] / 2));
	}
}

function clearVisualizer() {
	visualizerCtx.fillStyle = "#424242";
	visualizerCtx.fillRect(0, 0, visualizer.width, visualizer.height); // Clear the canvas
}

function showMusicMenu() {
	$('#musicMenu')[0].showModal();
	updateQueue();
}

function queueClick(indexNum) {
	if (playlistIndex == indexNum) // if this song is playing
	{
		if(player.paused)
			player.play();
		else
			player.pause();
	}
	else
	{
		playlistIndex = indexNum;
		startSong();
	}
	updateQueue();
}
function updateQueue() {
	$("#musicQueueList").empty();
	var text = "<table style='border: 1px solid black;'>";
	for (p in playlist)
	{
			text += "<tr style='"+ ((p == playlistIndex) ? "background-color:gray" : "") + "'><td style='padding: 0px 20px 0px 20px;'><button id='btnPlayQ" + p + "' class='mdl-button mdl-js-button mdl-button--icon'><i id='iconPlayQ" + p + "' class='material-icons' onclick='queueClick(" + p + ")'>" + ((p == playlistIndex && !player.paused) ? "pause" : "play_arrow") + "</i></button></td><td><img style='height:20px;' src=" + playlist[p].cover + "></td><td style='padding: 0px 20px 0px 20px; font-weight: bold;'>" + playlist[p].name + "</td></tr>";
	}
	text += "</table>";
	$("#musicQueueList").append(text);
}
$(document).ready(function(){
	visualizer = $("#cvsVisualizer")[0];
	visualizerCtx = visualizer.getContext("2d");
	clearVisualizer();
	player = $("#songs")[0];
	var playerCtx = new AudioContext();
	var source = playerCtx.createMediaElementSource(player);
	gainNode = playerCtx.createGain();
	gainNode.gain.value = 1;
	analyzer = playerCtx.createAnalyser();
	analyzer.fftSize = 512;
	source.connect(analyzer);
	analyzer.connect(gainNode);
	gainNode.connect(playerCtx.destination);

	//Events
	player.ontimeupdate = function() {
		//Update scrubber
		var value = player.currentTime / player.duration * 1000;
		$("#songScrubber")[0].MaterialSlider.change(value);
		if(player.currentTime > 10)
			$("#iconPrevious").text("fast_rewind");
		else
			$("#iconPrevious").text("skip_previous");
		//Update time value
		var minutes = "0" + Math.floor(Math.floor(player.currentTime) / 60);
		var seconds = "0" + (Math.floor(player.currentTime) - minutes * 60);
		var songCurrentTime = minutes.substr(-2) + ":" + seconds.substr(-2);
		minutes = "0" + Math.floor(Math.floor(player.duration) / 60);
		seconds = "0" + (Math.floor(player.duration) - minutes * 60);
		var songTotalTime = minutes.substr(-2) + ":" + seconds.substr(-2);
		$("#songTimer").text(songCurrentTime + " | " + songTotalTime);
	}

	player.onplay = function() {
		//Update the icon
		$("#iconPlay").text("pause");
		//Start the visualizer
		visualizerUpdate = setInterval(updateVisualizer, 1000 / 30); // 30 FPS
	}

	player.onpause = function() {
		//Update the icon
		$("#iconPlay").text("play_arrow");
		//Stop the visualizer
		clearInterval(visualizerUpdate);
		//Clear the visualizer
		clearVisualizer();
	}

	player.onended = function() {
		if(playlistIndex < playlist.length) {
			playlistIndex++;
			startSong(playlistIndex);
		}
	};

	$("#btnPlay").click(function() {
		if(player.src != "") {
			if(player.paused)
				player.play();
			else
				player.pause();
		}
	});

	var lastVolume = 100;
	$("#volumeSlider").on("input", function(e){
		gainNode.gain.value = e.target.value / 100;
		if(gainNode.gain.value == 0) {
			$("#volumeButton").text("volume_off");
			//return now so that we don"t update the lastVolume value
			return;
		} else if (gainNode.gain.value >= 0.5){
			$("#volumeButton").text("volume_up");
		} else {
			$("#volumeButton").text("volume_down");
		}
		lastVolume = e.target.value;
	});

	$("#volumeButton").click(function() {
		if(gainNode.gain.value != 0)
			$("#volumeSlider")[0].MaterialSlider.change(0);
		else
			$("#volumeSlider")[0].MaterialSlider.change(lastVolume);
		//Trigger a slider update
		$("#volumeSlider").trigger("input");
	});

	$("#songScrubber").on("input", function(e) {
		player.currentTime = player.duration * (e.target.value / 1000);
	});

	$("#btnPrevious").click(function() {
		if(player.currentTime > 10) {
			player.currentTime = 0
		} else {
			if(playlistIndex > 0) {
				playlistIndex--;
				startSong();
			}
		}
	});

	$("#btnNext").click(function() {
		if(playlistIndex < playlist.length - 1) {
			playlistIndex++;
			startSong();
		}
	});
});
