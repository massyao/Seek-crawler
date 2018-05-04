var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var app = express();
var url = require('url');
var eventproxy = require('eventproxy');
var fs = require('fs');
var async = require("async");



var cnodeUrl = 'https://www.seek.com.au';

var count = 1;
var url_short = "https://www.seek.com.au/javascript-jobs?page=";
var html_text = '';
var urls = [];
var concurrencyCount = 0;




for(var i = 1; i < 3; i++) {
  urls.push('https://www.seek.com.au/javascript-jobs?page=' + i);
}

get_seek_content(1);


function to_say_something(message,times){
		console.log(""+(new Date())+"  "+times+"  " +message);
}




function get_seek_content(times){
	
	var seek_url = url_short+times;

	superagent.get(seek_url).end(function (err, sres) {
		
		if (err) {
			return next(err);
		}
	  
	  
		var $ = cheerio.load(sres.text);
		var items = [];
		var topicUrls = [];
		
		
		//sleep(20000*Math.random());

	  
	 // HfVIlOd E6m4BZb    //title class
	 //_3INaVUb              //content class
	  
	  
		$('.oFneB7F').each(function (idx, element) {
			var $element = $(element);

			var href = url.resolve(cnodeUrl, $element.attr('href'));
			topicUrls.push(href);
			
			//console.log(href);

		});
		
		console.log(topicUrls.length);

	//  res.send(topicUrls);
	  
	  
	  
		
		var ep = new eventproxy();


		ep.after('seek_content', topicUrls.length, function (topics) {
			
			
			topics = topics.map(function (topicPair) {
				var topicUrl = topicPair[0];
				var topicHtml = topicPair[1];
				
				var $ = cheerio.load(topicHtml);
				//var content = $(".job-template__wrapper").text().trim();
				//var content = $(".tempmargin").text().trim();
				
				return ({
				  
				  href: topicUrl,
				  content: $(".tempmargin").text().trim(),
				});	
				
			});
			
			
			if(topics.length == topicUrls.length){
	

				console.log("page "+times+" content parse success !");

			};
			//console.log(typeof topics[0].content);
			
		

			
			for(var i=0 ;i<topics.length;i++){
				html_text += topics[i].content;	
			}
			
			console.log(html_text.length);
			
			var filename = "./test"+times+".html";

			fs.writeFile(filename, html_text, function(err) {
				if(err) {
					return console.log("×××××××"+err);
				}

				console.log("File  write success !");
				

			}); 
			
			to_say_something("Sleeping Zz......Zz.....",page);
			//sleep(10000*Math.random());	

		});
		
		

		function fetchUrl(url, callback) {
			// delay 的值在 2000 以内，是个随机的整数
			var delay = parseInt((Math.random() * 10000000) % 2000, 10);
			concurrencyCount++;
			console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
			
			superagent.get(url)
			.end(function (err, res) {
				console.log('fetch ' + url + ' successful');
				ep.emit('seek_content', [url, res.text]);
			});
			
			
			
			setTimeout(function () {
				concurrencyCount--;
				callback(null, url + ' html content');
			}, delay);

		};




		async.mapLimit(urls, 5, function (url, callback) {
			fetchUrl(url, callback);
			}, function (err, result) {
			console.log('final:');
			console.log(result);
		});
		

/*

		//code rewrite with async.maplimit
		topicUrls.forEach(function (topicUrl) {
			
			//console.log("!");
			
			superagent.get(topicUrl)
			.end(function (err, res) {
				//console.log('fetch ' + topicUrl + ' successful');
				ep.emit('seek_content', [topicUrl, res.text]);
			});
		}); 
*/
		
	});
	
	


}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}
