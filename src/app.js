const cityname = document.querySelector(".weatherInput");
const searchbutton = document.querySelector(".button");
const weatherdetailsdiv = document.querySelector(".weatherdetails");
const weatherimagediv=document.querySelector(".weatherimage")
const currentlocationbutton=document.querySelector(".currlocation")
const apikey = '2138f17a164fd3b4bb4d6e793b3c9f0e';

searchbutton.addEventListener("click", () => {
    let citynamevalue = cityname.value.trim();
    console.log(citynamevalue);

    async function getWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citynamevalue}&appid=${apikey}`);
            const data = await response.json();
            console.log(data);

            weatherdetailsdiv.innerHTML = '';
            weatherimagediv.innerHTML = '';

            // Create elements
            let locationname = document.createElement("h2");
            let temperature = document.createElement("h2");
            let humidity = document.createElement("h2");
            let wind = document.createElement("h2");
            let image = document.createElement("img"); 

            // Assigning values to the elements
            locationname.textContent = `${data.name}`;
            temperature.textContent = `Temperature: ${data.main.temp} °C`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            wind.textContent = `Wind: ${data.wind.speed} m/s`;

            // Set image based on weather condition
            let weatherMain = data.weather[0].main.toLowerCase(); 

            if (weatherMain === "clouds") {
                image.src = "./assets/cloudy.png";
                
            } else if (weatherMain === "rain") {
                image.src = "./assets/rain.png";
            } else if (weatherMain === "clear") {
                image.src = "./assets/sunny.png"; 
            } else if( weatherMain==="snow"){
                image.src="./assets/snow.png";
            }

            // Adding styles to the elements
            locationname.classList.add("text-2xl", "font-bold", "text-white", "mb-4");
            temperature.classList.add("text-lg", "mb-2", "text-white");
            humidity.classList.add("text-lg", "text-white", "mb-2");
            wind.classList.add("text-lg", "text-white", "mb-2");
            image.classList.add("weather-image", "w-32", "h-32", "mb-4","mr-10"); 

            // Appending the elements to the weatherdetails div
            weatherdetailsdiv.classList.add("ml-10");
            weatherdetailsdiv.appendChild(locationname);
            weatherdetailsdiv.appendChild(temperature);
            weatherdetailsdiv.appendChild(humidity);
            weatherdetailsdiv.appendChild(wind);
            weatherimagediv.appendChild(image);
           
            cityname.value=''
            
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    getWeather();
});


currentlocationbutton.addEventListener("click", () => {
    
    const geolocation = navigator.geolocation;

    
    if (geolocation) {
        geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(position);
                getCurrentPosition(lat, lon);
            },
            error => {
                console.error("Error getting current location:", error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    async function getCurrentPosition(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
            const weatherdata = await response.json();
            console.log(weatherdata);

            weatherdetailsdiv.innerHTML = '';
            weatherimagediv.innerHTML = '';

            // Create elements
            let locationname = document.createElement("h2");
            let temperature = document.createElement("h2");
            let humidity = document.createElement("h2");
            let wind = document.createElement("h2");
            let image = document.createElement("img"); 

            // Assigning values to the elements
            locationname.textContent = `${weatherdata.name}`;
            temperature.textContent = `Temperature: ${weatherdata.main.temp} °C`;
            humidity.textContent = `Humidity: ${weatherdata.main.humidity}%`;
            wind.textContent = `Wind: ${weatherdata.wind.speed} m/s`;

            // Set image based on weather condition
            let weatherMain = weatherdata.weather[0].main.toLowerCase(); 

            if (weatherMain === "clouds") {
                image.src = "./assets/cloudy.png";
                
            } else if (weatherMain === "rain") {
                image.src = "./assets/rain.png";
            } else if (weatherMain === "clear") {
                image.src = "./assets/sunny.png"; 
            } else if( weatherMain==="snow"){
                image.src="./assets/snow.png";
            }

            // Adding styles to the elements
            locationname.classList.add("text-2xl", "font-bold", "text-white", "mb-4");
            temperature.classList.add("text-lg", "mb-2", "text-white");
            humidity.classList.add("text-lg", "text-white", "mb-2");
            wind.classList.add("text-lg", "text-white", "mb-2");
            image.classList.add("weather-image", "w-32", "h-32", "mb-4","mr-10"); 

            // Appending the elements to the weatherdetails div
            weatherdetailsdiv.classList.add("ml-10");
            weatherdetailsdiv.appendChild(locationname);
            weatherdetailsdiv.appendChild(temperature);
            weatherdetailsdiv.appendChild(humidity);
            weatherdetailsdiv.appendChild(wind);
            weatherimagediv.appendChild(image);
            
        } catch (error) {
            console.error("Error fetching weather weatherdata:", error);
        }
    }
});


