// OpenWeatherMap API key
const API_KEY = "73b9d9d17b0008c8a89e568a306f1347";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weather-condition");
const feelsLike = document.getElementById("feels-like");
const weatherMessage =
document.getElementById("weather-message");


const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uvIndex = document.getElementById("uv-index");

const airQuality = document.getElementById("air-quality");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const lastUpdated = document.getElementById("last-updated");
const weatherIcon = document.getElementById("weather-icon");
const weatherEffects = document.getElementById("weather-effects");

const hourlyModal = document.getElementById("hourly-modal");

const hourlyContainer = document.getElementById("hourly-container");

const closeModal = document.getElementById("close-modal");

const celsiusBtn = document.getElementById("celsius-btn");
const fahrenheitBtn = document.getElementById("fahrenheit-btn");
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const effectsCheckbox = document.getElementById("effects-checkbox");

effectsCheckbox.addEventListener("change", () => {

    if(!effectsCheckbox.checked){

        weatherEffects.innerHTML = "";

    }
    else{

        if(cityName.textContent !== "Your Location"){

            getWeather(cityName.textContent);

        }

    }

});

const effectsStatus = document.getElementById("effects-status");

// Toggle weather effects
effectsCheckbox.addEventListener("change", () => {

    effectsStatus.textContent =
    effectsCheckbox.checked
    ? "On"
    : "Off";
    localStorage.setItem(
    "effects",
    effectsCheckbox.checked
);

});
// Store current weather values
let currentTempC = 0;
let currentFeelsLikeC = 0;
let currentUnit = "C";
let currentWindSpeed = 0;
let currentVisibility = 0;
let currentLat = 0;
let currentLon = 0;
let currentTimezoneOffset = 0;
let forecastData = null;
let map;
let marker;
let isFahrenheit = false;

// Restore saved user preferences
window.addEventListener("load", () => {

    map = L.map("weather-map")
        .setView([20,0],2);

    lightMap.addTo(map);

    map.on("click", async function(e){

        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        getWeatherByCoords(
            lat,
            lon
        );

    });
    const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "true"){
    themeToggle.checked = true;
    themeToggle.dispatchEvent(
        new Event("change")
    );
}

const savedUnit =
localStorage.getItem("unit");

if(savedUnit === "true"){
    unitToggle.checked = true;
    unitToggle.dispatchEvent(
        new Event("change")
    );
}

const savedMap =
localStorage.getItem("mapStyle");

if(savedMap === "true"){
    mapToggle.checked = true;
    mapToggle.dispatchEvent(
        new Event("change")
    );
}

const savedEffects =
localStorage.getItem("effects");

if(savedEffects === "false"){
    effectsCheckbox.checked = false;
    effectsCheckbox.dispatchEvent(
        new Event("change")
    );
}

});

const weatherMain =
    document.querySelector(".weather-main");

// Close hourly forecast modal
closeModal.addEventListener("click", () => {

    hourlyModal.classList.remove("show");
    document.body.classList.remove("modal-open");

});
hourlyModal.addEventListener("click", (e) => {

    if(e.target === hourlyModal){

        hourlyModal.classList.remove("show");
        document.body.classList.remove("modal-open");

    }

});

// Search weather
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city !== ""){

    getWeather(city);

    saveRecentSearch(city);

}

});


cityInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        searchBtn.click();
    }

});

// Switch to Celsius
celsiusBtn.addEventListener("click", () => {

    currentUnit = "C";

    celsiusBtn.classList.add("active-unit");
    fahrenheitBtn.classList.remove("active-unit");

    updateTemperatureDisplay();
    updateWindSpeedDisplay();
    updateVisibilityDisplay();

});

// Switch to Fahrenheit
fahrenheitBtn.addEventListener("click", () => {

    currentUnit = "F";

    fahrenheitBtn.classList.add("active-unit");
    celsiusBtn.classList.remove("active-unit");

    updateTemperatureDisplay();
    updateWindSpeedDisplay();
    updateVisibilityDisplay();

});
const themeToggle =
document.getElementById("theme-toggle");
const unitToggle =
document.getElementById("unit-toggle");
const mapToggle =
document.getElementById("map-toggle");
const lightMap = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    { attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>', maxZoom: 19 }
);

const darkMap = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>', maxZoom: 19 }
);

// Toggle map
mapToggle.addEventListener("change", () => {

    if(mapToggle.checked){

        map.removeLayer(lightMap);
        darkMap.addTo(map);

        mapStatus.textContent = "Minimal";

    } else {

        map.removeLayer(darkMap);
        lightMap.addTo(map);

        mapStatus.textContent = "Standard";
    }

});

// Toggle units
unitToggle.addEventListener("change", () => {

    if(unitToggle.checked){

        fahrenheitBtn.click();

    }
    else{

        celsiusBtn.click();

    }

});

// Toggle theme
themeToggle.addEventListener(
    "change",
    () => {

        document.body.classList.toggle(
            "light-theme"
        );

    }
);
const themeStatus =
document.getElementById("theme-status");

themeToggle.addEventListener("change", () => {

    if(themeToggle.checked){
        themeStatus.textContent = "Light";
    }else{
        themeStatus.textContent = "Dark";
    }
    localStorage.setItem(
    "theme",
    themeToggle.checked
);

});
const unitStatus =
document.getElementById("unit-status");

unitToggle.addEventListener("change", () => {

    if(unitToggle.checked){
        unitStatus.textContent = "°F";
    }else{
        unitStatus.textContent = "°C";
    }
    localStorage.setItem(
    "unit",
    unitToggle.checked
);

});
const mapStatus =
document.getElementById("map-status");

mapToggle.addEventListener("change", () => {

    if(mapToggle.checked){
        mapStatus.textContent = "Minimal";
    }else{
        mapStatus.textContent = "Standard";
    }
    localStorage.setItem(
    "mapStyle",
    mapToggle.checked
);

});

// Fetch current weather
async function getWeather(city){
    if(city.trim() === ""){
    alert("Please enter a city name.");
    return;
}

    try{

        searchBtn.innerHTML =
'<i class="fas fa-spinner fa-spin"></i> Searching';
        searchBtn.disabled = true;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if(data.cod !== 200){

            alert("City not found!");
            searchBtn.innerHTML =
'<i class="fas fa-magnifying-glass"></i> Search';
            searchBtn.disabled = false;
            return;
        }
        await new Promise(resolve =>
    setTimeout(resolve, 1500)
);
        const weatherCard =
document.querySelector(".weather-card");

weatherCard.style.animation = "none";

setTimeout(()=>{
    weatherCard.style.animation =
    "cardReveal 1s ease";
},10);
        updateUI(data);
        updateDidYouKnow();
        updateTodaysMoment();
        console.log("Getting forecast...");
        getForecast(city);

        searchBtn.innerHTML =
'<i class="fas fa-magnifying-glass"></i> Search';
        searchBtn.disabled = false;

    }

    catch(error){

        console.error(error);

        alert("Something went wrong!");

        searchBtn.innerHTML =
'<i class="fas fa-magnifying-glass"></i> Search';
        searchBtn.disabled = false;

    }

}

