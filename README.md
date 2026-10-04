# 🌤️ Atmosphere – Weather Web App

A responsive weather dashboard with live conditions, hourly and 7-day forecasts, air quality, UV index, wind charts, smart weather alerts and weather-based themes.

**Live demo:** https://the-atmosphere.onrender.com/

> The demo runs on a free hosting plan, so the first load after a period of inactivity can take up to a minute while the server wakes up.

<!-- Add screenshots here, e.g.
![Dashboard](docs/screenshot-dashboard.png)
-->

## Features

- **Current conditions** – temperature, feels-like, humidity, wind speed and direction, pressure, visibility, cloud cover and precipitation
- **Hourly forecast** and **7-day forecast** with weather icons
- **Temperature overview** and **wind** charts (with a wind compass)
- **Air quality** – US AQI with PM2.5, PM10, NO₂, O₃, CO and SO₂
- **UV index** gauge with sun-protection advice
- **Sunrise and sunset** with a live sun-position indicator and daylight duration
- **Weather alerts** generated from the forecast (rain, thunderstorm, heat, cold, wind, UV, visibility and more)
- **Dynamic themes** – backgrounds and colours change with the weather, or switch to a static theme
- **City search** with autosuggest
- **Saved locations** stored in your browser, with a sidebar for quick access
- **Use current location** via the browser's geolocation
- Loading screen and graceful handling of failed requests

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | HTML, JavaScript (vanilla), [Tailwind CSS](https://tailwindcss.com/) v4 |
| Charts | [ApexCharts](https://apexcharts.com/), [Chart.js](https://www.chartjs.org/) |
| Backend | Node.js, [Express](https://expressjs.com/), CORS, dotenv |
| Data | [Open-Meteo](https://open-meteo.com/) (forecast and air quality), [OpenCage](https://opencagedata.com/) (geocoding), [OpenStreetMap Nominatim](https://nominatim.org/) (reverse geocoding) |
| Hosting | [Render](https://render.com/) |

## How it works

```
Browser ──► /geocode/:city ─────────► Express ──► OpenCage        (API key stays on the server)
   │
   ├──────► api.open-meteo.com ─────► forecast + air quality      (called directly from the browser)
   │
   └──────► POST /build ────────────► Express turns the raw weather data
                                       into the format the UI renders
```

- The **OpenCage API key never reaches the browser**. The Express server does the city lookup.
- **Open-Meteo is called from the browser**, so each visitor uses their own IP address. This avoids rate-limit (HTTP 429) errors that happen when many apps share a hosting provider's IP.
- The server converts the raw Open-Meteo response into the data structure the UI uses (condition names, wind direction, alerts, formatted times and so on).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (the server uses the built-in `fetch`)
- A free [OpenCage](https://opencagedata.com/) API key

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
OpenCage_API_KEY=your_opencage_api_key
```

`.env` is listed in `.gitignore`. Never commit your key.

### Run locally

Start the server:

```bash
npm run devStart     # development, auto-restarts with nodemon
# or
npm start            # production
```

If you edit the styles, run the Tailwind watcher in a second terminal:

```bash
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
.
├── server.js            # Express server: geocoding, reverse geocoding, data builder
├── package.json
├── .env                 # your API key (not committed)
└── public/              # frontend, served statically by Express
    ├── index.html
    ├── JS/script.js     # UI logic, charts, alerts, themes
    ├── src/             # Tailwind input/output CSS
    ├── Assets/          # icons, backgrounds, alert illustrations, logo
    └── cities.json      # city names used for search autosuggest
```

## API endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/geocode/:cityName` | Returns `lat`, `lon` and a display name for a city |
| `GET` | `/reverse/:lat/:lon` | Returns a city name for coordinates ("Use current location") |
| `POST` | `/build` | Takes raw Open-Meteo data and returns the processed weather object used by the UI |

## Deployment (Render)

1. Push the repository to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add the environment variable `OpenCage_API_KEY` under **Environment**.
5. Deploy. The server uses the port Render provides (`process.env.PORT`).

## Roadmap

- Compress the large background images and `cities.json`
- Cache geocoding results to save API quota
- Improve keyboard and screen-reader accessibility
- Handle rapid successive searches so older results can't overwrite newer ones

## Credits

- Weather and air-quality data by [Open-Meteo](https://open-meteo.com/) (licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/))
- Geocoding by [OpenCage](https://opencagedata.com/)
- Reverse geocoding by [OpenStreetMap Nominatim](https://nominatim.org/) – © OpenStreetMap contributors
- Charts by ApexCharts and Chart.js

## License

ISC (as declared in `package.json`). Add a `LICENSE` file if you want to make this explicit.
