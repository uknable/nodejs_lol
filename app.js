const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const app = express();

let apiKey = 'RGAPI-486a5d48-58be-42d5-be62-fc04dc73df7e';
let urlHost = "https://oc1.api.riotgames.com";
let testQuery = "?endIndex=5";

let summonerName = "";
let accountId = "";
let gameIds = [];

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('home');
});

app.post('/', (req, res) => {
  summonerName = req.body.summonerName;
  console.log(summonerName);

  //find unique accound id
  let urlSummoner = `${urlHost}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`

  request(urlSummoner, (err, resp, body) => {
    if(err) {
      res.render("home", { error: "error url summoner" });

    } else {

      let jsonBody = JSON.parse(body);
      accountId = jsonBody.accountId;

      //get match history list
      let urlMatchHistory = `${urlHost}/lol/match/v4/matchlists/by-account/${accountId}${testQuery}&api_key=${apiKey}`

      request(urlMatchHistory, (err, resp, body) => {
        if(err) {
          res.render("home", { error: "error url match history" });
        } else {
          let jsonBody = JSON.parse(body);

          gameIds = [];
          for(i=0; i<Object.keys(jsonBody.matches).length;i++) {
            gameIds.push(jsonBody.matches[i].gameId);
          }
          res.redirect(`/${summonerName}`);
        }
      });
    }
  });
});

app.get("/:summonerName", (req, res) => {
  res.render('home', { summonerName: summonerName, matchList: gameIds });
});

app.get("/:summonerName/:matchId", (req, res) => {

  //res.json({ summonerName: req.params.summonerName, matchId: req.params.matchId});
  res.render("details");
})

app.listen(3000, () => {
  console.log('listening on 3000');
});
