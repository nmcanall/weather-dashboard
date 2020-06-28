// Global variables
var currentCityHeaderEl = document.querySelector("#current-city-header");

// Fetch weather data
var getWeatherData = function(city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=7fc21c7de7016c8d72a7a8f065f6d9c4";

    fetch(apiURL).then(function(response) {

        // Check if good URL
        if(response.ok) {
            response.json().then(function(data) {
                printCurrentData(data);
                printFiveDay(data);
            });
        }

        // Display error if the URL is bad (city not found)
        else {
            alert("Error: " + response.statusText);
        }
    })

    // Error if bad connection to server
    .catch(function(error) {
        alert("Unable to connect to OpenWeather");
    });
};

var printCurrentData = function(data) {

    // Update the current city data header
    var city = data.city.name;
    var iconImgEl = getIcon(data.list[0].weather[0].icon, data.list[0].weather[0].description);
    var date = convertDate(data.list[0].dt_txt);
    currentCityHeaderEl.textContent = city + " (" + date + ") ";
    currentCityHeaderEl.appendChild(iconImgEl);
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

// Helper method to format date without adding moment.js
var convertDate = function(longDate) {
    var shortDate = longDate.split(" ")
    var dateArray = shortDate[0].split("-");
    return (dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0]);
}

getWeatherData("Laguna Hills");