// Personal API Key for OpenWeatherMap API
const key = 'b15ae133a3c70b65373849d6da9a5b8a';
const urlBase = 'http://api.openweathermap.org/data/2.5/'

// Event listener to add function to existing HTML DOM element
const btn = document.getElementById('submit-button');
btn.addEventListener('click', myEventListener);

/* Function called by event listener */
async function myEventListener(e) {
    const zipcode = document.getElementById('zipcode');
    const feelings = document.getElementById('feelings');

    // Data Validation
    if (zipcode.value == '' | feelings.value == '') {
        console.log('There are missing values!');
        return
    } else {
        console.log('Values accepted.');
    }

    // Construct the POST message
    weather = await getCurrentWeather();
    console.log(weather);

    message = ` - Feeling ${feelings.value.toLowerCase()} today. It feels like it's ${weather.main.feels_like}°F outside, and it's a ${weather.weather[0].description} day.`;

    postData('/add', { msg: message })
    .then((res) => {
        return getData('/latest');
    })
    .then((res) => {
        return res.text();
    })
    .then((msg) => {
        addToLog(msg);
    })
    .catch((error) => {
        addToLog('An error occurred!');
        console.log(error);
    })
}

function addToLog(message='') {
    const log = document.getElementById('log');

    // Create log line
    const newElement = document.createElement('div');
    newElement.textContent = message;
    newElement.classList.add('log-item');

    log.appendChild(newElement);
}

/* Function to GET Web API Data*/
async function getCurrentWeather() {
    const response = fetch('/weather');

    try {
        return await (await response).json();
    } catch (error) {
        console.log('An error occurred...', error);
        return error.toString();
    }
}

/* Function to POST data */
async function postData(url='', data={}) {
    const request = fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    try {
        return await request;
    } catch (error) {
        console.log('An error occurred...', error);
    }
}

/* Function to GET Project Data */
async function getData(url = '') {
    const result = fetch(url);

    try {
        return await result;
    } catch (error) {
        console.log('An error occurred...', error);
    }
}