// Retrieve 5-day weather forecast
async function getForecast(city){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        updateForecast(data);

    }

    catch(error){

        console.error(error);

    }

}

// Fetch weather using latitude and longitude
async function getWeatherByCoords(
    lat,
    lon
){

    try{

        const response =
        await fetch(
            `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data =
        await response.json();

        updateUI(data);
        getForecast(data.name);
    }

    catch(error){

        console.error(error);

    }

}

// Get icons according to weather
function getForecastIcon(iconCode){

    if(iconCode === "01d")
        return "meteocons:clear-day-fill";

    if(iconCode === "01n")
        return "meteocons:clear-night-fill";

    if(iconCode === "02d")
        return "meteocons:partly-cloudy-day-fill";

    if(iconCode === "02n")
        return "meteocons:partly-cloudy-night-fill";

    if(
        iconCode === "03d" ||
        iconCode === "03n" ||
        iconCode === "04d" ||
        iconCode === "04n"
    )
        return "meteocons:cloudy-fill";

    if(
        iconCode === "09d" ||
        iconCode === "09n" ||
        iconCode === "10d" ||
        iconCode === "10n"
    )
        return "meteocons:rain-fill";

    if(
        iconCode === "11d" ||
        iconCode === "11n"
    )
        return "meteocons:thunderstorms-fill";

    if(
        iconCode === "13d" ||
        iconCode === "13n"
    )
        return "meteocons:snow-fill";

    return "meteocons:cloudy-fill";

}

function updateForecast(data){
    forecastData = data;
    console.log("updateForecast running");

    const forecastContainer =
        document.getElementById("forecast-container");
    console.log(forecastContainer);

    forecastContainer.innerHTML = "";
const dailyForecasts = {};

data.list.forEach(forecast => {

    const date =
        forecast.dt_txt.split(" ")[0];

    if(!dailyForecasts[date]){

        dailyForecasts[date] = {
            max: forecast.main.temp_max,
            min: forecast.main.temp_min,
            forecast: forecast
        };

    }

    else{

        dailyForecasts[date].max =
            Math.max(
                dailyForecasts[date].max,
                forecast.main.temp_max
            );

        dailyForecasts[date].min =
            Math.min(
                dailyForecasts[date].min,
                forecast.main.temp_min
            );
    }

});

    
    console.log(dailyForecasts);
    console.log(Object.keys(dailyForecasts));
console.log(Object.values(dailyForecasts));
    Object.values(dailyForecasts)
.slice(1,6)
.forEach(day => {
        console.log(day.forecast.weather[0]);
        const date =
    new Date(day.forecast.dt * 1000);

        const dayName =
            date.toLocaleDateString("en-US",{
                weekday:"short"
            });
        const forecastIcon =
    getForecastIcon(
        day.forecast.weather[0].icon
    );
    console.log(day.forecast.weather[0].icon);
console.log(forecastIcon);
        forecastContainer.innerHTML += `
    <div class="forecast-item"
         data-date="${day.forecast.dt_txt.split(" ")[0]}">

                <p>${dayName}</p>

                <iconify-icon
    icon="${forecastIcon}"
    class="forecast-icon">
</iconify-icon>

                <span class="max-temp">
    ↑ ${Math.round(day.max)}°
</span>

<span class="min-temp">
    ↓ ${Math.round(day.min)}°
</span>

            </div>
        `;

    });
    document
.querySelectorAll(".forecast-item")
.forEach(card => {
    console.log("Card found:", card);
    card.addEventListener("click", () => {
        console.log("CARD CLICKED");
        const selectedDate =
            card.dataset.date;
        const dayName =
new Date(selectedDate)
.toLocaleDateString("en-US",{
    weekday:"long"
});

document.querySelector(
    "#hourly-modal h2"
).textContent =
`${dayName} Forecast`;
        const hourlyData =
            forecastData.list.filter(item =>
                item.dt_txt.startsWith(selectedDate)
            );
        const highestTempObj =
    hourlyData.reduce((a,b)=>
        a.main.temp > b.main.temp ? a : b);

const lowestTempObj =
    hourlyData.reduce((a,b)=>
        a.main.temp < b.main.temp ? a : b);

const highestRainObj =
    hourlyData.reduce((a,b)=>
        (a.pop || 0) > (b.pop || 0) ? a : b);

const highestWindObj =
    hourlyData.reduce((a,b)=>
        a.wind.speed > b.wind.speed ? a : b);
    const highestTemp =
    Math.round(highestTempObj.main.temp);

const lowestTemp =
    Math.round(lowestTempObj.main.temp);

const highestRain =
    Math.round((highestRainObj.pop || 0) * 100);

const highestWind =
    Math.round(highestWindObj.wind.speed);

const highestTime =
    new Date(`2000-01-01 ${highestTempObj.dt_txt.split(" ")[1].slice(0,5)}`)
.toLocaleTimeString([],{
    hour:"numeric",
    minute:"2-digit",
    hour12:true
});

const lowestTime =
    new Date(`2000-01-01 ${lowestTempObj.dt_txt.split(" ")[1].slice(0,5)}`)
.toLocaleTimeString([],{
    hour:"numeric",
    minute:"2-digit",
    hour12:true
});

const highestRainTime =
    new Date(`2000-01-01 ${highestRainObj.dt_txt.split(" ")[1].slice(0,5)}`)
.toLocaleTimeString([],{
    hour:"numeric",
    minute:"2-digit",
    hour12:true
});

const highestWindTime =
    new Date(`2000-01-01 ${highestWindObj.dt_txt.split(" ")[1].slice(0,5)}`)
.toLocaleTimeString([],{
    hour:"numeric",
    minute:"2-digit",
    hour12:true
});
    const hourlyInsights =
    document.getElementById("hourly-insights");
    const hourlyTip =
    document.getElementById("hourly-tip");

hourlyInsights.innerHTML = `
<p>🔥  Warmest at ${highestTime} (${highestTemp}°C)</p>
<p>❄  Coolest at ${lowestTime} (${lowestTemp}°C)</p>
<p>🌧  Highest rain chance at ${highestRainTime} (${highestRain}%)</p>
<p>🌬  Windiest at ${highestWindTime} (${highestWind} km/h)</p>
`;
const bestTimeObj = [...hourlyData]
.filter(hour => (hour.pop || 0) < 0.2)
.filter(hour => {
    const time =
    Number(hour.dt_txt.split(" ")[1].slice(0,2));

    return time >= 6 && time <= 18;
})
.sort((a,b) => a.main.temp - b.main.temp)[0]
|| [...hourlyData]
    .sort((a,b) => (a.pop || 0) - (b.pop || 0))[0]
|| hourlyData[0];

const bestTime =
new Date(`2000-01-01 ${bestTimeObj.dt_txt.split(" ")[1].slice(0,5)}`)
.toLocaleTimeString([],{
    hour:"numeric",
    minute:"2-digit",
    hour12:true
});


let rainTip = "";

if(highestRain >= 60){

    rainTip =
    `☔ Keep an umbrella nearby.`;

}
else if(highestRain >= 30){

    rainTip =
    `🌦 A brief shower is possible later.`;

}
else{

    rainTip =
    `☀ No significant rain expected.`;

}

hourlyTip.innerHTML = `
🌤 Best time to go out: ${bestTime}

<br>

${rainTip}
`;
drawHourlyGraph(hourlyData);
console.log("OPENING MODAL");
        hourlyModal.classList.add("show");
        document.body.classList.add("modal-open");

        });

    });const forecastCards =
document.querySelectorAll(".forecast-item");

forecastCards.forEach((card,index)=>{

    card.style.animation =
    `forecastFadeIn 0.5s ease forwards`;

    card.style.animationDelay =
    `${index * 0.15}s`;

});

}

// Fetch UV index and AQI
async function getExtraWeatherData(lat, lon){

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const data = await response.json();

    const aqi = data.list[0].main.aqi;

    const qualityLabels = {
        1: "Good",
        2: "Fair ",
        3: "Moderate 😐",
        4: "Poor 😷",
        5: "Very Poor ☠️"
    };

    airQuality.textContent =
    qualityLabels[aqi];


    const uvResponse = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=auto`
);

const uvData =
await uvResponse.json();

const uv =
Math.round(
uvData.daily.uv_index_max[0]
);

let uvText = "";

if(uv <= 2){
    uvText = `${uv} (Low)`;
}
else if(uv <= 5){
    uvText = `${uv} (Moderate)`;
}
else if(uv <= 7){
    uvText = `${uv} (High)`;
}
else if(uv <= 10){
    uvText = `${uv} (Very High)`;
}
else{
    uvText = `${uv} (Extreme)`;
}

uvIndex.textContent = uvText;
}

// Update dashboard
function updateUI(data){

    // City name only — no flag
    cityName.textContent = data.name;

    currentTempC = data.main.temp;
currentFeelsLikeC = data.main.feels_like;


updateTemperatureDisplay();

    weatherCondition.textContent =
    data.weather[0].description
        .replace(/\b\w/g, letter => letter.toUpperCase());
        weatherEffects.innerHTML = "";
        const condition =
data.weather[0].main.toLowerCase();
const iconCode =
data.weather[0].icon;
const isNight =
iconCode.endsWith("n");
// Apply card tint based on current condition
applyCardConditionTint(condition);

// Dynamic background atmosphere
applyBodyAtmosphere(condition, isNight);

// Update status chip
updateWeatherStatusChip(condition, data.main.humidity, data.visibility);
if(!effectsCheckbox.checked){
    weatherEffects.innerHTML = "";
}
else{

if(condition.includes("clear")){

    if(isNight){

        weatherEffects.innerHTML =
        '<div class="moon-glow"></div>';

    }

    else{

        weatherEffects.innerHTML =
        '<div class="sun-glow"></div>';

    }

}
if(condition.includes("cloud")){
    console.log("CLOUDS RUNNING");
    weatherEffects.innerHTML = `
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
    `;

}
if(condition.includes("thunderstorm")){

    let rainHTML = "";

    for(let i = 0; i < 100; i++){

        rainHTML += `
            <span
                class="raindrop"
                style="
                    left:${Math.random()*100}%;

                    height:${15 + Math.random()*25}px;

                    animation-delay:${Math.random()*2}s;

                    animation-duration:${
                        0.8 + Math.random()*1.2
                    }s;
                ">
            </span>
        `;
    }

    weatherEffects.innerHTML = `
        <div class="thunder-flash"></div>

        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>

        <div class="rain">
            ${rainHTML}
        </div>
    `;

    startThunder();

}
}
const temp = Math.round(data.main.temp);
const feelsLikeTemp = Math.round(data.main.feels_like);

let message = "";

if(condition.includes("rain")){

    message =
    "🌧️ Rain may interrupt outdoor plans.";
    let rainCount = 50;

    if(condition.includes("light")){
        rainCount = 30;
    }
    else if(condition.includes("moderate")){
        rainCount = 60;
    }
    else if(condition.includes("heavy")){
        rainCount = 100;
    }

    let rainHTML = "";

    for(let i = 0; i < rainCount; i++){

        rainHTML += `
            <span
                class="raindrop"
                style="
                    left:${Math.random()*100}%;

                    height:${15 + Math.random()*25}px;

                    animation-delay:${Math.random()*2}s;

                    animation-duration:${
                        0.8 + Math.random()*1.2
                    }s;
                ">
            </span>
        `;
    }

    weatherEffects.innerHTML =
`
<div class="rain-glow"></div>
<div class="rain">
    ${rainHTML}
</div>
`;

}
if(condition.includes("snow")){

    let snowHTML = "";

    for(let i=0;i<40;i++){

        snowHTML += `
        <span
            class="snowflake"
            style="
                left:${Math.random()*100}%;

                animation-delay:${Math.random()*5}s;

                animation-duration:${
                    5 + Math.random()*5
                }s;
            ">
            ❄
        </span>`;
    }

    weatherEffects.innerHTML = `
        <div class="snow">
            ${snowHTML}
        </div>
    `;
}
else if(condition.includes("thunderstorm")){

    message =
    "⛈️ Stormy conditions expected.";

}
else if(condition.includes("clear")){

    message =
    "✨ Great weather for outdoor activities.";

}
else if(condition.includes("cloud")){

    message =
    "🌥️ Comfortable conditions today.";

}
else if(temp >= 35){

    message =
    "🥤 Warm conditions continue through the day.";

}
else if(feelsLikeTemp - temp >= 3){

    message =
    "🌡 It feels warmer than the actual temperature.";

}
else{

    message =
    "🌤 Enjoy today's weather.";
}


document.getElementById("weather-message").textContent =
message;
    
    updateWeatherIcon(
    data.weather[0].description,
    data.weather[0].icon
);
console.log(data.weather[0].description);
console.log(data.weather[0].icon);

    humidity.textContent =
        `${data.main.humidity}%`;

    currentWindSpeed = data.wind.speed;
    

updateWindSpeedDisplay();

    pressure.textContent =
        `${data.main.pressure} hPa`;

    currentVisibility = data.visibility;

updateVisibilityDisplay();
currentLat = data.coord.lat;
currentLon = data.coord.lon;
getExtraWeatherData(
    currentLat,
    currentLon
);
updateMap(
    data.coord.lat,
    data.coord.lon,
    data.name,
    Math.round(data.main.temp),
    weatherCondition.textContent
);

    sunrise.textContent =
    convertTime(
        data.sys.sunrise,
        data.timezone
    );

sunset.textContent =
    convertTime(
        data.sys.sunset,
        data.timezone
    );

    lastUpdated.innerHTML =
        `<i class="fas fa-arrows-rotate"></i> Updated just now`;

    currentTimezoneOffset = data.timezone;
    updateDateTime(data.timezone);
}

// Unit Conversions
function kmToMiles(km){

    return km * 0.621371;

}

function updateVisibilityDisplay(){

    const visibilityKm = currentVisibility / 1000;

    if(currentUnit === "C"){

        visibility.textContent =
            `${visibilityKm.toFixed(1)} km`;

    }

    else{

        visibility.textContent =
            `${kmToMiles(visibilityKm).toFixed(1)} mi`;

    }

}

function kmhToMph(speed){

    return speed * 0.621371;

}

function updateWindSpeedDisplay(){

    if(currentUnit === "C"){

        windSpeed.textContent =
            `${currentWindSpeed.toFixed(2)} km/h`;

    }

    else{

        windSpeed.textContent =
            `${kmhToMph(currentWindSpeed).toFixed(2)} mph`;

    }

}

function cToF(temp){

    return (temp * 9/5) + 32;

}

function updateTemperatureDisplay(){

    if(currentUnit === "C"){

        temperature.textContent =
            `${Math.round(currentTempC)}°C`;

        feelsLike.textContent =
            `Feels Like ${Math.round(currentFeelsLikeC)}°C`;

    }

    else{

        temperature.textContent =
            `${Math.round(cToF(currentTempC))}°F`;

        feelsLike.textContent =
            `Feels Like ${Math.round(cToF(currentFeelsLikeC))}°F`;

    }

}

function updateWeatherIcon(description, iconCode){

    description = description.toLowerCase();

const isNight =
    iconCode.endsWith("n");

    if(description.includes("clear")){

    weatherIcon.setAttribute(
        "icon",
        isNight
        ? "meteocons:clear-night-fill"
        : "meteocons:clear-day-fill"
    );

}

    else if(
    description.includes("few clouds") ||
    description.includes("scattered clouds")
){

    weatherIcon.setAttribute(
        "icon",
        isNight
        ? "meteocons:partly-cloudy-night-fill"
        : "meteocons:partly-cloudy-day-fill"
    );

}

    else if(
    description.includes("broken clouds") ||
    description.includes("overcast")
){

    weatherIcon.setAttribute(
        "icon",
        isNight
        ? "meteocons:partly-cloudy-night-fill"
        : "meteocons:cloudy-fill"
    );

}

    else if(
        description.includes("rain") ||
        description.includes("drizzle")
    ){

        weatherIcon.setAttribute(
            "icon",
            "meteocons:rain-fill"
        );

    }

    else if(
        description.includes("thunderstorm")
    ){

        weatherIcon.setAttribute(
            "icon",
            "meteocons:thunderstorms-fill"
        );

    }

    else if(
        description.includes("snow")
    ){

        weatherIcon.setAttribute(
            "icon",
            "meteocons:snow-fill"
        );

    }

    else if(
        description.includes("mist") ||
        description.includes("fog") ||
        description.includes("haze")
    ){

        weatherIcon.setAttribute(
            "icon",
            "meteocons:fog-fill"
        );

    }

    else{

        weatherIcon.setAttribute(
            "icon",
            "meteocons:cloudy-fill"
        );

    }

}

// Get weather using current location
async function getCurrentLocationWeather(){

    if(!navigator.geolocation){

        alert("Geolocation is not supported.");
        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{
            console.log("LOCATION SUCCESS");
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

            const data = await response.json();

            updateUI(data);
            updateDidYouKnow();
            updateTodaysMoment();
            getForecast(data.name);

        },

        (error)=>{

    console.log(error);

    alert(
        "Location error: " +
        error.message
    );

}

    );

}

// Convert time
function convertTime(unixTime, timezone){

    const date = new Date(
        (unixTime + timezone) * 1000
    );

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC"
        }
    );

}

