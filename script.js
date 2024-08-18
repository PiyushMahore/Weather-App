const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.getElementById("cityInput");
const card = document.querySelector(".card");
const apiKey = `e3385651c287416131b30395e13d1d72`;
const body = document.querySelector('body');

let citys;

window.onload = async function(){
    const getSuggetion = await fetch(`https://countriesnow.space/api/v0.1/countries/population/cities`)
    const response = await getSuggetion.json()
    citys = response.data
}

cityInput.addEventListener('input', async() => {
    let fItem = citys.filter((city) => city.city.toLowerCase().startsWith(cityInput.value.toLowerCase()))
    if(cityInput.value.length < 1) {
        fItem = ''
    }
    showSuggetions(fItem);
})

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try {
            const weatherData = await getWeather(city);
            displayWeatherInfo(weatherData);
            showSuggetions()
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
            body.style.backgroundImage = 'url(https://wallpapers.com/images/featured/aesthetic-rain-background-wkfiz5qfrxlbx4fl.jpg)'
            return "🌧️";
        case (weatherId >= 300 && weatherId < 400):
            body.style.backgroundImage = 'url(https://images.unsplash.com/photo-1597075490504-8832142f85cd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhaW4lMkMlMjB0aHVuZGVyc3Rvcm18ZW58MHx8MHx8fDA%3D)'
            return "⛈️";
        case (weatherId >= 600 && weatherId < 700):
            body.style.backgroundImage = 'url(https://static.vecteezy.com/system/resources/thumbnails/004/845/056/original/snow-falling-with-snowman-christmas-background-free-video.jpg)'
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            body.style.backgroundImage = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh6qGRri3Bo_40zeHb7uByM0od5yVtjyu6wQ&s)'
            return "🌫️"; 
        case (weatherId === 800):
            body.style.backgroundImage = 'url(https://i.pinimg.com/736x/fa/fc/7d/fafc7d3224539c612b0521b7892aa149.jpg)'
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            body.style.backgroundImage = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr4AUW_TD807vJOH4LLYqXPN5nJQRdsWNavw&s)'
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

const div = document.createElement('div')

function showSuggetions(string) {
    div.innerHTML = null
    div.classList.remove('suggesationsBox')
    if(!string || string === '') return null;
    div.classList.remove('hideElement')
    div.classList.add('suggesationsBox')
    for(let i = 0; i < string.length; i ++) {
        const newStr = string[i].city.split(" ")[0]
        const p = document.createElement('p')
        p.classList.add("suggesations")
        p.textContent = newStr
        p.addEventListener("click", () => {
            cityInput.value = p.textContent
            div.classList.add('hideElement')
        })
        div.appendChild(p)
        if(i > 5) break;
    }
    body.appendChild(div)
}