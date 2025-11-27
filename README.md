#  Weather Forecast Web App  

A simple, clean and student-friendly weather application built using **HTML, CSS and JavaScript**.  
It fetches real-time weather using **OpenWeather API**, shows current conditions, 5-day forecast, and updates the background dynamically based on the weather.

---

##  Overview

This project demonstrates how to work with APIs, update UI dynamically, manage state, store recent searches, and create responsive layouts without using frameworks.

The app supports:
- City-based weather search  
- Current location weather  
- Live temperature, wind and humidity  
- 5-day forecast  
- Dynamic weather background  
- Extreme temperature alerts  
- Recent searches using LocalStorage  
- °C / °F unit toggle  

---

##  Features

### ✔ Live Weather Search  
Enter any city name and instantly get updated weather conditions.
### ✔ Current Location Weather  
Uses browser **Geolocation API** to fetch weather for the user’s location.
### ✔ 5-Day Forecast  
Displays future weather with temperature, wind and humidity for each day.
### ✔ Dynamic Background  
Background image changes depending on:
- Rain  
- Clear 
- Sunny
- Clouds  
- Snow  
- Fog   
- Haze
- Mist
- Storm  
- Thunder
- Drizzle  
- Default (fallback)
### ✔ Default Background  
A fallback image is always shown when conditions are unknown.
### ✔ Unit Toggle (°C / °F)  
Only the current temperature switches between Celsius and Fahrenheit.
### ✔ Recent Searches  
Automatically stores searched cities using **LocalStorage** and displays them in a dropdown.
### ✔ Extreme Temperature Alerts  
Shows custom alerts for:
- ≥ 40°C (Heat Alert)  
- ≤ –10°C (Cold Alert)

---

## Technologies Used

| Technology | Purpose |
|-----------|----------|
| **HTML5** | UI structure |
| **CSS3**  | Styling + responsiveness |
| **JavaScript (ES6)** | API fetch, DOM handling |
| **OpenWeather API** | Weather data |
| **LocalStorage** | Recent searches |

---
---
##  Project Structure
```

project-folder/
│── index.html
│── style.css
│── script.js
│── README.md
│── .gitignore
│
└── /weather-images
├── default.png
├── sunny.png
├── clouds.png
├── rain.png
├── snow.png
├── fog.png
├── haze.jpg
├── mist.jpg
├── smoke.jpg
├── clear.jpg
├── storm.png
└── drizzle.jpg

└── favicon.png


```

## API Setup (OpenWeather API)

1. Go to **https://openweathermap.org/**
2. Create a free account  
3. Go to **My API Keys**  
4. Copy your API key  
5. Paste it inside `app.js`:

```js
const API_KEY = "your_api_key_here";


```

## How to Run This Project

Option 1: Run Directly 
- Simply open index.html in your browser.

Option 2: Use Live Server
- 
Recommended for cleaner performance:
- Install VS Code
- Install Live Server extension
- Right click → Open with Live Server

---

## Usage Guide

1.Enter any city name and click Search.
2.Or click Current Location to auto-detect your weather.
3.See current temperature, wind, humidity and weather description.
4.Background updates automatically.
5.Scroll to view the 5-day forecast.
6.Toggle temperature units using °C / °F switch.
7.See recent searches in a dropdown.
8.If temperature is extremely high/low, alert is shown.

---

## Credits

- OpenWeather API for weather data.
- FontAwesome / Icons8 (if you used icons).
- All background images used for educational purposes.

---

## License

This project is for educational use as part of an assignment.

---

## Author

Priya Modi 
GitHub: https://github.com/officialpriya-7
