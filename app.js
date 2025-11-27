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

