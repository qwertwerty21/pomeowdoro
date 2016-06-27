var tag = document.createElement( "script" );
tag.src = "http://www.youtube.com/iframe_api";

var $firstScript = $( "script" ).first();
$firstScript.parent().append( tag );

var player;
var catIframeYT;

window.onYouTubeIframeAPIReady = function(){
	
	player = new YT.Player( "catShowerDiv", {
		playerVars:{
			listType: "playlist",
			list: "PLYnGL4xCCL3J6UKqjhJAIMhZCgOVL1tjW"
		},
		events: {
			"onReady": onPlayerReady
		}
	
	});
	
};

function onPlayerReady( event ){
	catIframeYT = event.target;
	catIframeYT.pauseVideo();
	setTimeout( setShuffleFunction, 1000 );
}

function setShuffleFunction(){
	catIframeYT.setShuffle( true );
}