// Graph
function drawHourlyGraph(hourlyData){
    const labelColor = document.body.classList.contains("light-theme")
    ? "#1e3a5f"
    : "#ffffff";
const axisColor = document.body.classList.contains("light-theme")
    ? "#5a6f8f"
    : "#cbd5e1";

    const graph =
        document.getElementById("hourly-graph");

    const temps =
        hourlyData.map(hour => hour.main.temp);

    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    let points = "";
    let tempLabels = "";
let timeLabels = "";
let rainLabels = "";

    // Layout constants — all labels live inside the viewBox (0 0 620 230)
    // Chart area: y=30 (top padding) to y=150 (bottom of line). 120px tall.
    // Time labels : y=168  Rain labels: y=190  bottom padding to 230
    const CHART_TOP    = 30;   // top padding so temp labels above line aren't clipped
    const CHART_BOTTOM = 150;  // bottom of the line drawing area
    const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP; // 120
    const LEFT_PAD     = 44;
    const RIGHT_PAD    = 576;  // LEFT_PAD + 532

    temps.forEach((temp,index)=>{

        const x =
            LEFT_PAD + (index / (temps.length - 1)) * (RIGHT_PAD - LEFT_PAD);

        const y =
            CHART_BOTTOM -
            ((temp - minTemp) /
            (maxTemp - minTemp || 1)) * CHART_HEIGHT;

        points += `${x},${y} `;
    });
    let pathData = "";

const pointArray = points
    .trim()
    .split(" ")
    .map(point => point.split(","));

pathData = `M ${pointArray[0][0]} ${pointArray[0][1]}`;

for(let i = 1; i < pointArray.length; i++){

    const x = pointArray[i][0];
    const y = pointArray[i][1];

    pathData += ` L ${x} ${y}`;
}

    let circles = "";

temps.forEach((temp,index)=>{

    const x =
        LEFT_PAD + (index / (temps.length - 1)) * (RIGHT_PAD - LEFT_PAD);

    const y =
        CHART_BOTTOM -
        ((temp - minTemp) /
        (maxTemp - minTemp || 1)) * CHART_HEIGHT;

    circles += `
        <circle
            cx="${x}"
            cy="${y}"
            r="6"
            fill="#6ec6ff"
        />
    `;
});
temps.forEach((temp,index) => {

    const x =
        LEFT_PAD + (index / (temps.length - 1)) * (RIGHT_PAD - LEFT_PAD);

    const y =
        CHART_BOTTOM -
        ((temp - minTemp) /
        (maxTemp - minTemp || 1)) * CHART_HEIGHT;

    tempLabels += `
        <text
            x="${x}"
            y="${y - 13}"
            fill="${labelColor}"
            font-size="14"
            font-weight="600"
            text-anchor="middle">
            ${Math.round(temp)}°
        </text>
    `;

    const time =
        hourlyData[index]
        .dt_txt
        .split(" ")[1]
        .slice(0,5);

    timeLabels += `
        <text
            x="${x}"
            y="168"
            fill="${axisColor}"
            font-size="12"
            text-anchor="middle">
            ${time}
        </text>
    `;
    const rain =
    Math.round(
        (hourlyData[index].pop || 0) * 100
    );

let rainColor = "#64748b";

if(rain >= 50){
    rainColor = "#38bdf8";
}
else if(rain >= 20){
    rainColor = "#93c5fd";
}

rainLabels += `
<text
    x="${x}"
    y="192"
    fill="${rainColor}"
    font-size="11"
    text-anchor="middle">
    💧${rain}%
</text>
`;
});
graph.innerHTML = `
<svg
    width="100%"
    height="100%"
    viewBox="0 0 620 210"
    preserveAspectRatio="xMidYMid meet">

    <path
    d="${pathData}"
    fill="none"
    stroke="#6ec6ff"
    stroke-width="3.5"
    stroke-linecap="round"
    stroke-linejoin="round"
/>

    ${circles}
    ${tempLabels}
${timeLabels}
${rainLabels}

</svg>

`;
}

