console.log('Start');


var playing = true;
var recording = false;

var videoDuration;

var audio = [];
var cameras = [];

var videoSourcesHTML ="";
var audioSourcesHTML ="";

var d_cam = 0;
var d_mic = 0;

var position_percentage = 0;


var flashReady = function(){
	flash.connect("rtmp://localhost/SMSServer");
};

var connected = function(success, error){
	cameras = flash.getCameras();
	audio = flash.getMicrophones();
	
	flash.startPlaying("hobbit_vp6.flv");
	setupSources();
};

var getDuration = function(duration) {
	videoDuration = duration;
	var videoDurationMin = Math.floor(duration / 60);
	var videoDurationSec = Math.floor(duration % 60);
	$("p#duration").html(videoDurationMin + ":" + videoDurationSec);
}

var seekTime = function(time) {
	var currentMin = Math.floor(time / 60);
	var currentSec = Math.floor(time % 60);
	
	if (currentSec < 10) {
		$("#seek_time").html(currentMin + ":" + "0" + currentSec + "  /");
	} else {
		$("#seek_time").html(currentMin + ":" + currentSec + "  /");
	}

	position_percentage = time / videoDuration;
	
	$("#scrubber").css("left", Math.floor(position_percentage * $("#seek_bar").width()));
}
/*http://www.w3schools.com/jquery/event_mousedown.asp */
$("#seek_bar").mousedown(function(e){	
	var left = e.pageX - $(this).offset().left; 
	var perc = left / $("#seek_bar").width();
	var time = perc * videoDuration;
	
	flash.setTime(time);
	
	e.preventDefault();
	return false;
});


$("#volume").click(function(e){
	var relativeX = e.pageX - $(this).offset().left;
	var perc = relativeX / $("#volume").width();
	var newX = perc * $("#volume").width();
	
	if (perc > 1) {perc = 1;};
	if (newX > 90) {newX = 90;};
	
	$("#volume img").css("left", newX);
	flash.setVolume(perc);
	
	e.preventDefault();
	return false;
});

$("#pp").click(function(e){				
		if (!playing) {
			flash.playPause();
			$("#pp img").attr("src", "images/pause.png");
			playing = true;
		} else {
			flash.playPause();
			$("#pp img").attr("src", "images/play.png");		
			playing = false;
		}
		e.preventDefault();
		return false;
});

$("#record").click(function(e){	
	console.log('hello');
	if (!recording) {
		flash.startRecording("movie", 0, 0);
		recording = true;
	} else {
		flash.stopRecording();
		flash.startPlaying("hobbit_vp6.flv");
		recording = false;
	}
	e.preventDefault();
	return false;
});

