app.get('/asynctest', function(req, res) {
  var people = [];
  for (var a = 1000; a < 3000; a++) {
    people.push("http://www.example.com/" + a + "/person.html");
  }

  async.mapLimit(people, 20, function(url, callback) {
    // iterator function
    var options2 = {
      url: url,
      headers: {
        'User-Agent': req.headers['user-agent'],
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    request(options2, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        async.series([
          // add this person into database
          function(callback) {
            var $ = cheerio.load(body);
            var name = entities.decodeHTML($('span[itemprop="name"]').text());
            new person({
              name: name,
              url: url
            }).save();
            callback();
          },

          function(callback) {
            async.waterfall([

              function(callback) {
                var $ = cheerio.load(body);
                var jobs = $('span[itemprop="jobtitle"]').length;
                if (jobs == 0) {
                  console.log("no job");
                  var jobsArr = 0;
                } else {
                  var jobsArr = [];
                  for (var aa = 0; aa < jobs; aa++) {
                    jobsArr.push(entities.decodeHTML($('span[itemprop="jobtitle"]').eq(aa).text()));
                  }
                }

                callback(null, jobsArr);
              },

              function(jobsArr, callback) {
                if (jobsArr == 0) {
                  console.log("this person has no jobs");
                } else {

                  async.map(jobsArr, function(jobs, callback) {
                    personRole.where('job_name', jobs).fetch({
                      require: true
                    }).then(function(data1) {
                      data1 = data1.toJSON();
                      person.where('url', url).fetch().then(function(data2) {
                        data2 = data2.toJSON();
                        new personPersonRole({
                          person_id: data2.id,
                          personrole_id: data1.id
                        }).save();
                      });
                    }).catch(function(err) {
                      new personRole({
                        job_name: jobs
                      }).save().then(function(data3) {
                        data3 = data3.toJSON();
                        person.where('url', url).fetch().then(function(data4) {
                          data4 = data4.toJSON();
                          new personPersonRole({
                            person_id: data4.id,
                            personrole_id: data3.id
                          }).save();
                        });
                      });
                    });
                  });
                }
                callback(null, "yes");
              }
            ], function(err, result) {
              if (err) {
                console.log(err);
              }
            });
            callback();
          }
        ], function(err, result) {
          if (err) {
            console.log("err3");
          }
        });} else {
        console.log("err4");
		}
    });
    callback();
  });
});