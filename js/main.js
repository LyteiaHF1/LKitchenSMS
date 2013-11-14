console.log('Start');

/*Global variables*/

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

//Fire Base for chat
var myDataRef = new Firebase("https://heavyrotation.firebaseio.com/");
var currentUser = {};

/*flash ready function coonnect to server*/
var flashReady = function(){
	flash.connect("rtmp://localhost/SMSServer");
};
/*connected function get cam/mic */
var connected = function(success, error){
	cameras = flash.getCameras();
	audio = flash.getMicrophones();
	
	flash.startPlaying("hobbit_vp6.flv");
	setupSources();
};
/*Duration Function Vide Duration(how many secs/mins have played already)*/
var getDuration = function(duration) {
	videoDuration = duration;
	var videoDurationMin = Math.floor(duration / 60);
	var videoDurationSec = Math.floor(duration % 60);
	$("p#duration").html(videoDurationMin + ":" + videoDurationSec);
}
/*Seek time/Duration(move the scrubber to anyplace in video fast forward/rewind)*/
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
/*http://www.w3schools.com/jquery/event_mousedown.asp
http://msdn.microsoft.com/en-us/library/ie/hh924823(v=vs.85).aspx
 */
/*Seek time/Duration(move the scrubber to any place in video fast forward/rewind)*/
$("#seek_bar").mousedown(function(e){	
	var left = e.pageX - $(this).offset().left; 
	var perc = left / $("#seek_bar").width();
	var time = perc * videoDuration;
	
	flash.setTime(time);
	
	e.preventDefault();
	return false;
});

/*Volume Function Change vol(up or down)*/
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
/*pause and play functtion(pp) pause and play video(video plays auto)*/
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
/*Record function Turns on camera in order to stop press record button again*/
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

$("#audio_src").mouseenter(function(){
	$("#sources_container").html(
		"<ul>" +
			audioSourcesHTML +
		"</ul>"
	).fadeIn();
		
	$("#sources_container").find("ul li a").each(function(index){
		$(this).on("click", function(e){
			d_mic = index;
			e.preventDefault();
			return false;
		});
	});
});

$("#sources_container").mouseleave(function(){
		$(this).fadeOut();
});

$("#video_src").mouseenter(function(){
	$("#sources_container").html(
		"<ul>" +
			videoSourcesHTML +
		 "</ul>"
	).fadeIn();
	
	$("#sources_container").find("ul li a").each(function(index){
		$(this).on("click", function(e){
			d_cam = index;
			e.preventDefault();
			return false;
		});
	});
});
	
	
var setupSources = function(){
	for (var i = 0, max = cameras.length; i<max; i++) {
		videoSourcesHTML += "<li><a href='#'>" + cameras[i] + "</a></li>";
	};
	
	for (var i = 0, max = audio.length; i<max; i++) {
		audioSourcesHTML += "<li><a href='#'>" + audio[i] + "</a></li>";
	};
	
	$(videoSourcesHTML).find("li").each(function(index){
		console.log(index);
	});
}







