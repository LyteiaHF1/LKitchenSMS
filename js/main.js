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
var myTest = new Firebase("https://heavyrotation.firebaseio.com/");
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

//Login & Commenting 
$("#fb_login").click(function(e){
        if ($(this).html() == "SIGN IN") {
                auth.login("facebook");
        } else {
                auth.logout();
                currentUser = {};
                $("#comment_controls").fadeOut();
                $(this).html("SIGN IN");
        }
});

var auth = new FirebaseSimpleLogin(myTest, function(error, user){
        if (user) {
                $("#fb_login").html("LOG OUT");
                user["profilePic"] = "http://graph.facebook.com/" + user["username"] + "/picture";
                currentUser = user;
                $("#comment_controls").hide().fadeIn();
        } else if (error) {
                alert("Sign-in failed");
        }
});

$('#submit_comment').click(function(e){
      var name = currentUser["displayName"];
      var text = $('#comment_text').val();
      var pic = currentUser["profilePic"];
      var d = new Date();
      var month = d.getMonth()+1;
      var day = d.getDate();
      var date = month + "/" + day;
      
      if ($("#comment_text").val()) {
               myTest.push({name: name, text: text, pic: pic, date: date});
               $('#comment_text').val('');
      } else {
              alert("Please enter a comment");
      }
     
});

myTest.on('child_added', function(snapshot) {
        var message = snapshot.val();
        showChatMessage(message.name, message.text, message.pic, message.date);
});

function showChatMessage(name, text, pic, date) {
                var commentHTML = "<div class='comment'><div class='header'><img class='test_image' src='" + pic + "' width='25' height='25' /><h3>" + name + "</h3><h4>" + date + "</h4></div><p>" + text + "</p></div>";
                $("#chat_room_wrapper").append(commentHTML);
};







