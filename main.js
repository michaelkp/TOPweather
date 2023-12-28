import { format } from 'date-fns'
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
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationInput.value}&count=5&language=en&format=json`, {mode: 'cors'})
  response.json().then((city) => {
    displayList(city)
  })
}
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
  listItem.addEventListener("click", () => {
    getWeatherInfo(city.latitude, city.longitude, city.timezone)
  })
}
function displayCurrentWeather(currentWeather) {
  const displayCurrentTime = document.querySelector(".current-time-text")
  const currentWeatherSection = document.querySelector('.current-weather-section')
  const date = format(new Date(), 'PPPpp')
    displayCurrentTime.textContent = date
  for (let [key, value] of Object.entries(currentWeather)) {
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
    card.forEach((span, i) => {
      if (i === 3 || i === 4) {
        console.log(span);
        console.log(data[i].slice(-5));
        span.textContent = data[i].slice(-5)
      } else {
        span.textContent = data[i]
      }
    })
    const forecastSection = document.querySelector(".forecast-cards")
    forecastSection.appendChild(clone)
  }
  return { clone, card, append }
}
function displayWeatherCard(weather) {
  const weatherForecast = Object.values(weather)
  let i = 0
  while (i < weatherForecast.length - 1) {
    const todaysWeather = weatherForecast.map(arr => arr[i])
    makeCard().append(todaysWeather)
    i++
  }
}
