var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var app = express();
var url = require('url');
var eventproxy = require('eventproxy');
var fs = require('fs');
var async = require("async");



var cnodeUrl = 'https://www.seek.com.au';
var url_short = "https://www.seek.com.au/javascript-jobs?page=";
var html_text = [];
var seek_page_urls = [];
var concurrencyCount = 0;
var count = 91;
var task_pages = 10;
var final_result = '';



for(var i = count; i < count+task_pages+1; i++) {
  seek_page_urls.push('https://www.seek.com.au/javascript-jobs?page=' + i);
  //console.log(seek_page_urls[i]);
}




function to_say_something(message,times){
		console.log(""+(new Date())+"  "+times+"  " +message);
}




async.mapLimit(seek_page_urls, 100, function (seek_page_url, call_back) {
	seek_page_parse(seek_page_url);
	
}, function (err, result) {
  //console.log(result);
  console.log("err");
});

function call_back(err,ele){
	if(err){
		console.log("err!");
	}else{
		return ele;
	}
	
}

function seek_page_parse(seek_page_url,callback){
	

	setTimeout(function () {
	

		superagent.get(seek_page_url)
		.end(function (err, sres) {
			
			if (err) {
				return next(err);
			}
		  
		  
		var $ = cheerio.load(sres.text);
		var items = [];
		var topicUrls = [];
		var seek_text = '';
		  
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
					console.log(""+seek_page_url+"   sub_page content parse success !");
				};
				//console.log(typeof topics[0].content);
				
			
				
				
				for(var i=0 ;i<topics.length;i++){
					seek_text += topics[i].content;	
				}
				
				
				html_text.push(seek_text);
			
				
				//console.log(html_text);

				
				var file_name = "./test"+count+".html";
				fs.writeFile(file_name,html_text, function(err) {
					console.log("File "+count+" write success !");			
					count++;
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
		
		//callback(null,seek_text);
	


	}, Math.random()*100000);


}