var cityInputEl = document.getElementById('search-city');
var searchForm = document.getElementById('search-form');
var previousCitiesEl = document.getElementById('search-history');
var currentWeather = document.getElementById('current-weather');
var fiveDayForecast = document.getElementById('five-day-forecast');
var searchHistory = [];

function citySearch(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    displayWeather(cityName);
}

function displayWeather(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=3903d41c6be2ee04c5706d1ebf8f25b6&units=imperial`;
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=3903d41c6be2ee04c5706d1ebf8f25b6&units=imperial`;
        fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (fiveData) {
            if (searchHistory.includes(data.name) === false) {
                searchHistory.push(data.name);
                localStorage.setItem("city", JSON.stringify(searchHistory));
            }
            displayCity();
            currentWeather.innerHTML = `<ul>
            <li class="title">${data.name}<span>${dayjs(data.dt_txt).format('MM/DD/YYYY')}</span></li>
            <li><img src ="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></li>
            <li>Temp: ${data.main.temp}</li>
            <li>Wind: ${data.wind.speed}</li>
            <li>Humidity: ${data.main.humidity}</li>
            </ul>`;
            var cards = "";
            for (var i = 0; i < fiveData.list.length; i += 8) {
                cards = cards +
                `<ul class="col-12 col-xl-2 day">
                <li>${dayjs(fiveData.list[i].dt_txt).format('MM/DD/YYYY')}</li>
                <li><img src ="http://openweathermap.org/img/wn/${fiveData.list[i].weather[0].icon}@2x.png" /></li>
                <li>Temp: ${fiveData.list[i].main.temp}</li>
                <li>Wind: ${fiveData.list[i].wind.speed}</li>
                <li>Humidity: ${fiveData.list[i].main.humidity}</li>
                </ul>`
            }
            fiveDayForecast.innerHTML = cards;
        });
    });
}

function displayCity() {
    if (localStorage.getItem("city")) {
        searchHistory = JSON.parse(localStorage.getItem("city"));
    }
    var cityList = "";
    for (var i = 0; i < searchHistory.length; i++) {
        cityList =
            cityList +
            `<button class="btn btn-secondary my-3" type="submit">${searchHistory[i]}</button>`;
    }
    previousCitiesEl.innerHTML = cityList;
    var historyCities = document.querySelectorAll(".my-3");
    for (var i = 0; i < historyCities.length; i++) {
        historyCities[i].addEventListener("click", function () {
            displayWeather(this.textContent);
        });
    }
}
displayCity();

searchForm.addEventListener("submit", citySearch); 