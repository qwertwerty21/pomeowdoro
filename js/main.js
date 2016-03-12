

$(document).ready(function(){

	if (Notification.permission !== "granted"){
    	Notification.requestPermission();
	}
	
	var myPomoTimer = new Timer( ( 60000 * 25 ) , ( 60000 * 4) );
	myPomoTimer.init();
});

