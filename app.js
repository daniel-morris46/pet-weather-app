var express = require('express');
var path = require('path');

var app = express();

const port = process.env.PORT || 8080;

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


let fetch = require('node-fetch');

let darksky = 'https://api.darksky.net/forecast/';
let key = '537a8d0d804000c074ed23e602fe5593';

let options = {
    method: 'GET',
    mode: 'cors'
}

let petListUri = 'https://daniels-pet-shelter-api.herokuapp.com/api';

let petListReq = new fetch.Request(petListUri, options);

app.get('/', function (req, res) {
    fetch(petListReq)
      .then(response => {
        response.json().then(json => {
            res.render('index', {
                title: 'Pets',
                pets: json
            });
        });
      });
});

app.get('/add', function (req, res) {
    res.render('addPet');
});


app.post('/', function (req, res) {

    console.log('SUCCESS');

    fetch(petListUri, {
        method: "POST",
        body: req.body,
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(res => res.json())
    .then(json => console.log(json));
});


app.get('/pets/:_id', function (req, res){
    let petUri = petListUri + '/' + req.params._id;
    let petReq = new fetch.Request(petUri, options);
    let rain = false;

    //Query pet shelter api based on pet id selected
    fetch(petReq)
      .then(response => {
        response.json().then(json => {
            let pet = json;
            let lat = pet.latitude;
            let lng = pet.longitude;
            let uri = darksky + key + '/' + lat +','+ lng;
            darkSkyUri = uri.concat('?units=ca&exclude=minutely,hourly&lang=en');
            let darkSkyReq = new fetch.Request(darkSkyUri, options);

            //Query dark sky based on pet's location
            fetch(darkSkyReq)
                .then(response => {
                    response.json().then(json => {
                        let weather = json;
                        if(weather.currently.precipProbability > 0.5 && (weather.currently.precipType == 'rain' || weather.currently.temperature > 0)){
                            rain = true;
                            console.log('Umberella needed for ' + pet.name + ' at lat: ' + pet.latitude + ' lng: ' + pet.longitude);
                        }else{
                            rain = false;
                            console.log('Umberella not needed for ' + pet.name + ' at lat: ' + pet.latitude + ' lng: ' + pet.longitude);
                        }
                        console.log('POP: ' + weather.currently.precipProbability + ' Prep type: ' + weather.currently.precipType + ' Temp: ' + weather.currently.temperature);
                        //Render the pet view given a pet and wether
                        //or not that pet needs an umberella
                        res.render('viewPet', {
                            pet: pet,
                            type: pet.type,
                            rain: rain
                        });
                    });
                });

            
        });
      });
});

app.listen(port, function(){
    console.log('Server started on port '+port+'...');
});