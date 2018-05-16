var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var app = express();
var url = require('url');
var eventproxy = require('eventproxy');
var fs = require('fs');



var cnodeUrl = 'https://www.seek.com.au';

var seek_page_url =  "https://www.seek.com.au/javascript-jobs?page=2";

seek_page_parse(seek_page_url);
function seek_page_parse(seek_page_url){

	superagent.get(seek_page_url)
    .end(function (err, sres) {
		
		if (err) {
			return next(err);
		}
	  
	  
	var $ = cheerio.load(sres.text);
	var items = [];
	var topicUrls = [];

	  
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
			
			
			console.log("                               "+topics.length == topicUrls.length);
			console.log(typeof topics[0].content);
			
		
			var html_text = '';
			
			for(var i=0 ;i<topics.length;i++){
				html_text += topics[i].content;	
			}
			
		
			
			console.log(html_text);
			
			fs.writeFile("./test.html", html_text, function(err) {
				if(err) {
					return console.log("×××××××"+err);
				}

				console.log("File  write success !");

			}); 
			
/*			
			fs.writeFile("./test.html", topics, function(err) {
				if(err) {
				return console.log(err);
				}

				console.log("file write success !");

			}); 
*/		  

		});
		
				

		  
		topicUrls.forEach(function (topicUrl) {
			
			//console.log("!");
			
			superagent.get(topicUrl)
			.end(function (err, res) {
				//console.log('fetch ' + topicUrl + ' successful');
				ep.emit('seek_content', [topicUrl, res.text]);
			});
		}); 
		
		
		
	});





}