// Display local date and time
function updateDateTime(timezoneOffset){

    const utcTime =
        new Date().getTime() +
        (new Date().getTimezoneOffset() * 60000);

    const cityTime =
        new Date(utcTime + (timezoneOffset * 1000));

    document.getElementById("date-time").textContent =
        cityTime.toLocaleString("en-US",{
            weekday:"long",
            month:"long",
            day:"numeric",
            hour:"numeric",
            minute:"2-digit"
        });

}

weatherMain.addEventListener("click", () => {

    if(!forecastData) return;

    const currentHour = new Date().getHours();

    const startIndex =
    forecastData.list.findIndex(item => {

        const hour =
        Number(item.dt_txt.split(" ")[1].slice(0,2));

        return hour > currentHour;

    });

    const next8Hours =
    forecastData.list.slice(
        startIndex,
        startIndex + 8
    );

    const highestTempObj =
    next8Hours.reduce((a,b)=>
        a.main.temp > b.main.temp ? a : b
    );

    const highestRainObj =
    next8Hours.reduce((a,b)=>
        (a.pop || 0) > (b.pop || 0) ? a : b
    );

    const highestTemp =
    Math.round(highestTempObj.main.temp);

    const lowestTempObj =
    next8Hours.reduce((a,b)=>
        a.main.temp < b.main.temp ? a : b
    );

    const lowestTemp =
    Math.round(lowestTempObj.main.temp);

    const highestRain =
    Math.round((highestRainObj.pop || 0) * 100);

    const highestTime =
    new Date(
        `2000-01-01 ${
            highestTempObj.dt_txt
            .split(" ")[1]
            .slice(0,5)
        }`
    ).toLocaleTimeString([],{
        hour:"numeric",
        minute:"2-digit",
        hour12:true
    });

    const highestRainTime =
    new Date(
        `2000-01-01 ${
            highestRainObj.dt_txt
            .split(" ")[1]
            .slice(0,5)
        }`
    ).toLocaleTimeString([],{
        hour:"numeric",
        minute:"2-digit",
        hour12:true
    });

    const bestTimeObj =
    [...next8Hours]
    .filter(hour => (hour.pop || 0) < 0.2)
    .sort((a,b)=> b.main.temp - a.main.temp)[0]
    || next8Hours[0];

    const bestTime =
    new Date(
        `2000-01-01 ${
            bestTimeObj.dt_txt
            .split(" ")[1]
            .slice(0,5)
        }`
    ).toLocaleTimeString([],{
        hour:"numeric",
        minute:"2-digit",
        hour12:true
    });

    let rainMessage = "";

if(highestRain >= 60){
    rainMessage =
    `☔ Keep an umbrella nearby today.`;
}
else if(highestRain >= 30){
    rainMessage =
    `🌦 A brief shower is possible later today.`;
}
else{
    rainMessage =
    `☀ No significant rain expected.`;
}

    document.querySelector(
        "#hourly-modal h2"
    ).textContent =
    "Today & Tonight";

    document.getElementById(
    "hourly-insights"
).innerHTML = `
    <p>🌡 Today's peak temperature: ${highestTime} (${highestTemp}°C)</p>
    <p>🌙 Sunset: ${sunset.textContent}</p>
    <p>🌃 Tonight's low: ${lowestTemp}°C</p>
`;

    document.getElementById(
        "hourly-tip"
    ).innerHTML = `
        🌤 Best time for a walk: ${bestTime}

        <br>

        ${rainMessage}
    `;

    drawHourlyGraph(next8Hours);

    hourlyModal.classList.add("show");
    document.body.classList.add("modal-open");

});
document.addEventListener("keydown", (e) => {

    if(e.key === "Escape"){

        hourlyModal.classList.remove("show");
        settingsPanel.classList.remove("open");
        document.body.classList.remove("modal-open");

    }

});

