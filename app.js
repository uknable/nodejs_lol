const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const app = express();

let apiKey = 'RGAPI-deed69ff-63db-40a2-a22e-a42e293f1db5';
let urlHost = "https://oc1.api.riotgames.com";
let testQuery = "?endIndex=5";

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/', (req, res) => {

  let summName = req.body.summonerName;
  let urlSumm = `${urlHost}/lol/summoner/v4/summoners/by-name/${summName}?api_key=${apiKey}`;

  request(urlSumm, (err, resp, body) => {
    if(err) {

      res.render('home', {summonerName: null, matchList:null, error: 'summoner not found'});

    } else {

      let jsonBody = JSON.parse(body);
      let accId = jsonBody.accountId;
      let urlMatchList = `${urlHost}/lol/match/v4/matchlists/by-account/${accId}${testQuery}&api_key=${apiKey}`;

      request(urlMatchList, (err, resp, body) => {
        if(err) {

          res.render('home', {summonerName: null, matchList:null, error: 'Error, try again'});

        } else {

          let jsonBody = JSON.parse(body);

          if(jsonBody.status.status_code >= 400) {
            res.render('home', {error: "could not find summoner name"});
          }

          res.redirect(`/${summName}`); //last added, going through api tutorial

          let gameIds = [];
          let matchDetails = [];

          for(i=0; i<Object.keys(jsonBody.matches).length; i++) {
            gameIds.push(jsonBody.matches[i].gameId);
          }

          for(i=0; i<gameIds.length; i++) {
            let urlMatchDetails = `${urlHost}/lol/match/v4/matches/${gameIds[i]}?api_key=${apiKey}}`;
          }

          res.render('home', {summonerName: summName, matchList: gameIds, error: null});

        }
      });
    }
  });
});

app.get("/:summName", (req, res) => {

});


app.listen(3000, () => {
  console.log('listening on 3000');
});
