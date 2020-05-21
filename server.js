const bodyParser = require("body-parser");
const cors = require('cors')
const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs');

const app = express()

const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency'
const apiKey = '';

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

function getListings(coins) {
    const config = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Accept-Charset': 'utf-8',
            'X-CMC_PRO_API_KEY': apiKey
        }
    };

    return fetch(`${BASE_URL}/quotes/latest?symbol=${coins}`, config).then(res => res.json());
}

app.post('/save-file', function(req, res){
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Content-Type', 'application/json');
      if (req.body.data){
        fs.writeFile('./src/data.json', req.body.data,{encoding:'utf8',flag:'w'}, function (err, results) {
          if (err) return console.log('File write fail: ' + err);
           return res.send({status: 'File Updated' });
        });
      }
});

app.get('/', function(req, res){
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Content-Type', 'application/json');
 return res.send({status: 200 });
});

app.get('/fetch-coins', function(req, res){
    var shownCoins = "btc,xrp,gnt,cro,mco";

    if (req.body.shownCoins)
        shownCoins = req.body.shownCoins;

    var coinPromise = getListings(shownCoins).catch(console.error);

    coinPromise.then(
        function(data){
            if (!data)
                return;

            fs.writeFile('./src/data.json', JSON.stringify({coins: data.data, show: shownCoins}, null, '\t'),{encoding:'utf8',flag:'w'}, function (err, results) {
                if (err) return console.log('File write fail: ' + err);
            });

            return res.send({coins: data.data });
        }
    );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(5000, () => console.log('Server serving on port 5000!'))
