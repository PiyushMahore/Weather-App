const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = `e3385651c287416131b30395e13d1d72`;


weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try {
            const weatherData = await getWeather(city);
            displayWeatherInfo(weatherData);
        }
        catch(error) {
            console.log(error);
            display.error(error);
        }
    }
    else{
        displayError(`Please Enter The City`);
    }
});

async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if(!response.ok){
        throw new Error('unable to fetch weather date');
    }
    return await response.json();
}

function displayWeatherInfo(data){
    const {name: city,
            main: {temp, humidity},
                weather: [{description, id}]} = data;

    card.textContent = '';
    card.style.display = "flex";

    const cityName = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDesplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    card.appendChild(cityName);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDesplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    cityName.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDesplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    cityName.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)} 'F `;
    humidityDesplay.textContent = `humidity: ${humidity} %`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "🌧️";
        case (weatherId >= 300 && weatherId < 400):
            return "⛈️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️"; 
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "🌫️"; 
        default:
            return "❔"
    }
}

function displayError(message) {
    const erroePara = document.createElement("p");
    erroePara.textContent = message;
    card.textContent = '';
    card.appendChild(erroePara);
    erroePara.classList.add("errorDisplay")
    card.style.display = "flex";
}