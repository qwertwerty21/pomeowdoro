

$(document).ready(function(){

	$.getScript( "timer.js", function(){

		var myPomoTimer = new Timer( ( 60000 * 25 ) , ( 60000 * 4) );
		myPomoTimer.init();
	
	});
	
});

