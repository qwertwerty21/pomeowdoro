( function( global, $ ){
	
	var $countDownTimeDis = $( "#countDownTimeDis" );
	var bringOnCats = false;
	var timeInMilSec;
	var paused = true;
	var pomeowdorosFinished = 0;
	var startTime;
	var differenceTime;
	var time;


	var $plusWorkBtn = $( "#plusWorkBtn" );
	var $minusWorkBtn = $( "#minusWorkBtn" );
	var $plusBreakBtn = $( "#plusBreakBtn" );
	var $minusBreakBtn = $( "#minusBreakBtn" );


	//the constructor function
	var Timer = function( timeInMilSecW, timeInMilSecP ){

		this.timeInMilSecW = timeInMilSecW;
		this.timeInMilSecP = timeInMilSecP;

		timeInMilSec = timeInMilSecW;

	};

	Timer.prototype.countItDown = function(){
		//used to cache 'this' referring to Timer object, because setInterval executes in global scope thereby changing 'this'
		var that = this;

		if( !paused ){
			
			startTime = Number( new Date() );

			this.tickTock = setInterval( function(){

				var nowTime = Number( new Date() );
				//calculate then difference between then and now and subtract the DIFFERENCE from time to get a more accurate timer
				differenceTime = Math.floor( nowTime - startTime );
				time = timeInMilSec - differenceTime;

				if( time < 1 ){
					that.showMeTheCats();
				}

				//convert time to min and secs array
				var minSecArray = that.convertTime( time );
				//pass returned array from minSecArray to be displayed
				var timeString = that.createTimeString( minSecArray );
				$countDownTimeDis.html( timeString );

				nowTime = startTime;

			}, 300 );	
		}

		else{
			//subtract differenceTime fron timeInMilSec so future calculations make sense
			timeInMilSec = timeInMilSec - differenceTime;
			clearInterval(this.tickTock);
		}
		
	};

	Timer.prototype.convertTime = function( time ){
		//60000 ms in 1 minute
		var minutes = Math.floor( time / 60000 );
		//get the remaining seconds which don't make up a minute and convert to secs--1000 ms in 1 sec
		var seconds = Math.floor( ( time % 60000 ) / 1000 );

		if( minutes < 0 && seconds < 0 ){
			minutes = 0;
			seconds = 0;
		}

		return [ minutes, seconds ];
	};

	Timer.prototype.createTimeString = function( array ){
		//add '00' to front and only display the last two digits
		return ( ( "00" + array[0] ).slice( -2 ) + ":" + ( "00" + array[1] ).slice( -2 ) );
	};


	Timer.prototype.showMeTheCats = function(){
		//clear old interval
		clearInterval(this.tickTock);
		//reset clock and display kitties
		if( bringOnCats ){
			
			bringOnCats = false;
			
			if( catIframeYT ){
				catIframeYT.pauseVideo();
			}
			
			$( "#catShowerDiv" ).addClass( "hidden" );
			$( ".jumbotron" ).removeClass( "invisible" );
			$( "#timerShowerDiv" ).removeClass( "invisible" );
			$countDownTimeDis.removeClass( "fix-to-bot" );
			timeInMilSec = this.timeInMilSecW;

			this.showNotification();
			
		}

		else{
			
			bringOnCats = true;
			$( "#catShowerDiv" ).removeClass( "hidden" );
			
			if( catIframeYT ){
				catIframeYT.playVideo();
			}
			
			$( ".jumbotron" ).addClass( "invisible" );
			$( "#timerShowerDiv" ).addClass( "invisible" );
			$countDownTimeDis.addClass( "fix-to-bot" );
			timeInMilSec = this.timeInMilSecP;
			pomeowdorosFinished++;
			$( "#pomFinCountDis" ).html( pomeowdorosFinished );

			this.showNotification();
			
		}
	

		if( bringOnCats && pomeowdorosFinished > 0 && pomeowdorosFinished % 4 === 0 ){
			timeInMilSec = this.timeInMilSecP * 3;
		}
		//start new interval
		this.countItDown();
	};

	Timer.prototype.showNotification = function(){
		if( typeof Notification === 'function' ){
			
			if( !bringOnCats ){
				var workNotification = new Notification( "Pomeowdoro", {
					body: "No more kitties for now! It's work time!",
					icon: "img/catbg.JPG"
				});

				workNotification.onclick = function(){
					window.focus();
				};
			}

			else if( bringOnCats ){
				if( pomeowdorosFinished > 0 && pomeowdorosFinished % 4 === 0 ){
					var longBreakNotification = new Notification( "Pomeowdoro", {
						body: "You've completed " + pomeowdorosFinished + " Pomeowdoro(s)! Time for a looooonngg break!",
						icon: "img/catbg.JPG"
					});

					longBreakNotification.onclick = function(){
						window.focus();
					};
				}

				else{
					var breakNotification = new Notification( "Pomeowdoro", {
						body: "You've completed " + pomeowdorosFinished + " Pomeowdoro(s)! Nice! Time for a quick break!",
						icon: "img/catbg.JPG"
					});	

					breakNotification.onclick = function(){
						window.focus();
					};
				}
				
			}
		}

	};

	Timer.prototype.onPauseBtn = function(){
		
		var $pauseBtn = $( "#startPauseBtn" );
		var $glyphiconSpan = $( "#startPauseBtn span" );
		var that = this;
		
		$pauseBtn.on( "click", function(){

			$glyphiconSpan.toggleClass( "glyphicon-play glyphicon-pause" );
			$( ".jumbotron" ).toggleClass( "clock-start" );
			
			if( !paused ){
				paused = true;
				$plusWorkBtn.prop( "disabled", false );
				$minusWorkBtn.prop( "disabled", false );
				$plusBreakBtn.prop( "disabled", false );
				$minusBreakBtn.prop( "disabled", false );
			}

			else{
				paused = false;
				$plusWorkBtn.prop( "disabled", true );
				$minusWorkBtn.prop( "disabled", true );
				$plusBreakBtn.prop( "disabled", true );
				$minusBreakBtn.prop( "disabled", true );
			}

			that.countItDown();
		} );
	};

	Timer.prototype.onPlusMinusDuration = function(){

		var that = this;

		$plusWorkBtn.on( "click", function(){

			if( that.timeInMilSecW < ( 60000 * 99 ) ){
				clearInterval( this.tickTock );
				that.timeInMilSecW += 60000;
				that.updateDuration();

				if( !bringOnCats ){
					timeInMilSec = that.timeInMilSecW;
					var minSecConversion = that.convertTime( timeInMilSec );
					minSecConversion = that.createTimeString( minSecConversion );
					$countDownTimeDis.html( minSecConversion );
				}
			}

		});

		$minusWorkBtn.on( "click", function(){
			
			if( that.timeInMilSecW > 60000 ){
				
				clearInterval( this.tickTock );
				that.timeInMilSecW -= 60000;
				that.updateDuration();

				if( !bringOnCats ){
					timeInMilSec = that.timeInMilSecW;
					var minSecConversion = that.convertTime( timeInMilSec );
					minSecConversion = that.createTimeString( minSecConversion );
					$countDownTimeDis.html( minSecConversion );
				}
			}
	
		});

		$plusBreakBtn.on( "click", function(){

			if( that.timeInMilSecP < ( 60000 * 99 ) ){
				clearInterval( this.tickTock );
				that.timeInMilSecP += 60000;
				that.updateDuration();

				if( bringOnCats ){
					timeInMilSec = that.timeInMilSecP;
					var minSecConversion = that.convertTime( timeInMilSec );
					minSecConversion = that.createTimeString( minSecConversion );
					$countDownTimeDis.html( minSecConversion );
				}
			}

		});

		$minusBreakBtn.on( "click", function(){
			
			if( that.timeInMilSecP > 60000 ){
				
				clearInterval( this.tickTock );
				that.timeInMilSecP -= 60000;
				that.updateDuration();

				if( bringOnCats ){
					timeInMilSec = that.timeInMilSecP;
					var minSecConversion = that.convertTime( timeInMilSec );
					minSecConversion = that.createTimeString( minSecConversion );
					$countDownTimeDis.html( minSecConversion );
				}
			}			
			
		});

	};

	Timer.prototype.updateDuration = function(){
		var $workTimeCounter = $( "#workTimeCounter" );
		var $breakTimeCounter = $( "#breakTimeCounter" );

		var workTimeInMinSec = this.convertTime( this.timeInMilSecW );
		var breakTimeInMinSec = this.convertTime( this.timeInMilSecP );

		workTimeInMinSec = this.createTimeString( workTimeInMinSec );
		breakTimeInMinSec = this.createTimeString( breakTimeInMinSec );

		$workTimeCounter.html( workTimeInMinSec );
		$breakTimeCounter.html( breakTimeInMinSec );
	};

	Timer.prototype.init = function(){
		this.onPauseBtn();
		this.onPlusMinusDuration();
		this.updateDuration();
	};

	global.Timer = Timer;
})( window, jQuery );