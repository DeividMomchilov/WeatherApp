const input = document.getElementById("place-input");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const weatherCard = document.getElementById("weather-card");
const placeName = document.getElementById("place-name");
const coordsText = document.getElementById("coords");
const currentWeather = document.getElementById("current-weather");
const moreInfo = document.getElementById("more-info");
const errorBox = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (!query) {
    showError("Моля, въведете име на населено място.");
    return;
  }
  getWeather(query);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

async function getWeather(cityName) {
  clearMessages();
  searchBtn.disabled = true;
  searchBtn.textContent = "Търсене...";

  try {
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName + ", България")}&accept-language=bg`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      throw new Error("Няма намерено населено място с това име.");
    }

    const { lat, lon, display_name } = geoData[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherData.current_weather) {
      throw new Error("Няма налични данни за времето в момента.");
    }

    const weather = weatherData.current_weather;

    showWeather(display_name, lat, lon, weather);
  } catch (err) {
    showError(err.message || "Възникна неочаквана грешка.");
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Търсене";
  }
}

function showWeather(name, lat, lon, weather) {
  placeholder.style.display = "none";
  weatherCard.style.display = "block";
  errorBox.style.display = "none";

  placeName.textContent = name;
  coordsText.textContent = `Координати: ${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`;
  currentWeather.textContent = `🌡️ ${weather.temperature}°C`;

  const windDir = degToCompass(weather.winddirection);

  moreInfo.innerHTML = `
    <li>💨 Вятър: ${weather.windspeed} km/h (${windDir})</li>
    <li>⏰ Време на последна актуализация: ${weather.time.replace("T", " ")}</li>
  `;

  weatherCard.animate(
    [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 400, easing: "ease-out" }
  );
}

function degToCompass(num) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = ["С", "ССИ", "СИ", "ИСИ", "И", "ИЮИ", "ЮИ", "ЮЮИ", "Ю", "ЮЮЗ", "ЮЗ", "ЗЮЗ", "З", "ЗСЗ", "СЗ", "ССЗ"];
  return arr[val % 16];
}

function showError(message) {
  errorBox.textContent = `⚠️ ${message}`;
  errorBox.style.display = "block";
  placeholder.style.display = "none";
  weatherCard.style.display = "none";
  errorBox.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
    { duration: 300 }
  );
}

function clearMessages() {
  errorBox.style.display = "none";
  placeholder.style.display = "none";
  weatherCard.style.display = "none";
}