// Save searched cities
function saveRecentSearch(city){

    let searches =
        JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];

    searches = searches.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    searches.unshift(city);

    searches = searches.slice(0,5);

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(searches)
    );

    renderRecentSearches();

}
const todaysMoments = [

{
    title: "☁️ Spot This Today",
    text: "Find a cloud with an unusual shape."
},

{
    title: "☁️ Spot This Today",
    text: "Look for the darkest cloud in the sky."
},

{
    title: "☁️ Spot This Today",
    text: "See if you can spot a bird gliding without flapping."
},

{
    title: "☁️ Spot This Today",
    text: "Notice how many different cloud types you can find."
},

{
    title: "🌅 Tiny Moment",
    text: "Watch the sunset for one minute."
},

{
    title: "🌅 Tiny Moment",
    text: "Spend 30 seconds looking up at the sky."
},

{
    title: "🌅 Tiny Moment",
    text: "Pause and notice the colours around you."
},

{
    title: "🌅 Tiny Moment",
    text: "Watch the movement of shadows for a moment."
},

{
    title: "🌙 Tonight",
    text: "Look for the first visible star."
},

{
    title: "🌙 Tonight",
    text: "See if the Moon is visible tonight."
},

{
    title: "🌙 Tonight",
    text: "Look outside for a minute before bed."
},

{
    title: "🌙 Tonight",
    text: "Notice how different the sky feels after sunset."
},

{
    title: "🍃 Notice This",
    text: "Listen to the sound of the wind for a moment."
},

{
    title: "🍃 Notice This",
    text: "Notice how trees move differently in the breeze."
},

{
    title: "🍃 Notice This",
    text: "Watch leaves move for a few seconds."
},

{
    title: "🍃 Notice This",
    text: "Pay attention to the air temperature when you step outside."
},

{
    title: "☁ Spot This Today",
    text: "Find the brightest cloud in the sky."
},

{
    title: "☁ Spot This Today",
    text: "See if any cloud reminds you of an animal."
},

{
    title: "☁ Spot This Today",
    text: "Look for a cloud that seems to be changing shape."
},

{
    title: "☁ Spot This Today",
    text: "Try to find three different shades of blue in the sky."
},

{
    title: "☁ Spot This Today",
    text: "Notice which direction the clouds are moving."
},

{
    title: "☁ Spot This Today",
    text: "Find the smallest cloud you can see."
},

{
    title: "☁ Spot This Today",
    text: "See if the horizon looks different than it did yesterday."
},

{
    title: "🌅 Tiny Moment",
    text: "Take one deep breath while looking outside."
},

{
    title: "🌅 Tiny Moment",
    text: "Watch the sky without checking your phone for a minute."
},

{
    title: "🌅 Tiny Moment",
    text: "Notice the brightest colour around you."
},

{
    title: "🌅 Tiny Moment",
    text: "Pause and appreciate today's weather, whatever it is."
},

{
    title: "🌅 Tiny Moment",
    text: "Look out a window for 30 seconds."
},

{
    title: "🌅 Tiny Moment",
    text: "Notice where the sunlight falls today."
},

{
    title: "🌅 Tiny Moment",
    text: "Spend a moment enjoying fresh air."
},

{
    title: "🌅 Tiny Moment",
    text: "Watch how light reflects off nearby surfaces."
},

{
    title: "🌅 Tiny Moment",
    text: "Notice one thing outside you've never paid attention to."
},

{
    title: "🌙 Tonight",
    text: "Look for the brightest object in tonight's sky."
},

{
    title: "🌙 Tonight",
    text: "See how the night sky changes compared to sunset."
},

{
    title: "🌙 Tonight",
    text: "Step outside and look up for a moment."
},

{
    title: "🌙 Tonight",
    text: "See if you can spot a planet tonight."
},

{
    title: "🌙 Tonight",
    text: "Notice whether the moon appears high or low."
},

{
    title: "🌙 Tonight",
    text: "Compare tonight's sky to yesterday's."
},

{
    title: "🌙 Tonight",
    text: "Take a moment to enjoy the quiet of the evening."
},

{
    title: "🌙 Tonight",
    text: "Look for a gap between the clouds."
},

{
    title: "🍃 Notice This",
    text: "Notice how the air feels on your skin."
},

{
    title: "🍃 Notice This",
    text: "Listen for sounds coming from outside."
},

{
    title: "🍃 Notice This",
    text: "Notice whether the breeze feels warm or cool."
},

{
    title: "🍃 Notice This",
    text: "Watch how trees react to the wind."
},

{
    title: "🍃 Notice This",
    text: "Notice if the air feels dry or humid."
},

{
    title: "🍃 Notice This",
    text: "Pay attention to the scent of the air outside."
},

{
    title: "🍃 Notice This",
    text: "Watch how shadows change during the day."
},

{
    title: "🍃 Notice This",
    text: "Notice how different surfaces reflect light."
},

{
    title: "🍃 Notice This",
    text: "Look at the sky and guess tomorrow's weather."
}

];

