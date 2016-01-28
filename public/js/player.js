// Matthew Piskunov
// 1/23/16
// Variable Initialization
var canvas, canvas2, canvasCtx; // canvas elements
var songs, audio, audioCtx, gainNode, audioVal, analzyer, source; // audio tag and AudioContext variables
var frequencyArray, bars, barX, barWidth, barHeight, spectrumLocation;
var songIsPlaying = false; // flag to tell us if the song is currently playing

var songs = ["songs/MarioDrumSet.wav", "songs/rockinrobbin.mp3", "songs/YungIrish.wav"]
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
		}
		else
		{
			audio[0].pause();
			$('#iconPlay').text('play_arrow');
			songIsPlaying = false;
		}
	});
	$('#btnNext').click(function(){
		if(songIndex >= songs.length - 1)
			songIndex = 0;
		else
			songIndex++;
		load_song(songs[songIndex]);
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
	window.requestAnimationFrame(music_visualizer); // this will refresh the frames
	frequencyArray = new Uint8Array(analyzer.frequencyBinCount); // takes the fequencyBinCount and sets it into an array
	//alert(frequencyArray.length);
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
	gainNode.gain.value = val / 100;
}
