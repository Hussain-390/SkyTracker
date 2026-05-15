const userLocation = document.getElementById("userLocation"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelslike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UVValue = document.getElementById("UVValue"),
  PValue = document.getElementById("PValue");
const API_KEY = "3c66bc171dcc417ba5d145328250210";
const WEATHER_API_ENDPOINT = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=8&q=`;
function updateBackground(condition) {
  const body = document.body;
  body.className = '';
  const text = condition.toLowerCase();
  if (text.includes('clear') || text.includes('sunny')) body.classList.add('clear');
  else if (text.includes('cloud') || text.includes('overcast') || text.includes('mist')) body.classList.add('clouds');
  else if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) body.classList.add('rain');
  else if (text.includes('snow') || text.includes('sleet') || text.includes('ice')) body.classList.add('snow');
  else if (text.includes('thunder')) body.classList.add('thunder');
}
function findUserLocation(cityInput) {
  const query = cityInput || userLocation.value;
  if (!query) return;
  description.innerHTML = "Fetching weather...";
  fetch(WEATHER_API_ENDPOINT + query)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error.message);
        description.innerHTML = "Location not found";
        return;
      }
      city.innerHTML = `${data.location.name}, ${data.location.country}`;
      date.innerHTML = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      weatherIcon.style.backgroundImage = `url(${data.current.condition.icon})`;
      temperature.innerHTML = Math.round(data.current.temp_c) + "°C";
      feelslike.innerHTML = "Feels like " + Math.round(data.current.feelslike_c) + "°C";
      description.innerHTML = `<i class="fa-solid fa-cloud-sun"></i> &nbsp; ${data.current.condition.text}`;
      updateBackground(data.current.condition.text);
      HValue.innerHTML = data.current.humidity + "<span>%</span>";
      WValue.innerHTML = data.current.wind_kph.toFixed(1) + "<span> km/h </span>";
      PValue.innerHTML = data.current.pressure_mb + "<span> hPa </span>";
      CValue.innerHTML = data.current.cloud + "<span>%</span>";
      UVValue.innerHTML = data.current.uv;
      SRValue.innerHTML = "Sunrise<br>" + data.forecast.forecastday[0].astro.sunrise;
      SSValue.innerHTML = "Sunset<br>" + data.forecast.forecastday[0].astro.sunset;
      const weeklyDiv = document.getElementById("weekly");
      weeklyDiv.innerHTML = "";
      data.forecast.forecastday.forEach(day => {
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const dayIconUrl = day.day.condition.icon.startsWith('//') ? 'https:' + day.day.condition.icon : day.day.condition.icon;
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.innerHTML = `
                    <p style="font-weight: 600;">${dayName}</p>
                    <img src="${dayIconUrl}" alt="${day.day.condition.text}">
                    <p style="font-size: 1.2rem; font-weight: 700;">${Math.round(day.day.avgtemp_c)}&deg;</p>
                `;
        weeklyDiv.appendChild(dayElement);
      });
    })
    .catch(error => {
      console.error(error);
      description.innerHTML = "Error loading data";
    });
}
userLocation.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    findUserLocation();
  }
});
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        findUserLocation(`${position.coords.latitude},${position.coords.longitude}`);
      },
      () => {
        findUserLocation("London");
      }
    );
  } else {
    findUserLocation("London");
  }
};