let lastMoment = "";

function updateTodaysMoment(){

    let randomMoment;

    do{
        randomMoment =
        todaysMoments[Math.floor(Math.random() * todaysMoments.length)];
    }
    while(randomMoment.text === lastMoment);

    lastMoment = randomMoment.text;

    document.getElementById("moment-title").textContent =
    randomMoment.title;

    document.getElementById("moment-text").textContent =
    randomMoment.text;
}
function updateDidYouKnow(){

    const facts = [

"🌧 The smell after rain has a name: petrichor.",

"⚡️ A lightning bolt is hotter than the surface of the Sun.",

"🌈 Every person sees their own unique rainbow.",

"☁️ Some clouds weigh more than 100 elephants.",

"🌙 The Moon affects ocean tides even though it's 384,400 km away.",

"🌧 Rain doesn't start as drops — it starts as tiny ice crystals or water droplets.",

"⚡️ Thunder can only be heard if you're within about 25 km of lightning.",

"🌪 A tornado can pull a straw straight into a tree trunk.",

"🌫 Fog is made of the same stuff as clouds.",

"🌈 You can never reach the end of a rainbow.",

"☁️ Clouds look light and fluffy, but a large one can weigh millions of kilograms.",

"⚡️ Lightning strikes Earth about 8 million times every day.",

"🌧 The wettest place on Earth is in India.",

"☀️ The sunlight hitting Earth right now left the Sun about 8 minutes ago.",

"🌊 Hurricanes weaken rapidly when they move away from warm oceans.",

"🌙 A full moon doesn't actually become brighter — it just reflects more sunlight toward us.",

"🌈 Double rainbows happen when sunlight bounces twice inside raindrops.",

"❄️ Snowflakes can take up to an hour to fall from a cloud.",

"🌪 Some tornadoes can spin faster than 450 km/h.",

"⚡️ You can see lightning before hearing thunder because light travels much faster than sound.",

"☁️ Clouds can travel over 160 km/h high in the atmosphere.",

"⚡️ Lightning can strike the same place hundreds of times.",

"❄️ Not all snowflakes have six perfect arms.",

"🌈 Rainbows are actually full circles — we usually only see half.",

"⚡️ A single lightning bolt can power a 100-watt bulb for months.",

"🌫 Fog can form even when there are no clouds in the sky.",

"☀️ The Sun loses about 4 million tons of mass every second.",

"🌊 Ocean waves can travel thousands of kilometres across the planet.",

"🌪 Some tornadoes glow blue or green at night.",

"❄️ Antarctica is technically the world's largest desert.",

"⚡️ Lightning can occur inside volcanic eruptions.",

"🌈 Moonbows are rainbows created by moonlight instead of sunlight.",

"☁️ Mammatus clouds look like giant pouches hanging from the sky.",

"🌫 Some fogs are so dense that visibility drops below one metre.",

"⚡️ A bolt of lightning is only a few centimetres wide.",

"🌩 Lightning can travel upward from the ground into the sky.",

"🌈 At night, rainbows can appear from moonlight. They're called moonbows.",

"☁️ Some clouds can stretch across several countries at once.",

"🌪 Tornadoes have been recorded on every continent except Antarctica.",

"☁️ Clouds don't float because they're light — they float for the same reason ships float on water.",

"🌩 Lightning can strike the same place hundreds of times a year.",

"🌈 Sometimes you can see a double rainbow where the colors of the second rainbow are reversed.",

"⚡️ Every thunderstorm produces lightning, but not every lightning bolt reaches the ground.",

"☁️ The highest clouds form so high up that they're made almost entirely of ice crystals.",

"🌫 You can walk through a cloud if you're high enough in the mountains.",

"⚡️ The air around a lightning bolt can become five times hotter than the Sun's surface.",

"🌈 Pilots sometimes see complete circular rainbows from airplanes.",

"☁️ A cloud's shadow can cool the ground by several degrees in minutes.",

"⚡️ Volcanic eruptions can create their own lightning storms.",

"❄️ Snow is actually a good insulator and helps keep the ground warm underneath.",

"🌪 Some tornadoes are invisible until they pick up dust and debris.",

"🌫 Fog can freeze instantly onto surfaces, creating icy landscapes.",

"🌩 Thunder is simply the sound of air exploding outward after lightning heats it.",

"☁️ Contrails behind airplanes can sometimes become real clouds."

];
let recentFacts = [];
function updateDidYouKnow(){

    const facts = [
        // all your facts
    ];

    let randomFact;

    do{

        randomFact =
        facts[Math.floor(Math.random() * facts.length)];

    }
    while(recentFacts.includes(randomFact));

    recentFacts.push(randomFact);

    if(recentFacts.length > 10){

        recentFacts.shift();

    }

    document.getElementById(
        "weather-fact"
    ).innerHTML = randomFact;
}

    const randomFact =
    facts[Math.floor(Math.random() * facts.length)];

    document.getElementById(
        "weather-fact"
    ).innerHTML =
    ` ${randomFact}`;
}
function startThunder(){

    const flash =
    document.querySelector(".thunder-flash");

    if(!flash) return;

    setInterval(()=>{

        flash.style.animation = "none";
        flash.offsetHeight;

        flash.style.animation =
        "thunderPulse 0.4s ease";

    },3000 + Math.random()*4000);

}

