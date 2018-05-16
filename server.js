

var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var app = express();
var url = require('url');
var eventproxy = require('eventproxy');

var cnodeUrl = 'https://www.seek.com.au';

app.get('/', function (req, res, next) {
	superagent.get('https://www.seek.com.au/javascript-jobs?page=2')
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

		});

	
    //  res.send(topicUrls);
	  
	  
	  
		var ep = new eventproxy();

		ep.after('topic_html', topicUrls.length, function (topics) {
			topics = topics.map(function (topicPair) {
				var topicUrl = topicPair[0];
				var topicHtml = topicPair[1];
				var $ = cheerio.load(topicHtml);
				return ({
				  
				  href: topicUrl,
				 // content: $(".temptop").text().trim(),
				 content: $(".temptop").text(),
				});
			});

			console.log('final:');
			console.log(topics);
		  
			fs.writeFile("./test.html", topicHtml, function(err) {
				if(err) {
					return console.log(err);
				}
				
				console.log("file write success !");
			
			});
		
		

		

		  
			topicUrls.forEach(function (topicUrl) {
				superagent.get(topicUrl)
					.end(function (err, res) {
					  console.log('fetch ' + topicUrl + ' successful');
					  ep.emit('seek_content', [topicUrl, res.text]);
					});
			});  
		  
		  
		  
		});
	});
});



