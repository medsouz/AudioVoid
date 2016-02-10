// Matthew Piskunov
// 1/23/16
// Variable Initialization
var canvas, canvas2, canvasCtx; // canvas elements
var songs, audio, audioCtx, gainNode, audioVal, analzyer, source; // audio tag and AudioContext variables
var frequencyArray, bars, barX, barWidth, barHeight, spectrumLocation;
var songIsPlaying = false; // flag to tell us if the song is currently playing
var muted = false;
var songs = ["/songs/MarioDrumSet.wav", "/songs/YungIrish.wav"]
var songIndex = 0;

// when the document is ready, run this main function
$(document).ready(function(){
	music_player_prep(); // I initialized all of my variables into one function
	$('#btnPlay').click(function(){
		if(songIsPlaying == false)
		{
			audio[0].play();
			$('#iconPlay').text('pause');
			songIsPlaying = true;
			intervalVar = setInterval(music_visualizer, 17);
			intervalTime = setInterval(song_playing_slider, 50);
		}
		else
		{
			audio[0].pause();
			$('#iconPlay').text('play_arrow');
			songIsPlaying = false;
			clearInterval(intervalVar);
			clearInterval(intervalTime);
			canvasCtx.fillStyle = '#424242';
			canvasCtx.fillRect(0, 0, canvas[0].width, canvas[0].height); // Clear the canvas
		}
	});
	$('#btnNext').click(function(){
		if(songIndex >= songs.length - 1)
			songIndex = 0;
		else
			songIndex++;
		load_song(songs[songIndex]);
		$("#songScrubber")[0].MaterialSlider.change(0);
	});
	$('#btnPrevious').click(function(){
		if(audio[0].currentTime > 3)
			load_song(songs[songIndex]);
		else
		{
			if(songIndex > 0)
				songIndex--;
			else
				songIndex = songs.length - 1;
			load_song(songs[songIndex]);
		}
	});
	$('#volumeSlider').on("input", function(e){
		volume_change(e.target.value);
	});
	$("#songScrubber").on("mouseup", function(e){
		if(songIsPlaying == true)
			intervalTime = setInterval(song_playing_slider, 50);
		else{
			intervalTime = setInterval(song_playing_slider, 50);
			clearInterval(intervalTime);
		}
		song_scrubber(e.target.value);
	});
	$("#songScrubber").on("mousedown", function(e){
		clearInterval(intervalTime);
	});
	audio[0].onended = function(){
		$("#songScrubber")[0].MaterialSlider.change(0);
		if(songIndex >= songs.length - 1)
			songIndex = 0;
		else
			songIndex++;
		load_song(songs[songIndex]);
	};
	$("#volumeButton").click(function(){
		$("#volumeSlider")[0].MaterialSlider.change(0);
		volume_change(0);

	});
});
function music_player_prep(){ // this function initializes all of our main components. Ex. canvas, audio, AudioContext, and visualizer
	canvas =	$('#cvsVisualizer'); // grabs my canvas object. use canvas[0] for specific element
	canvasCtx = canvas[0].getContext('2d');
	audio = $('#songs'); // grabs the audio ID of my object. use audio[0] for specific element
	audioCtx = new AudioContext(); // new AudioContext() creates my audio instance
	source = audioCtx.createMediaElementSource(audio[0]); // creates source node from the audio element
	gainNode = audioCtx.createGain(); // this allows us to use a volume fader
	gainNode.gain.value = 1;
	analyzer = audioCtx.createAnalyser(); // creates analzyer node for audio
	analyzer.fftSize = 512;
	source.connect(analyzer); // connects source node to the analyzer node
	analyzer.connect(gainNode); // connects analyzer node to the gain node
	gainNode.connect(audioCtx.destination); // connects gain node to the destination (speakers)
	load_song(songs[songIndex]); // this load_song instance will be used as a default song for start-up

	music_visualizer();
}
function load_song(url){ // loading the song sets the previous songs currentTime to 0 by reinitializing the source
	audio.attr('src', url);
	song_change();
}
function music_visualizer(){
	frequencyArray = new Uint8Array(analyzer.frequencyBinCount); // takes the fequencyBinCount and sets it into an array
	//console.log(frequencyArray.length);
	analyzer.getByteFrequencyData(frequencyArray); // puts the frequencyArray into analzer node and converts the data
	canvasCtx.fillStyle = '#424242';
	canvasCtx.fillRect(0, 0, canvas[0].width, canvas[0].height); // Clear the canvas
	canvasCtx.fillStyle = '#b71c1c'; // Color of the bars
	bars = 20; // 100
	for (var i = 0; i < bars;i++)
	{
		spectrumLocation = i * 11;
		barX = i * 15; //3
		barWidth = 10; //1.5
		barHeight = -(frequencyArray[spectrumLocation] / 2);
		//	fillRect( x, y, width, height ) // Explanation of the parameters below
		canvasCtx.fillRect(barX, canvas[0].height, barWidth, barHeight);
	}
}
function song_change(){
	if(songIsPlaying == true)
		audio[0].play();
}
function volume_change(val){
	if (muted == false)
	{
		gainNode.gain.value = val / 100;
		if (gainNode.gain.value == 0)
			$("#volumeButton").text("volume_off");
		else {
			$("#volumeButton").text("volume_up");
		}
	}
}
function song_scrubber(val){
	val = val / 1000;
	songPercentage = audio[0].duration * val;
	audio[0].currentTime = songPercentage;
}
function song_playing_slider(){
	var value = audio[0].currentTime / audio[0].duration * 1000;
	$("#songScrubber")[0].MaterialSlider.change(value);

	var totalMin = Math.round(audio[0].duration / 60);
	var totalSec = addPadding(Math.round(audio[0].duration % 60));
	if (totalSec == 60)
	{
		totalMin++;
		totalSec = "00";
	}
	var total = totalMin + ":" + totalSec;

	var currentMin = Math.floor(audio[0].currentTime / 60);
	var currentSec = addPadding(Math.ceil(audio[0].currentTime % 60));
	if (currentSec == 60){
		currentSec = "00";
		currentMin++;
	}
	var songCurrentTime = currentMin + ":" + currentSec;
	$("#songTimer").text(songCurrentTime + " | " + total);
	console.log(totalSec);
}
function addPadding(num){
	if(num < 10)
		num = "0" + num;
	return num;
}