function renderRecentSearches(){

    const container =
        document.getElementById(
            "recent-search-chips"
        );

    const searches =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];

    container.innerHTML = "";

    searches.forEach(city => {

        container.innerHTML += `
<div class="search-chip">

    <span
        class="chip-city"
        data-city="${city}">
        ${city}
    </span>

    <span
        class="chip-delete"
        data-city="${city}">
        ✕
    </span>

</div>
`;
    });

    document
.querySelectorAll(".chip-city")
.forEach(chip => {

    chip.addEventListener("click", () => {

        getWeather(
            chip.dataset.city
        );

    });

});
document
.querySelectorAll(".chip-delete")
.forEach(btn => {

    btn.addEventListener("click", () => {

        let searches =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];

        searches =
        searches.filter(
            city =>
            city !== btn.dataset.city
        );

        localStorage.setItem(
            "recentSearches",
            JSON.stringify(searches)
        );

        renderRecentSearches();

    });

});

}

renderRecentSearches();
getCurrentLocationWeather();

setInterval(() => {

    updateDateTime(currentTimezoneOffset);

}, 1000);

// Update weather marker
function updateMap(
    lat,
    lon,
    city,
    temp,
    condition
){

    if(marker){
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon])
        .addTo(map);

    marker.bindPopup(`
        <b>${city}</b><br>
        🌡️ ${temp}°C<br>
        ${condition}
    `);
    marker.openPopup();

    map.invalidateSize();
    map.flyTo([lat, lon], 8);
}

// Settings
const settingsBtn =
document.getElementById("settings-btn");

const settingsPanel =
document.getElementById("settings-modal");

const closeSettings =
document.getElementById("close-settings");

settingsBtn.addEventListener("click",()=>{

    settingsPanel.classList.add("open");
    document.body.classList.add("modal-open");

});

closeSettings.addEventListener("click",()=>{

    settingsPanel.classList.remove("open");
    document.body.classList.remove("modal-open");

});

settingsPanel.addEventListener("click", (e) => {
    if (e.target === settingsPanel) {
        settingsPanel.classList.remove("open");
        document.body.classList.remove("modal-open");
    }
});

const landingBtn = document.getElementById("landing-btn");
const dashboardBtn = document.getElementById("dashboard-btn");

