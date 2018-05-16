
		var delay = parseInt((Math.random() * 100000000) % 2000, 10);
		var concurrencyCount =1;

	
/*	
	setTimeout(function () {
		concurrencyCount--;
		
	}, delay);
	setTimeout(function () {
		concurrencyCount--;
		
	}, Math.random()*10000);
*/	
	concurrencyCount++;
	console.log(parseInt((Math.random() * 1000000000) % 20000, 10));
	
	setTimeout(function () {
		concurrencyCount--;
		console.log(new Date()+'     time_stamp2');		
	}, delay);
	console.log(new Date()+'     time_stamp3');		