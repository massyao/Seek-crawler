var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var app = express();
var url = require('url');
var eventproxy = require('eventproxy');
var fs = require('fs');



var cnodeUrl = 'https://www.seek.com.au';




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





/*
var async = require('async');

var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, delay);
};

var urls = [];
for(var i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i);
}

async.mapLimit(urls, 5, function (url, callback) {
  fetchUrl(url, callback);
}, function (err, result) {
  console.log('final:');
  console.log(result);
});

*/
/*

var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');
var fs = require('fs');


var cnodeUrl = 'https://www.seek.com.au/javascript-jobs?page=2';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('.\\_3IzV27l').each(function (idx, element) {
      var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });

    console.log(topicUrls);
	
	var ep = new eventproxy();

	// 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
	ep.after('topic_html', topicUrls.length, function (topics) {
	  // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

	  // 开始行动
	  topics = topics.map(function (topicPair) {
		// 接下来都是 jquery 的用法了
		var topicUrl = topicPair[0];
		var topicHtml = topicPair[1];
		var $ = cheerio.load(topicHtml);
		//console.log(topicHtml);
		
		
		fs.writeFile("./test.html", topicHtml, function(err) {
			if(err) {
				return console.log(err);
		}
	 
		//console.log("The file was saved!");
		});
	
		return ({
		  title: $('.topic_full_title').text().trim(),
		  href: topicUrl,
		  comment1: $('.reply_content').eq(0).text().trim(),
		});
	  });
	
	//console.log(typeof topics);
	//console.log('final:');
	//console.log(topics);
	console.log("The file was saved!");  

	  
	});

	topicUrls.forEach(function (topicUrl) {
	  superagent.get(topicUrl)
		.end(function (err, res) {
		 // console.log('fetch ' + topicUrl + ' successful');
		  ep.emit('topic_html', [topicUrl, res.text]);
		});
	});
	
	


	  
	
	
	
});
  
  
*/
  
/*
// 引入依赖
var express = require('express');
var utility = require('utility');

// 建立 express 实例
var app = express();

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
	  
	 
	  
	  if($.length !== 0){
		  console.log("!!!");
	  }
	  
	  
      var items = [];
	  
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        });
		console.log('done!');
      });

      res.send(items);
    });
});

*/