// Global variables
var currentCityHeaderEl = document.querySelector("#current-city-header");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var cityFormEl = document.querySelector("#city-search");

// Fetch weather data
var getWeatherData = function(city) {
    // If there is no current city, initiate for the best place ever
    if(!city) {
        city = "asheville";
    }

    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=7fc21c7de7016c8d72a7a8f065f6d9c4";

    // Use first fetch to get latitude and longitude of user-input city
    fetch(apiURL)
    .then(function(forecastResponse) {
        return forecastResponse.json(); 
    })
    .then(function(forecastData) {
        var lat = forecastData.city.coord.lat;
        var lon = forecastData.city.coord.lon;

        // Once we get lat/long, use second fetch to retrieve data from OneCall API
        var onecallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=7fc21c7de7016c8d72a7a8f065f6d9c4"
        return fetch(onecallURL)
    })

    // Response to inner fetch
    .then(function(response) {
        return response.json();
    })
    // Function that provides functionality to build page
    .then(function(data) {
        printCurrentData(data, city);
        printFiveDay(data);
    })

    // Error if bad connection to server
    .catch(function(error) {
        alert("Unable to find the requested city.");
    });
};

// Function to build data in current weather conditions block
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

// Function to build 5 day weather cards
var printFiveDay = function(data) {

    // Clear the current data
    fiveDayContainerEl.innerHTML = "";

    // Loop through each day
    for(var i = 0; i < 5; i++) {
        buildCard(data.daily[i]);
    }
};

// Helper method to build a single card and add to container
var buildCard = function(data) {

    // Get appropriate data
    var date = convertDate(data.dt);
    var iconImgEl = getIcon(data.weather[0].icon, data.weather[0].description);
    var temp = data.temp.day;
    var humidity = data.humidity;

    // Build card in DOM
    var cardEl = document.createElement("div");
    cardEl.classList = "col card text-white bg-primary p-3 m-1";

    // Build elements inside the card in DOM
    var titleEl = document.createElement("h4");
    titleEl.classList = "card-title";
    titleEl.textContent = date;
    iconImgEl.classList = "w-50 h-auto";
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + " °F"; 
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";

    // Add elements to card container, then add card to 5 day container
    cardEl.appendChild(titleEl);
    cardEl.appendChild(iconImgEl);
    cardEl.appendChild(tempEl);
    cardEl.appendChild(humidityEl);
    fiveDayContainerEl.appendChild(cardEl);
}

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

// Submit the form
var formSubmitHandler = function(event) {
    event.preventDefault();
    cityInputEl = document.querySelector("#city")
    var city = cityInputEl.value.trim();

    if(city) {
        getWeatherData(city);
        cityInputEl.value = "";
    }
    else {
        alert("You must enter a city.");
    }
}

// getWeatherData("");
cityFormEl.addEventListener("submit", formSubmitHandler);