for(var i = 0;i<10;i++){
	console.log((function(e){return e;})(i));
	sleep(5000);
	
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}