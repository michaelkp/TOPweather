import { format } from 'date-fns'
console.log("hi");
const locationSearchBtn = document.querySelector(".location-search-btn")
  locationSearchBtn.addEventListener('click', () => {
    searchLocation()
  })
  window.addEventListener("keydown", (e) => { 
    if (e.key !== 'Enter') {
      return
    }
    if (e.key === 'Enter') {
      searchLocation()
    }
  })
async function searchLocation() {
  const locationInput = document.querySelector(".location-search")
  console.log(locationInput.value);
  if (locationInput.value === '') {
    return
  }
  // const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput.value}&limit=5&appid=cc99b2d925187d5011797edf8d777b3e`, {mode: 'cors'})
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationInput.value}&count=5&language=en&format=json`, {mode: 'cors'})
  response.json().then((city) => {
    // console.log(response);
    displayList(city)
    // console.log(response[0].lat);
  })
}
// searchLocation()
async function getWeatherInfo(lat, lon, timezone) {
  const weather = await fetch(`https://api.open-meteo.com/v1/gfs?latitude=${ lat }&longitude=${ lon }&timezone=${ timezone }&current=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`)
    weather.json().then((weather => {
      console.log('weather === ', weather);
      displayCurrentWeather(weather.current)
      displayWeatherCard(weather.daily)
    }))
}
function displayList(city) {
  console.log(city);
  const cityList = document.querySelector(".display-city-list")
  console.log(cityList);
  city.results.forEach(city => {
    cityList.classList.remove("hidden")
    cityList.classList.add('visible')
    const listItem = document.createElement("li")
    listItem.textContent = `${city.name}, ${city.admin1}, ${city.country}`
    cityList.appendChild(listItem)
    makeButton(city, listItem)
  })
}
function makeButton(city, listItem) {
  console.log(listItem);
  listItem.addEventListener("click", () => {
    console.log(city);
    console.log(city.latitude, ' ', city.longitude);
    getWeatherInfo(city.latitude, city.longitude, city.timezone)
  })
}
function displayCurrentWeather(currentWeather) {
  // console.log(currentWeather.values());
  const currentWeatherArticle = document.querySelector(".current-weather")
  const currentWeatherHeader = document.querySelector(".current-weather-header")
  console.log(currentWeatherHeader);
  const displayCurrentTime = document.querySelector(".current-time-text")
  const currentWeatherSection = document.querySelector('.current-weather-section')
  console.log(currentWeatherSection);
  console.log(displayCurrentTime);
  const date = format(new Date(), 'PPPpp')
  console.log(date);
    displayCurrentTime.textContent = date
  for (let [key, value] of Object.entries(currentWeather)) {
    console.log(`${key}: ${value}`);
    if (key === 'interval' || key === 'weather_code' || key === 'time') {
      key = ''
      value = ''
    } else {
      const p = document.createElement("p")
      p.textContent = `${ key }: ${ value }`
      currentWeatherSection.appendChild(p)
    }
  }
}
function makeCard() {
  const template = document.querySelector(".weather-card-template")
  const clone = template.content.firstElementChild.cloneNode(true)
  const card = clone.querySelectorAll(".card")
  const append = (data) => {
    console.log(data);
    card.forEach((span, i) => {
      console.log(span);
      console.log(data);
      span.textContent = data[i]
    })
    const forecastSection = document.querySelector(".forecast-cards")
    forecastSection.appendChild(clone)
  }
  return { clone, card, append }
}
function displayWeatherCard(weather) {
  const weatherForecast = Object.values(weather)//.map((arr, i) => arr[0])
  console.log(weatherForecast);
  let i = 0
  while (i < weatherForecast.length - 1) {
    console.log(i);
    const todaysWeather = weatherForecast.map(arr => arr[i])
    console.log(todaysWeather);
    makeCard().append(todaysWeather)
    i++
  }
  // makeCard().append(weatherForecast)
}
