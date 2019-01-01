const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const app = express();

let apiKey = 'RGAPI-f429f3a7-bec2-482d-bbd2-43266150e186';

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/match', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  let summName = req.body.summonerName;
  let urlSumm = `https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summName}?api_key=${apiKey}`;

  request(urlSumm, function(err, resp, body) {
    if(err) {
      res.render('index', {summonerName: null, error: 'Error, try again'});
    } else {
      let jsonBody = JSON.parse(body);
      

      let accId = jsonBody.accountId;
      console.log(accId);

      let urlMatchList = `https://oc1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accId}?endIndex=5&api_key=${apiKey}`;

      request(urlMatchList, function(err, resp, body) {
        if(err) {
          res.render('index', {summonerName: null, error: 'Error, try again'});
        } else {
          let jsonBody = JSON.parse(body);
          let gameIds = [];
          for(i=0; i<Object.keys(jsonBody.matches).length; i++) {
            gameIds.push(jsonBody.matches[i].gameId);
          }

          res.render('index', {summonerName: gameIds, error: null});
          console.log(jsonBody);
        }
      });
    }
  });
});



app.listen(3000, function() {
  console.log('listening on 3000');
});