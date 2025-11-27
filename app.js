const API_KEY = "MY_API_KEY";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const recentList = document.getElementById("recentList");
const currentWeather = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecast");
const unitToggle = document.getElementById("unitToggle");
const unitLabel = document.getElementById("unitLabel");
const uiMessage = document.getElementById("uiMessage");
const uiMessageText = document.getElementById("uiMessageText");
const uiMessageClose = document.getElementById("uiMessageClose");
const extremeAlert = document.getElementById("extremeAlert");
const extremeText = document.getElementById("extremeText");
const extremeClose = document.getElementById("extremeClose");
const weatherBg = document.getElementById("weatherBg");

const recentToggle = document.getElementById("recentToggle"); // ⬅️ NEW

let isF = false;
let lastData = null;

function showUIMessage(text = "", timeout = 3500) {
  if (!uiMessage) return;
  uiMessageText.textContent = text;
  uiMessage.classList.remove("hidden");
  clearTimeout(window._uiMsgTimer);
  if (timeout > 0) window._uiMsgTimer = setTimeout(() => uiMessage.classList.add("hidden"), timeout);
}
if (uiMessageClose) uiMessageClose.addEventListener("click", () => uiMessage.classList.add("hidden"));

function showExtremeAlert(txt) {
  if (!extremeAlert) return;
  extremeText.textContent = txt;
  extremeAlert.classList.remove("hidden");
}
function hideExtremeAlert() {
  if (!extremeAlert) return;
  extremeAlert.classList.add("hidden");
}
if (extremeClose) extremeClose.addEventListener("click", hideExtremeAlert);

function getRecent() {
  return JSON.parse(localStorage.getItem("recent_searches") || "[]");
}

function saveRecent(city) {
  if (!city) return;
  let arr = getRecent();
  arr = arr.filter(c => c.toLowerCase() !== city.toLowerCase());
  arr.unshift(city);
  if (arr.length > 8) arr = arr.slice(0, 8);
  localStorage.setItem("recent_searches", JSON.stringify(arr));
}

// Show dropdown
function showRecent() {
  const arr = getRecent();
  if (!arr.length) {
    recentList.classList.add("hidden");
    return;
  }

  recentList.innerHTML = "";
  arr.forEach(city => {
    const d = document.createElement("div");
    d.textContent = city;
    d.addEventListener("click", () => {
      searchInput.value = city;
      hideRecent();
      doSearch();
    });
    recentList.appendChild(d);
  });

  recentList.classList.remove("hidden");
  recentToggle.classList.add("rotated");   // ⬅️ rotate arrow
}

// Hide dropdown
function hideRecent() {
  recentList.classList.add("hidden");
  recentToggle.classList.remove("rotated"); // ⬅️ remove rotation
}

// Toggle via icon click
recentToggle.addEventListener("click", () => {
  if (recentList.classList.contains("hidden")) showRecent();
  else hideRecent();
});

// Input focus open
searchInput.addEventListener("focus", showRecent);

// typing → hide
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") showRecent();
  else hideRecent();
});

// click outside → hide
document.addEventListener("click", (e) => {
  if (!recentList.contains(e.target) && 
      e.target !== searchInput &&
      e.target !== recentToggle) {
    hideRecent();
  }
});

unitToggle.addEventListener("change", () => {
  isF = unitToggle.checked;
  unitLabel.textContent = isF ? "°F" : "°C";
  if (lastData) renderCurrent(lastData);
});

function getWeatherIcon(cond) {
  cond = cond.toLowerCase();
  if (cond.includes("thunder")) return "bi bi-lightning";
  if (cond.includes("storm")) return "bi bi-hurricane";
  if (cond.includes("rain")) return "bi bi-cloud-rain-heavy";
  if (cond.includes("drizzle")) return "bi bi-cloud-drizzle";
  if (cond.includes("snow")) return "bi bi-snow2";
  if (cond.includes("fog")) return "bi bi-cloud-fog2";
  if (cond.includes("haze")) return "bi bi-cloud-haze";
  if (cond.includes("smoke")) return "bi bi-cloud-fog";
  if (cond.includes("mist")) return "bi bi-cloud-haze2";
  if (cond.includes("sunny")) return "bi bi-brightness-high";
  if (cond.includes("clear")) return "bi bi-brightness-alt-high";
  if (cond.includes("cloud")) return "bi bi-clouds";
  return "bi bi-brightness-high";
}

function setBgForCondition(cond) {
  weatherBg.classList.remove(
    "sunny","clear","clouds","rain","drezzle","snow","thunder",
    "storm","fog","haze","mist","smoke","drizzle","sunnuy"
  );

  if (!cond) return;
  const c = String(cond).toLowerCase();

  if (c.includes("rain")) weatherBg.classList.add("rain");
  else if (c.includes("snow")) weatherBg.classList.add("snow");
  else if (c.includes("cloud")) weatherBg.classList.add("clouds");
  else if (c.includes("clear")) weatherBg.classList.add("clear");
  else if (c.includes("thunder")) weatherBg.classList.add("thunder");
  else if (c.includes("storm")) weatherBg.classList.add("storm");
  else if (c.includes("fog")) weatherBg.classList.add("fog");
  else if (c.includes("mist")) weatherBg.classList.add("mist");
  else if (c.includes("haze")) weatherBg.classList.add("haze");
  else if (c.includes("smoke")) weatherBg.classList.add("smoke");
  else if (c.includes("drizzle")) weatherBg.classList.add("drizzle");
  else if (c.includes("sunny")) weatherBg.classList.add("sunnuy");
}

searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });

function doSearch() {
  const city = searchInput.value.trim();
  if (!city) { showUIMessage("Search is empty — enter a city name"); return; }
  fetchWeatherByCity(city);
  saveRecent(city);
}

async function fetchWeatherByCity(city) {
  try {
    showUIMessage("Loading...", 1000);

    const curRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!curRes.ok) { showUIMessage("City not found. Try another name."); return; }

    const cur = await curRes.json();
    lastData = cur;

    setBgForCondition(cur.weather[0].main);
    renderCurrent(cur);

    if (cur.main.temp >= 40) showExtremeAlert(`High temperature ${cur.main.temp.toFixed(1)}°C — stay hydrated!`);
    else if (cur.main.temp <= -10) showExtremeAlert(`Very low temperature ${cur.main.temp.toFixed(1)}°C — stay warm!`);
    else hideExtremeAlert();

    const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!fRes.ok) { showUIMessage("Forecast not available"); return; }

    const forecastData = await fRes.json();
    renderForecast(forecastData.list);
  } 
  catch (err) {
    console.error(err);
    showUIMessage("Network error while fetching weather");
  }
}

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) { showUIMessage("Geolocation not supported"); return; }

  showUIMessage("Getting location...", 1200);

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const lat = pos.coords.latitude, lon = pos.coords.longitude;

      const curRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      if (!curRes.ok) { showUIMessage("Could not fetch location weather"); return; }

      const cur = await curRes.json();
      lastData = cur;

      setBgForCondition(cur.weather[0].main);
      renderCurrent(cur);

      if (cur.main.temp >= 40) showExtremeAlert(`High temperature ${cur.main.temp.toFixed(1)}°C — stay hydrated!`);
      else if (cur.main.temp <= -10) showExtremeAlert(`Very low temperature ${cur.main.temp.toFixed(1)}°C — stay warm!`);
      else hideExtremeAlert();

      const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      if (fRes.ok) {
        const forecastData = await fRes.json();
        renderForecast(forecastData.list);
      }
    } 
    catch (err) {
      console.error(err);
      showUIMessage("Error fetching location weather");
    }
  }, 
  (err) => {
    showUIMessage("Could not get location: " + err.message);
  },
  { timeout: 10000 });
});


function renderCurrent(data) {
  if (!data || !data.main) return;
  const tempC = data.main.temp;
  const tempShown = isF ? ((tempC * 9/5) + 32).toFixed(1) + " °F" : tempC.toFixed(1) + " °C";

  const cond = data.weather[0].main;
  const desc = data.weather[0].description;

  currentWeather.classList.remove("hidden");
  currentWeather.innerHTML = `
    <div class="current-left">
      <div style="font-weight:700;font-size:18px">${data.name}</div>
      <div style="font-size:28px;font-weight:700;margin-top:6px">
        <i class="bi bi-thermometer-half"></i> ${tempShown}
      </div>
      <div style="opacity:.85;margin-top:6px;text-transform:capitalize">
        <i class="${getWeatherIcon(cond)}" style="font-size:20px"></i> ${cond} — ${desc}
      </div>
    </div>
    <div class="current-right">
      <div style="margin-bottom:6px"><i class="bi bi-wind"></i> ${data.wind.speed} m/s</div>
      <div><i class="bi bi-moisture"></i> ${data.main.humidity}%</div>
    </div>
  `;
}


// Render forecast :

function renderForecast(list) {
  forecastContainer.innerHTML = "";
  if (!Array.isArray(list) || !list.length) return;

  const days = {};

  list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  const dayKeys = Object.keys(days).slice(0, 5);

  dayKeys.forEach(key => {
    const items = days[key];
    let rep = items[0];
    for (let it of items) {
      if (it.dt_txt.includes("12:00:00")) { rep = it; break; }
    }

    const dateLabel = new Date(key).toLocaleDateString();
    const tempC = rep.main.temp.toFixed(1);
    const weatherMain = rep.weather[0].main;
    const wind = rep.wind.speed;
    const hum = rep.main.humidity;

    const card = document.createElement("div");
    card.className = "forecast-box";

    card.innerHTML = `
        <i class="${getWeatherIcon(weatherMain)}" style="font-size:32px;margin-bottom:6px"></i>
        <div style="font-weight:600">${dateLabel}</div>
        <div style="text-transform:capitalize;opacity:.95">${weatherMain}</div>
        <div style="font-weight:700;font-size:16px">
          <i class="bi bi-thermometer-half"></i> ${tempC} °C
        </div>
        <div style="opacity:.9">
          <i class="bi bi-wind"></i> ${wind} m/s &nbsp; • &nbsp;
          <i class="bi bi-moisture"></i> ${hum}%
        </div>
    `;

    forecastContainer.appendChild(card);
  });
}

