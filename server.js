const express = require('express')
const app = express()
const bodyParser = require("body-parser");
var fs = require('fs');
var cors = require('cors')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())


app.post('/save-file', function(req, res){
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
 res.setHeader('Content-Type', 'application/json');
      if (req.body.data){
        fs.writeFile('./src/data.json', req.body.data,{encoding:'utf8',flag:'w'}, function (err, results) {
          if (err) return console.log('File write fail: ' + err);
          console.log(req.body.data)
           return res.send({status: 'File Updated' });
        });
      }
});

app.get('/', function(req, res){
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
 res.setHeader('Content-Type', 'application/json');
 return res.send({status: 200 });
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
