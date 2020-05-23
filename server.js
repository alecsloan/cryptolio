const bodyParser = require("body-parser");
const cors = require('cors')
const express = require('express')
const fetch = require('node-fetch')

const app = express()

const BASE_URL = 'https://web-api.coinmarketcap.com/v1.1/cryptocurrency'

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

function getListings(limit) {
    return fetch(`${BASE_URL}/listings/latest?limit=${limit}`).then(res => res.json());
}

app.get('/fetch-coins', function(req, res){
    var limit = req.body.limit || 100;
    var currency = req.body.currency || "USD";

    var coinPromise = getListings(limit, currency).catch(console.error);

    coinPromise.then(
        function(data){
            if (!data)
                return;

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

app.listen(5000, () => console.log('Server serving on port 5000!'))