if (landingBtn) {
    landingBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

if (dashboardBtn) {
    dashboardBtn.addEventListener("click", () => {
        settingsPanel.classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function applyCardConditionTint(condition) {
    const card = document.querySelector(".weather-card");
    if (!card) return;

    // Remove all existing condition classes
    card.classList.remove(
        "cond-clear", "cond-cloud", "cond-rain", "cond-thunder", "cond-snow"
    );

    if (condition.includes("clear"))       card.classList.add("cond-clear");
    else if (condition.includes("cloud"))  card.classList.add("cond-cloud");
    else if (condition.includes("thunder"))card.classList.add("cond-thunder");
    else if (condition.includes("rain") ||
             condition.includes("drizzle"))card.classList.add("cond-rain");
    else if (condition.includes("snow"))   card.classList.add("cond-snow");
}

function updateWeatherStatusChip(condition, humidity, visibilityMetres) {
    const chip = document.getElementById("weather-status-chip");
    if (!chip) return;

    let label = "";
    let icon  = "fa-circle-dot";

    const visKm = (visibilityMetres || 0) / 1000;

    if (condition.includes("thunderstorm")) {
        label = "Stormy Conditions";
        icon  = "fa-bolt";
    } else if (condition.includes("snow")) {
        label = "Snowy Conditions";
        icon  = "fa-snowflake";
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
        label = "Wet Conditions";
        icon  = "fa-droplet";
    } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
        label = "Low Visibility";
        icon  = "fa-eye-slash";
    } else if (condition.includes("clear")) {
        label = "Clear Skies";
        icon  = "fa-sun";
    } else if (condition.includes("cloud")) {
        label = humidity > 75 ? "Humid & Cloudy" : "Comfortable Conditions";
        icon  = "fa-cloud";
    } else if (humidity > 80) {
        label = "High Humidity";
        icon  = "fa-temperature-high";
    } else if (visKm >= 8) {
        label = "Good Visibility";
        icon  = "fa-eye";
    } else {
        label = "Moderate Conditions";
        icon  = "fa-wind";
    }

    chip.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
    chip.style.display = "inline-flex";
}

function applyBodyAtmosphere(condition, isNight) {
    document.body.classList.remove(
        "atmos-clear-day", "atmos-clear-night",
        "atmos-cloud", "atmos-rain",
        "atmos-snow", "atmos-storm"
    );

    if (condition.includes("thunderstorm")) {
        document.body.classList.add("atmos-storm");
    } else if (condition.includes("snow")) {
        document.body.classList.add("atmos-snow");
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
        document.body.classList.add("atmos-rain");
    } else if (condition.includes("cloud") ||
               condition.includes("mist")  ||
               condition.includes("fog")   ||
               condition.includes("haze")) {
        document.body.classList.add("atmos-cloud");
    } else if (condition.includes("clear")) {
        document.body.classList.add(isNight ? "atmos-clear-night" : "atmos-clear-day");
    }
}

// Search suggestion
(function () {

    const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
    const MAX_SUGGESTIONS = 5;
    const DEBOUNCE_MS     = 300;

    const input    = document.getElementById("city-input");
    const dropdown = document.getElementById("autocomplete-dropdown");

    let debounceTimer   = null;
    let activeIndex     = -1;   // keyboard-highlighted row
    let currentQuery    = "";   // last query sent to API
    let inflightQuery   = null; // abort-controller target
    const cache         = {};   // query → results array

    function openDropdown()  { dropdown.classList.add("ac-open"); }
    function closeDropdown() {
        dropdown.classList.remove("ac-open");
        activeIndex = -1;
    }

    function buildLabel(item) {
        const parts = [item.name];
        if (item.state)   parts.push(item.state);
        if (item.country) parts.push(item.country);
        return parts.join(", ");
    }

    function highlight(idx) {
        const items = dropdown.querySelectorAll(".ac-item");
        items.forEach((el, i) => el.classList.toggle("ac-active", i === idx));
        activeIndex = idx;
    }

    function selectItem(label) {
        input.value = label;
        closeDropdown();
        searchBtn.click();
    }

    function renderResults(results) {
        dropdown.innerHTML = "";

        if (!results || results.length === 0) {
            dropdown.innerHTML = `<div class="ac-empty">No matching cities</div>`;
            openDropdown();
            return;
        }

        results.forEach((item, i) => {
            const label    = buildLabel(item);
            const cityText = item.name;
            const regionParts = [];
            if (item.state)   regionParts.push(item.state);
            if (item.country) regionParts.push(item.country);
            const regionText = regionParts.join(", ");

            const el = document.createElement("div");
            el.className   = "ac-item";
            el.role        = "option";
            el.setAttribute("aria-selected", "false");
            el.innerHTML   = `
                <i class="fas fa-location-dot"></i>
                <div class="ac-item-text">
                    <span class="ac-city">${cityText}</span>
                    ${regionText ? `<span class="ac-region">${regionText}</span>` : ""}
                </div>`;

            el.addEventListener("mousedown", (e) => {
                e.preventDefault();
                selectItem(label);
            });

            el.addEventListener("mousemove", () => highlight(i));

            dropdown.appendChild(el);
        });

        activeIndex = -1;
        openDropdown();
    }

    async function fetchSuggestions(query) {
        /* cache hit */
        const key = query.toLowerCase().trim();
        if (cache[key] !== undefined) {
            renderResults(cache[key]);
            return;
        }

        if (inflightQuery && inflightQuery !== key) {
        }
        inflightQuery = key;

        try {
            const url = `${GEO_URL}?q=${encodeURIComponent(query)}&limit=${MAX_SUGGESTIONS}&appid=${API_KEY}`;
            const res  = await fetch(url);
            if (!res.ok) throw new Error("geo api error");
            const data = await res.json();

            if (inflightQuery !== key) return;

            cache[key] = data;
            renderResults(data);
        } catch (_) {
        } finally {
            if (inflightQuery === key) inflightQuery = null;
        }
    }

    input.addEventListener("input", () => {
        const query = input.value.trim();

        clearTimeout(debounceTimer);

        if (query.length < 2) {
            closeDropdown();
            dropdown.innerHTML = "";
            return;
        }

        if (query === currentQuery) return;
        currentQuery = query;

        debounceTimer = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS);
    });

    input.addEventListener("keydown", (e) => {
        const items = dropdown.querySelectorAll(".ac-item");
        const isOpen = dropdown.classList.contains("ac-open");

        if (e.key === "ArrowDown") {
            if (!isOpen) return;
            e.preventDefault();
            highlight(Math.min(activeIndex + 1, items.length - 1));

        } else if (e.key === "ArrowUp") {
            if (!isOpen) return;
            e.preventDefault();
            highlight(Math.max(activeIndex - 1, -1));
            if (activeIndex === -1) {
                items.forEach(el => el.classList.remove("ac-active"));
            }

        } else if (e.key === "Enter") {
            if (isOpen && activeIndex >= 0 && items[activeIndex]) {
                e.preventDefault();
                const cityEl  = items[activeIndex].querySelector(".ac-city");
                const regionEl = items[activeIndex].querySelector(".ac-region");
                const parts = [cityEl ? cityEl.textContent : ""];
                if (regionEl) parts.push(regionEl.textContent);
                selectItem(parts.join(", "));
            }

        } else if (e.key === "Escape") {
            closeDropdown();
        }
    });

    document.addEventListener("click", (e) => {
        if (!document.getElementById("search-input-wrap").contains(e.target)) {
            closeDropdown();
        }
    });
    searchBtn.addEventListener("click", () => closeDropdown());

}());
