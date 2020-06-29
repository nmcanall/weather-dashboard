// Global variables
var currentCityHeaderEl = document.querySelector("#current-city-header");

// Fetch weather data
var getWeatherData = function(city) {
    // If there is no current city, initiate for the best place ever
    if(!city) {
        city = "asheville";
    }

    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=7fc21c7de7016c8d72a7a8f065f6d9c4";

    // Use first fetch to get latitude and longitude of user-input city
    fetch(apiURL).then(function(forecastResponse) {
        return forecastResponse.json(); 
    })
    .then(function(forecastData) {
        var lat = forecastData.city.coord.lat;
        var lon = forecastData.city.coord.lon;

        // Once we get lat/long, use second fetch to retrieve data from OneCall API
        var onecallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=7fc21c7de7016c8d72a7a8f065f6d9c4"
        return fetch(onecallURL)
    })
    .then(function(response) {
        return response.json();
    })

    // Function that provides functionality to build page
    .then(function(data) {
        printCurrentData(data, city);
    })

    // Error if bad connection to server
    // .catch(function(error) {
    //     alert("Unable to connect to OpenWeather");
    // });
};

var printCurrentData = function(data, city) {

    // Update the current city data header
    var iconImgEl = getIcon(data.current.weather[0].icon, data.current.weather[0].description);
    var date = convertDate(data.current.dt);
    currentCityHeaderEl.textContent = city + " (" + date + ") ";
    currentCityHeaderEl.appendChild(iconImgEl);

    // Get current stats
    var temp = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;

    // Update current stats on screen (span elements available in HTML)
    document.querySelector("#temperature").textContent = temp;
    document.querySelector("#humidity").textContent = humidity;
    document.querySelector("#wind-speed").textContent = windSpeed;
    var uvIndexEl = document.querySelector("#uv-index");

    // Set data for UV Index
    uvIndexEl.textContent = uvIndex;
    if(uvIndex > 11) {
        uvIndexEl.classList = "bg-dark text-white p-2";
    }
    else if(uvIndex > 8) {
        uvIndexEl.classList = "bg-danger text-white p-2";
    }
    else if(uvIndex > 4) {
        uvIndexEl.classList = "bg-warning p-2";
    }
    else {
        uvIndexEl.classList = "bg-success text-white p-2";
    }
};

var printFiveDay = function(data) {

};

// Helper method to get the weather icon
var getIcon = function(iconCode, description) {
    var iconImg = document.createElement("img");
    iconImg.setAttribute("src", "http://openweathermap.org/img/wn/" + iconCode + ".png")
    iconImg.setAttribute("alt", description)
    return iconImg;
}

// Helper method to format date
var convertDate = function(longDate) {
    var date = new Date(longDate * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // get month returns month 0-11
    var day = date.getDate();
    return month + "/" + day + "/" + year;
}

getWeatherData("");