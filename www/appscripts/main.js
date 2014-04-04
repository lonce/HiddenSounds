/* This application does simple "event chat". Here, events are mouse clicks on a canvas. 
	We register for the following messages:
		init - sent by the server after the client connects. Data returned is an id that the server and other clients will use to recognizes messages from this client.
		mouseClick - sent when another chatroom member generates a mouse click. Data is x, y of their mouse position on their canvas.
*/

require.config({
        paths: {
                "jsaSound": "http://animatedsoundworks.com:8001/"
				//"jsaSound": "http://localhost:8001/"
        }
});
require(
	["require", "utils", "jsaSound/jsaModels/jsaMp3"],

	function (require, utils, sndFactory) {

		var ypos=0;
		var sound=[];

		for(var i=0;i<5;i++){
			sound[i]=sndFactory();
			sound[i].setParam("Sound URL", "resources/sound" + (i+1) + ".mp3");
			sound[i].setParam("Gain", 2);
			sound[i].location = {};
			sound[i].dist=0; // initialize to be zero distance from the pointer
		}

		sound[0].location.x=0;
		sound[0].location.y=45;
		sound[0].location.z=45;

		sound[1].location.x=0;
		sound[1].location.y=45;
		sound[1].location.z=315;

		sound[2].location.x=0;
		sound[2].location.y=0;
		sound[2].location.z=90;

		sound[3].location.x=0;
		sound[3].location.y=0;
		sound[3].location.z=270;

		sound[4].location.x=0;
		sound[4].location.y=-45;
		sound[4].location.z=0;

		dist = function (l1, l2){
			dx=Math.abs(l1.x-l2.x);
			dy=Math.abs(l1.y-l2.y);
			dz=Math.abs(l1.z-l2.z);

			dx = dx > 180 ? (360-dx) : dx;
			dy = dy > 180 ? (360-dy) : dy;
			dz = dz > 180 ? (360-dz) : dz;

			return Math.sqrt(dx*dx + dy*dy + dz*dz);
		}

		soundnum=0;

		myID=0;
		console.log("main is loaded");
		//screen.lockOrientation('portrait');

		var m_tx = document.getElementById("tx");
		var m_ty = document.getElementById("ty");
		var m_tz = document.getElementById("tz");
		var m_glat = document.getElementById("glat");
		var m_glon = document.getElementById("glon");
		var m_gacc = document.getElementById("gacc");

		var m_msg = document.getElementById("msg");

		var showPosition = function(position){
		  m_glat.value =  position.coords.latitude;
		  m_glon.value =  position.coords.longitude;
		  m_gacc.value =  position.coords.accuracy;
		}

		var error = function(e){
			m_msg.value = "error getting geolocation" + e;
			console.log("error getting geolocation" + e);
		}

		var getLocation = function(){
		  if (navigator.geolocation){
		    	navigator.geolocation.watchPosition(showPosition, error, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
		    }
		  else{
		  	console.log( "Geolocation is not supported by this browser.");
		  }
		}

/*
		window.ondevicemotion = function(event) {  
		    m_tx.value = event.accelerationIncludingGravity.x;  
		    m_ty.value = event.accelerationIncludingGravity.y;  
		    m_tz.value = event.accelerationIncludingGravity.z;  
		}  
*/
		// all in degrees
		var devOrientHandler = function(eventData){
		    m_tx.value = eventData.gamma.toFixed(2);  
		    m_ty.value = eventData.beta.toFixed(2);  
		    m_tz.value = eventData.alpha.toFixed(2);  

/*
		    if ((ypos < 45) && (eventData.beta > 45)){
		    	m_msg.value = "play sound " + soundnum;
		    	sound[soundnum].setParam("play", 1);
		    }

		    if ((ypos >= 45) && (eventData.beta < 45)){
		    	m_msg.value = "stop sound " + soundnum;
		    	sound[soundnum].setParam("play", 0);
		    	soundnum++;
		    	soundnum=soundnum%5;
		    }

		    ypos = eventData.beta;
*/
		var dir={};
		dir.x=eventData.gamma;
		dir.y=eventData.beta;
		dir.z=eventData.alpha;

		var distance;

		var mindist=1000000000000;
		var mini=-1;

		for (var i=0;i<5;i++){
			distance=dist(sound[i].location, dir);
			if ((distance < 15) && (sound[i].dist > 15)) {
				sound[i].setParam("play", 1);
			}
			if ((distance >= 15) && (sound[i].dist < 15)) {
				sound[i].setParam("play", 0);
			}
			sound[i].dist=distance;

			console.log("distance to sound " + i + " is " + distance);

			if (mindist > distance ){
				mindist=distance;
				mini=i;
				m_msg.value="dist to sound["+i+"] = " + mindist.toFixed(2);
			}


		}


		}

		if (window.DeviceOrientationEvent) {
		  // Listen for the event and handle DeviceOrientationEvent object
		  window.addEventListener('deviceorientation', devOrientHandler, false);
		} else{
			console.log("Device orientation not supported");
		}


		document.onmousedown=function(){
			devOrientHandler({"gamma":0, "beta":0, "alpha":0});
			sound[(soundnum++)%5].setParam("play", 1);
		};


	getLocation();
	}
);