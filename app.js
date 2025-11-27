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

