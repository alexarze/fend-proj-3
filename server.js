const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

let projectData = {
    msgs: [],
};
const weatherData = [];
const zips = [];
const port = 8000;

// Personal API Key for OpenWeatherMap API
const key = 'b15ae133a3c70b65373849d6da9a5b8a';
const urlBase = 'http://api.openweathermap.org/data/2.5/'

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

// Initialize all route with a callback function
app.get('/all', getAll);
app.get('/latest', getLatest);
app.post('/weather', postWeather);

// Callback function to complete GET '/all'
function getAll(req, res) {
    res.send(projectData);
}

// Callback function to complete GET '/latest'
function getLatest(req, res) {
    res.send(projectData.msgs[projectData.msgs.length - 1])
}

// Weather gets its own GET route so that we can 
// manage the number of times we make the API call
async function postWeather(req, res) {
    // Get body data
    data = req.body;

    // Data verification
    if ('zip' in data) {
        // GOOD
    } else {
        // TODO
    }

    // If the weatherData has not been populated yet this session, populate from API call
    if (weatherData.length == 0 || !(zips.includes(data.zip))) {
        console.log(`Fetching weather because weatherData.length = ${weatherData.length} and zips.includes(${data.zip}) == ${zips.includes(data.zip)}...`);
        await fetchWeather(data.zip);
    }

    // choose the right weather data
    let retval = {};
    for (let i = 0; i < weatherData.length; i++) {
        if (weatherData[i].zip == data.zip) {
            retval = weatherData[i];
            break;
        }
    }

    // Send the weather data
    console.log(retval);
    res.send(retval);
}

// Function to fetch the weather from the OpenWeather API
async function fetchWeather(zip='') {
    const url = `${urlBase}weather?zip=${zip},US&appid=${key}&units=imperial`;

    console.log(`Fetching from ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        // add zip to data
        data.zip = zip;
        zips.push(zip);

        // push into weatherData
        weatherData.push(data);
        console.log('Successfully retrieved weather info');
      } catch (error) {
        console.log('Could not get weather info...', error);
      }
}

// Post Route
app.post('/add', postAdd)

function postAdd(req, res) {
    if ('msg' in req.body) {
        projectData.msgs.push(req.body.msg);
        res.status(200).send(`POST request successful.`);
    } else {
        res.status(403).send(`Could not find key 'msg' in request.`);
    }
}