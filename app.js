const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const app = express();

let apiKey = 'RGAPI-b7e3d714-9faf-4201-8cef-e49b34a391db';

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {

  let summName = req.body.summonerName;
  let urlSumm = `https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summName}?api_key=${apiKey}`;

  request(urlSumm, function(err, resp, body) {
    if(err) {
    
      res.render('index', {summonerName: null, matchList:null, error: 'Error, try again'});
    
    } else {

      let jsonBody = JSON.parse(body);
      let accId = jsonBody.accountId;
      let urlMatchList = `https://oc1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accId}?endIndex=5&api_key=${apiKey}`;

      request(urlMatchList, function(err, resp, body) {
        if(err) {

          res.render('index', {summonerName: null, matchList:null, error: 'Error, try again'});
        
        } else {

          let jsonBody = JSON.parse(body);
          let gameIds = [];
          let matchDetails = [];

          for(i=0; i<Object.keys(jsonBody.matches).length; i++) {
            gameIds.push(jsonBody.matches[i].gameId);
          }

          for(i=0; i<gameIds.length; i++) {
            let urlMatchDetails = `https://oc1.api.riotgames.com/lol/match/v4/matches/${gameIds[i]}?api_key=${apiKey}}`;


          }

          res.render('index', {summonerName: summName, matchList: gameIds, error: null});
          
        }
      });
    }
  });
});



app.listen(3000, function() {
  console.log('listening on 3000');
});