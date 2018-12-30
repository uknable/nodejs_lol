
//riot games api calling

const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const app = express();

let apiKey = 'RGAPI-4d8f6659-6292-4e5f-955a-e78f29c8fc21';
let accId = '6qcxL1F0XQdKGGb8iida_nZ0oiwf73c1WLIIJ7PW3ERXGqk';
let puuid = 'Ye0ZlySLc1rvGWvHqyVSVRXVBDMKqLFQvxJSFbfoiugg3CEKqzll7B0xUHLMTGn-tJuTx8E5jP-YQg';

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/match', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  let summName = req.body.username;
  let url = `https://oc1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accId}?api_key=${apiKey}`;

  request(url, function(error, response, body) {
    if(error) {
      res.render('index', {username: null, error: 'Error, try again'});
    } else {
      let jsonBody = JSON.parse(body);
      //let matchId = jsonBody.
      res.render('index', {username: Object.keys(jsonBody), error: null});

      console.log(JSON.parse(body));
    }
  });
});

app.post('/timeline', function(req, res) {
  let gameId = req.body.timeline;
  let url = `https://oc1.api.riotgames.com/lol/match/v4/timelines/by-match/${gameId}?api_key=${apiKey}`;

  request(url, function(error, response, body) {
    if(error) {
      res.render('index', {timeline: null, error: 'Error, try again'});
    } else {
        let jsonBody = JSON.parse(body);
        res.render('index', {timeline: Object.keys(jsonBody), error: null});
        fs.writeFile(`timeline_${gameId}.txt`, JSON.stringify(jsonBody), function(err) {
          if(err) {
            console.log(err);
          }
        });
        console.log(jsonBody);
    }
  });
});

app.post('/match', function(req, res) {
  let gameId = req.body.match;
  let url = `https://oc1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`;

  request(url, function(error, response, body) {
    if(error) {
      res.render('index', {match: null, error: 'Error, try again'});
    } else {
      let jsonBody = JSON.parse(body);
      res.render('index', {match: Object.keys(jsonBody), error: null});
      fs.writeFile(`match_${gameId}.txt`, JSON.stringify(jsonBody), function(err) {
        if(err) {
          console.log(err);
        }
      });
      console.log(jsonBody);
    }
  })
})

app.listen(3000, function() {
  console.log('listening on 3000');
});

/*
//weather app in 15 mins tutorial

const request = require('request');

let apiKey = '857a006e37100dde7a2017a7fe73dd01';
let city = 'sydney';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

request(url, function (err, response, body) {
  if(err){
    console.log('error:', err);
  } else {
    let weather = JSON.parse(body);
    let message = `The temp in ${weather.name} is ${weather.main.temp}`;
    console.log(message);
  }
});


//weather app in 30 minutes https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b

const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const app = express();

let apiKey = '857a006e37100dde7a2017a7fe73dd01';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (error, response, body) {
    if(error) {
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body);
      if(weather.main == undefined) {
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degress in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
});

app.listen(3000, function() {
  console.log('listening on port 3000')
});

*/
