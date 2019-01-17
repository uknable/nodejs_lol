const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const d3 = require('d3');
const app = express();

let apiKey = 'RGAPI-62bbf04e-8a2e-4a1f-880d-91dfa80dd157';
let urlHost = "https://oc1.api.riotgames.com";
let testQuery = "?endIndex=5";

let summonerName = "";
let accountId = "";
let matchIds = [];
let matchId = "";
let deathCords = [];

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
      console.log(jsonBody);

      //get match history list
      let urlMatchHistory = `${urlHost}/lol/match/v4/matchlists/by-account/${accountId}${testQuery}&api_key=${apiKey}`

      request(urlMatchHistory, (err, resp, body) => {
        if(err) {
          res.render("home", { error: "error url match history" });
        } else {
          let jsonBody = JSON.parse(body);

          matchIds = [];
          for(i=0; i<Object.keys(jsonBody.matches).length;i++) {
            matchIds.push(jsonBody.matches[i].gameId);
          }
          res.redirect(`/${summonerName}`);
        }
      });
    }
  });
});

app.get("/:summonerName", (req, res) => {
  res.render('home', { summonerName: summonerName, matchList: matchIds });
});

app.post("/:summonerName/:matchId", (req, res) => {
  matchId = req.params.matchId;

  let urlTimeline = `${urlHost}/lol/match/v4/timelines/by-match/${matchId}?api_key=${apiKey}`

  request(urlTimeline, (err, resp, body) => {
    if(err) {
      res.render("details", { error: "error url match history" });
    } else {
      let jsonBody = JSON.parse(body);

      deathCords = [];

      for(i=0; i<Object.keys(jsonBody.frames).length;i++) {
        for(j=0; j<Object.keys(jsonBody.frames[i].events).length;j++) {
          if(jsonBody.frames[i].events[j].type === "CHAMPION_KILL") {
            deathCords.push([
              jsonBody.frames[i].events[j].position.x,
              jsonBody.frames[i].events[j].position.y,
            ]);
          }
        }
      }
      res.redirect(`/${summonerName}/${matchId}`);
    }
  });


});

app.get("/:summonerName/:matchId", (req, res) => {
  res.render("details", { deathCords: deathCords });
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
