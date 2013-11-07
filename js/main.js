console.log('Start');

var flashReady = function(){
        $( "#play" ).click(function() {
                alert( "ALERT!!!" );
                flash.connect();
          });
}

var connected = function(success,error){
        flash.playPause();
        
}