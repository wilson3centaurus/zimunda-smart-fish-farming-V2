const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "YOUR-API-KEY-HERE"; // API key for OpenWeatherMap API
// Function to create weather card HTML
const createWeatherCard = (cityName, weatherItem, index) => {
 if(index === 0) { // HTML for the main weather card
 return `<div class="details">
 <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
 <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
 <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
<h6>Humidity: ${weatherItem.main.humidity}%</h6>
 </div>
 <div class="icon">
 <img
src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weathericon">
 <h6>${weatherItem.weather[0].description}</h6>
 </div>`;
} else { // HTML for the other five day forecast card
    return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img
   src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weathericon">
    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
   <h6>Humidity: ${weatherItem.main.humidity}%</h6>
    </li>`;
    }
   }
   // Function to fetch weather details
   const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?
   lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
    // Filter the forecasts to get only one forecast per day
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter(forecast => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
    return uniqueForecastDays.push(forecastDate);
    }
    });
    // Clearing previous weather data
    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";
    // Creating weather cards and adding them to the DOM
    fiveDaysForecast.forEach((weatherItem, index) => {
    const html = createWeatherCard(cityName, weatherItem, index);
    if (index === 0) {
    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
    } else {
    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
    }
    }); 
    })
    .catch(() => {
    alert("An error occurred while fetching the weather forecast!");
    });
   }
   // Function to fetch coordinates based on city name
   const getCityCoordinates = () => {
    const cityName = "London"; // Default city name
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?
   q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get coordinates based on the default city name
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
    if (!data.length) return alert(`No coordinates found for ${cityName}`);
    const { lat, lon, name } = data[0];
    getWeatherDetails(name, lat, lon); // Get weather details based on coordinates
    })
    .catch(() => {
    alert("An error occurred while fetching the coordinates!");
    });
   }
   // Load weather details for default city on screen load
   window.onload = () => {
    getCityCoordinates();
   }
   // Function to fetch user coordinates
   const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
    position => {
    const { latitude, longitude } = position.coords; // Get user coordinates
    const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?
   lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
    const { name } = data[0];
    getWeatherDetails(name, latitude, longitude);
    })
    .catch(() => {
    alert("An error occurred while fetching the city name!");
    });
    },
    error => { // Show alert if user denied the location permission
    if (error.code === error.PERMISSION_DENIED) {
    alert("Geolocation request denied. Please reset location permission to grantaccess again.");
    } else {
    alert("Geolocation request error. Please reset location permission.");
    }
    }
    );
   }
   // Event listener for location button click
   locationButton.addEventListener("click", getUserCoordinates);
   // Event listener for search button click
   searchButton.addEventListener("click", getCityCoordinates);
   // Event listener for Enter key press on city input field
   cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());