const express = require('express')
const app = express()
const bodyParser = require("body-parser");
var fs = require('fs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.post('/save-file', function(req, res){
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
      if (body){
        console.log(body)
        fs.writeFile('./data.json', body, {encoding: 'utf8',flag: 'w'}, function (err) {
          if (err) return console.log('File write fail: ' + err);
        });
      }
  });
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
