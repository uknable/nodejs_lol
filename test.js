const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const fs = require('fs');
const app = express();

let apiKey = 'RGAPI-deed69ff-63db-40a2-a22e-a42e293f1db5';
let urlHost = "https://oc1.api.riotgames.com";
let testQuery = "?endIndex=5";

let summonerName = "";
let accountId = "";

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/', (req, res) => {
  summonerName = req.body.summonerName;
  res.redirect(`/${summonerName}`);
});

app.get("/:summonerName", (req, res) => {
  summonerName = req.params.summonerName;

  //find unique accound id
  let urlSummoner = `${urlHost}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`

  request(urlSummoner, (err, resp, body) => {
    if(err) {
      res.render("home", { error: "error url summoner" });

    } else {

      let jsonBody = JSON.parse(body);
      accountId = jsonBody.accountId;
      let urlMatchHistory = `${urlHost}/lol/match/v4/matchlists/by-account/${accountId}${testQuery}&api_key=${apiKey}`

      request(urlMatchHistory, (err, resp, body) => {
        if(err) {
          res.render("home", { error: "error url match history" });
        } else {
          let jsonBody = JSON.parse(body);
          let gameIds = [];
          console.log(Object.keys(jsonBody.matches).length);
          //for(i=0; i<Object.keys(jsonBody.gameIds))
          res.render('home', { summonerName: summonerName  });
        }
      })
    }
  });





});


app.listen(3000, () => {
  console.log('listening on 3000');
});
