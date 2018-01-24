# Pet Weather App

This is a small web application that will let you know if your pet needs their umberella today. You can submit information about your pet, and your pet's location, and the app will let you know if your pet needs their umberella. It has been determined that a pet needs their umberella if there is currently a >50% chance of rain in the pets current location.

## Technologies

The app was created using Node.js using the express framework. All data regarding pets is sent to and recieved from the pet shelter api using the node-fetch module. I used ejs to help generate HTML markup.

## Installation

Install the dependencies:
```
$ npm install
```
Run app:
```
$ npm start
```
## Deployment

The app has been deployed to https://daniels-pet-weather-app.herokuapp.com/