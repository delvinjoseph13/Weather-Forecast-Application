const cityname = document.querySelector(".weatherInput");
const searchbutton = document.querySelector(".button");
const weatherdetailsdiv = document.querySelector(".weatherdetails");
const weatherimagediv = document.querySelector(".weatherimage");
const currentlocationbutton = document.querySelector(".currlocation");
const recentcities = document.querySelector("#recentcities");
const apikey = '2138f17a164fd3b4bb4d6e793b3c9f0e';

// Reusable getWeather function
async function getWeather(citynamevalue) {
    if (!citynamevalue) {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${citynamevalue}&appid=${apikey}`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message || "City not found.");
            return;
        }
        storerecentcity(citynamevalue);
        displayWeather(data);
        cityname.value = '';
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// searchbutton.addEventListener("click", () => {
//     const citynamevalue = cityname.value.trim();
//     getWeather(citynamevalue);
// });

// Store recently searched city in localStorage
function storerecentcity(cityname) {
    let cities = JSON.parse(localStorage.getItem("recentcities")) || [];
    if (!cities.includes(cityname)) {
        cities.push(cityname);
        localStorage.setItem("recentcities", JSON.stringify(cities));
        updatedropdown();
    }
}

// Update dropdown with recently searched cities
function updatedropdown() {
    const cities = JSON.parse(localStorage.getItem("recentcities")) || [];
    recentcities.innerHTML = '<option value="" disabled selected>Choose a city</option>';
    cities.forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentcities.append(option);
    });
    recentcities.classList.remove("hidden");
}

// Fetch weather for selected city from dropdown
recentcities.addEventListener("change", () => {
    const selectedCity = recentcities.value;
    if (selectedCity) {
        getWeather(selectedCity);
        getForecast(selectedCity); 
    }
});

// Fetch weather for current location
currentlocationbutton.addEventListener("click", () => {
    const geolocation = navigator.geolocation;

    if (geolocation) {
        geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getCurrentPosition(lat, lon);
            },
            (error) => {
                console.error("Error getting current location:", error.message);
                alert(
                    "Unable to fetch location. Please ensure location services are enabled and permissions are granted."
                );
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    async function getCurrentPosition(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`
            );
            const weatherdata = await response.json();

            if (weatherdata.cod !== 200) {
                alert(weatherdata.message || "Unable to fetch weather data.");
                return;
            }

            displayWeather(weatherdata);
            getForecast(weatherdata.name); 
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }
});

// Display weather data
function displayWeather(data) {
    weatherdetailsdiv.innerHTML = '';
    weatherimagediv.innerHTML = '';

    // Create elements
    const locationname = document.createElement("h2");
    const temperature = document.createElement("h2");
    const humidity = document.createElement("h2");
    const wind = document.createElement("h2");
    const image = document.createElement("img");

    // Assigning values to the elements
    locationname.textContent = `${data.name}`;
    temperature.textContent = `Temperature: ${(data.main.temp - 273.15).toFixed(2)} °C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed} m/s`;

    const weatherMain = data.weather[0].main.toLowerCase();
    if (weatherMain === "clouds") {
        image.src = "./assets/cloudy.png";
    } else if (weatherMain === "rain") {
        image.src = "./assets/rain.png";
    } else if (weatherMain === "clear") {
        image.src = "./assets/sunny.png";
    } else if (weatherMain === "snow") {
        image.src = "./assets/snow.png";
    }

    image.alt = `${data.weather[0].description}`;

    // Adding styles to the elements
    locationname.classList.add("text-2xl", "font-bold", "text-white","mt-1");
    temperature.classList.add("text-lg", "mb-2", "text-white");
    humidity.classList.add("text-lg", "text-white", "mb-2");
    wind.classList.add("text-lg", "text-white", "mb-2");
    image.classList.add("weather-image", "w-32", "h-32", "mb-4", "mr-10");

    // Append elements
    weatherdetailsdiv.classList.add("ml-10");
    weatherdetailsdiv.appendChild(locationname);
    weatherdetailsdiv.appendChild(temperature);
    weatherdetailsdiv.appendChild(humidity);
    weatherdetailsdiv.appendChild(wind);
    weatherimagediv.appendChild(image);
}



async function getForecast(cityName) {
    const apiKey = `2138f17a164fd3b4bb4d6e793b3c9f0e`;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod !== "200") {
            alert(data.message || "Unable to fetch forecast data.");
            return;
        }
        
        displayForecast(data);
    } catch (error) {
        console.error("Error fetching the forecast API:", error);
        alert("Error fetching the forecast API");
    }
}

function displayForecast(data) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ''; // Clear previous forecast data

    const groupedForecasts = groupByDay(data.list);

    groupedForecasts.forEach((day) => {
        const card = document.createElement("div");
        card.classList.add(
            "forecast-card",
            "p-4",
            "bg-gray-800",
            "text-white",
            "rounded-lg",
            "m-2",
            "flex",
            "flex-col",
            "items-center"
        );

        const date = document.createElement("h3");
        date.textContent = day.date;
        date.classList.add("font-bold", "text-lg", "mb-2");

        const icon = document.createElement("img");
        icon.src = getWeatherIcon(day.weatherMain);
        icon.alt = day.weatherDescription;
        icon.classList.add("w-16", "h-16", "mb-2");

        const temp = document.createElement("p");
        temp.textContent = `Temp: ${(day.avgTemp - 273.15).toFixed(2)} °C`;

        const wind = document.createElement("p");
        wind.textContent = `Wind: ${day.avgWind.toFixed(1)} m/s`;

        const humidity = document.createElement("p");
        humidity.textContent = `Humidity: ${day.avgHumidity}%`;

        card.appendChild(date);
        card.appendChild(icon);
        card.appendChild(temp);
        card.appendChild(wind);
        card.appendChild(humidity);

        forecastContainer.appendChild(card);
    });
}

function groupByDay(list) {
    const days = {};

    list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        });

        if (!days[date]) {
            days[date] = {
                date: date,
                weatherMain: item.weather[0].main.toLowerCase(),
                weatherDescription: item.weather[0].description,
                avgTemp: 0,
                avgWind: 0,
                avgHumidity: 0,
                count: 0,
            };
        }

        days[date].avgTemp += item.main.temp;
        days[date].avgWind += item.wind.speed;
        days[date].avgHumidity += item.main.humidity;
        days[date].count += 1;
    });

    return Object.values(days).map((day) => ({
        date: day.date,
        weatherMain: day.weatherMain,
        weatherDescription: day.weatherDescription,
        avgTemp: day.avgTemp / day.count,
        avgWind: day.avgWind / day.count,
        avgHumidity: day.avgHumidity / day.count,
    }));
}

function getWeatherIcon(mainWeather) {
    if (mainWeather === "clouds") return "./assets/cloudy.png";
    if (mainWeather === "rain") return "./assets/rain.png";
    if (mainWeather === "clear") return "./assets/sunny.png";
    if (mainWeather === "snow") return "./assets/snow.png";
    return "./assets/default.png";
}


searchbutton.addEventListener("click", () => {
    const citynamevalue = cityname.value.trim();
    if (citynamevalue) {
        getWeather(citynamevalue);
        getForecast(citynamevalue);
    }
});

