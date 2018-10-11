var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var apiKey = '80c1245dc664673c681da5a0f58cf629';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  request('https://apis.datos.gob.ar/georef/api/provincias', function (err, resp, data) {
  var provinces = JSON.parse(data)
  console.log(provinces)
  console.log(err)
  res.render('index', { provinces: provinces, weather: null, error: null });
  })
})

app.post('/', function (req, res) {
  var city = req.body.city;
  // var url = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=${apiKey}`
  var url = 'https://api.openweathermap.org/data/2.5/find?q='+city+'&units=metric&appid='+apiKey;
  
  request(url, function (err, response, data) {
    if(err){
      res.render('index', {weather: null, error: err});
    } else {
      //console.log(data)
      var weather = JSON.parse(data)

      if(weather.cod != 200){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        var w = weather.list[0];
        console.log(w)
        var weatherText = `It's ${w.main.temp} degrees in ${w.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
