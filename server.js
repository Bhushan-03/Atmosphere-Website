const express = require("express");
const app = express();
require("dotenv").config();
const port = 3000;

const cors = require('cors');
const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

async function getCoordinates(city) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OpenCage_API_KEY}&pretty=1&no_annotations=1`;

    try{
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}

async function getWeather(lat,lon) {
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=apparent_temperature_max,weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max,daylight_duration&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,rain,pressure_msl,temperature_2m_max,temperature_2m_min,uv_index&forecast_days=14&timezone=auto`);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        // console.log(result);
        return result;
    }
    catch (error) {
        console.error(error.message);
    }
}

async function getAirData(lat, lon) {
    try {
        let response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,carbon_monoxide,sulphur_dioxide&utm_source=chatgpt.com`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        // console.log(result);
        return result;
    }
    catch {

    }
}

async function getWDName(data) {
    const DI = {0:"North", 1:"Northeast", 2:"East", 3:"Southeast", 4:"South", 5:"Southwest", 6:"West", 7:"Northwest"};
    let wdIndex = Math.trunc((data["current"]["wind_direction_10m"] + 22.5) / 45)
    return DI[wdIndex];
}

async function getPrecipitation(data) {
    return (data["current"]["precipitation"] * 100);
}

function getWCTheme(data) {
    const weatherCode = data;
    if (weatherCode === 0) return "Clear Sky";
    if (weatherCode === 1) return "Partly Cloudy";
    if ([2, 3].includes(weatherCode)) return "Cloudy";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "Rainy";
    if ([95, 96, 99].includes(weatherCode)) return "Thunderstorm";
    if ([45, 48].includes(weatherCode)) return "Fog";
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "Snow";
    return "Unknown";
}

function getWeatherCondition(data) {
    const weatherCode = data;
    if (weatherCode === 0) return "Clear Sky";
    if (weatherCode === 1) return "Partly Cloudy";
    if ([2,3].includes(weatherCode)) return "Cloudy";
    if ([45,48].includes(weatherCode)) return "Fog";
    if ([51, 53, 55].includes(weatherCode)) return "Drizzle";
    if ([56, 57].includes(weatherCode)) return "Freezing drizzle";
    if ([61, 63, 65].includes(weatherCode)) return "Rain";
    if ([66, 67].includes(weatherCode)) return "Freezing rain";
    if ([71, 73, 75, 77].includes(weatherCode)) return "Snow";
    if ([80, 81, 82].includes(weatherCode)) return "Rain showers";
    if ([96, 99].includes(weatherCode)) return "Thunderstorm with hail";
    return "Unknown";
}

async function getVisibility(data) {
    return (data.visibility) / 1000
}

async function getCurrentWeather(data, airData) {

    let cw_map = new Map();

    cw_map.set("cTime", `${formatTime(data.current.time)}`);
    cw_map.set("cDate", `${formatDate(data.current.time)}`);
    cw_map.set("cDayName", `${await formatday(data.current.time)}`);
    cw_map.set("cTemp", `${data.current.temperature_2m}`);
    cw_map.set("cHumidity", `${data.current.relative_humidity_2m}`);
    cw_map.set("cFeelslike", `${data.current.apparent_temperature}`);
    cw_map.set("cVisibility", `${await getVisibility(data.current)}`);
    cw_map.set("cPressure", `${data.current.pressure_msl}`);
    cw_map.set("cWeatherCondition", `${getWeatherCondition(data.current.weather_code)}`);
    cw_map.set("cWeatherConditionTheme", `${getWCTheme(data.current.weather_code)}`);
    cw_map.set("todaysmaxTemp", `${data.daily.temperature_2m_max[0]}`);
    cw_map.set("todaysminTemp", `${data.daily.temperature_2m_min[0]}`);
    cw_map.set("cwWindSpeed", `${data.current.wind_speed_10m}`);
    cw_map.set("cwWindDirection", `${await getWDName(data)}`);
    cw_map.set("cwWindGusts", `${data.current.wind_gusts_10m}`);
    cw_map.set("cwPrecipitation", `${await getPrecipitation(data)}`);
    cw_map.set("cwCloudCover", `${data.current.cloud_cover}`);
    cw_map.set("cwUVIndex", `${data.current.uv_index}`);
    cw_map.set("cwUVIndexMax", `${data.daily.uv_index_max[0]}`);
    cw_map.set("cwSunrise", `${await getSunrise(data)}`);
    cw_map.set("cwSunset", `${await getSunset(data)}`);
    cw_map.set("cwDayLightDuration", `${await formatDuration(data.daily.daylight_duration[0])}`);
    cw_map.set("caqAQI", `${airData.current.european_aqi}`);
    cw_map.set("caqPM10", `${airData.current.pm10}`);
    cw_map.set("caqPM2_5", `${airData.current.pm2_5}`);
    cw_map.set("caqNO2", `${airData.current.nitrogen_dioxide}`);
    cw_map.set("caqO3", `${airData.current.ozone}`);
    cw_map.set("caqCO", `${airData.current.carbon_monoxide}`);
    cw_map.set("caqSO2", `${airData.current.sulphur_dioxide}`);

    return cw_map;
}

async function getSunrise(data) {
    return formatTime(data.daily.sunrise[0]);
}

async function getSunset(data) {
    return formatTime(data.daily.sunset[0]);
}

function formatTime(time) {
    return new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

async function formatday(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long"
    });
}

function formatDayDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}

async function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

async function getLocationName(response) {
    if (response.results[0].components.city) {
        // console.log(`${response.results[0].components.city}, ${response.results[0].components.state}`);
        return `${response.results[0].components.city}, ${response.results[0].components.state}`;
    }
    else if (!response.results[0].components.city) {
        return response.results[0].formatted;
    }
}

function getCurrentHourIndex(data) {
    const currentHour = data.current.time.slice(0,13) + ":00";
    const currentHourIndex = data.hourly.time.findIndex(time => time === currentHour);
    return currentHourIndex;
}

async function getHourlyDate(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.time.slice(chIndex, chIndex + 24).map(formatDate);
}

function getHourlyTime(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.time.slice(chIndex, chIndex + 24).map(formatTime);
}

function getHourlyRawTime(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.time.slice(chIndex, chIndex + 24);
}

function getHourlyTemp(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.temperature_2m.slice(chIndex, chIndex + 24);
}

function getHourlyHumidity(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.relative_humidity_2m.slice(chIndex, chIndex + 24);
}

function getHourlyP(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.precipitation.slice(chIndex, chIndex + 24);
}

function getHourlyRainP(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.precipitation_probability.slice(chIndex, chIndex + 24);
}

function getHourlyRain(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.rain.slice(chIndex, chIndex + 24);
}

function getHourlyApparentTemp(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.apparent_temperature.slice(chIndex, chIndex + 24);
}

function getHourlyWeatherCondition(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.weather_code.slice(chIndex, chIndex + 24).map(getWeatherCondition);
}

function getHourlyWCTheme(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.weather_code.slice(chIndex, chIndex + 24).map(getWCTheme);
}

function getHourlyWindSpeed(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.wind_speed_10m.slice(chIndex, chIndex + 24);
}

function getHourlyVisibility(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.visibility.slice(chIndex, chIndex + 24);
}

function getHourlyWeatherCode(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.weather_code.slice(chIndex, chIndex + 24);
}

function getHourlyWindGusts(data) {
    const chIndex = getCurrentHourIndex(data);
    return data.hourly.wind_gusts_10m.slice(chIndex, chIndex + 24);
}

async function getHourlyData(data) {
    const hourlyDates = await getHourlyDate(data);
    const hourlyTime = getHourlyTime(data);
    const hourlyRawTime = getHourlyRawTime(data);
    const hourlyTemp = getHourlyTemp(data);
    const hourlyHumidity = getHourlyHumidity(data);
    const hourlyRain = getHourlyRainP(data);
    const hourlyR = getHourlyRain(data);
    const hourlyP = getHourlyP(data);
    const hourlyApparentTemp = getHourlyApparentTemp(data);
    const hourlyWeatherCondition = getHourlyWeatherCondition(data);
    const hourlyWCName = getHourlyWCTheme(data);
    const hourlyVisibility = getHourlyVisibility(data);
    const hourlyWeatherCode = getHourlyWeatherCode(data);
    const hourlyWindSpeed = getHourlyWindSpeed(data);
    const hourlyWindGusts = getHourlyWindGusts(data);
    return {hourlyDates, hourlyTime, hourlyRawTime, hourlyTemp, hourlyHumidity, hourlyP, hourlyR, hourlyRain, hourlyApparentTemp, hourlyWeatherCondition, hourlyWCName, hourlyVisibility, hourlyWeatherCode, hourlyWindSpeed, hourlyWindGusts};
}

function getDailyDay(data) {
    return data.daily.time.map(formatDayDate);
}

function getDailyWeatherCondition(data) {
    return data.daily.weather_code.map(getWCTheme);
}

function getDailyMinTemp(data) {
    return data.daily.temperature_2m_min;
}

function getDailyMaxTemp(data) {
    return data.daily.temperature_2m_max;
}

function getDailyMaxFeelsLike(data) {
    return data.daily.apparent_temperature_max;
}

function getDailyPP(data) {
    return data.daily.precipitation_probability_max;
}

async function getDailyData(data) {
    const dailyDay = getDailyDay(data);
    const dailyWCondition = getDailyWeatherCondition(data);
    const dailyMinTemp = getDailyMinTemp(data);
    const dailyMaxTemp = getDailyMaxTemp(data);
    const dailyMaxFeelsLike = getDailyMaxFeelsLike(data);
    const dailyPrepProbability = getDailyPP(data);
    return {dailyDay, dailyWCondition, dailyMinTemp, dailyMaxTemp, dailyMaxFeelsLike, dailyPrepProbability};
}


async function main(cityname) {
    const apiResponse = await getCoordinates(cityname);
    const lat = apiResponse.results[0].geometry.lat;
    const lon = apiResponse.results[0].geometry.lng;
    const locationName = {"CityName" : await getLocationName(apiResponse)};
    const weatherData = await getWeather(lat, lon);
    const AirQualityData = await getAirData(lat, lon);
    const cwData = await getCurrentWeather(weatherData, AirQualityData);
    const hourlyData = await getHourlyData(weatherData);
    const dailyData = await getDailyData(weatherData);
    return combined = {"Current": {...locationName, ...Object.fromEntries(cwData)}, hourlyData, dailyData};
}

app.get("/city/:cityName", async (req,res) => {
    const cityName = req.params.cityName;
    console.log(cityName);
    const WeatherRes = await main(cityName);
    res.json(WeatherRes);
});


app.get("/", async (req,res) => {
    const cWeather = await main();
    res.json(cWeather);
});
app.listen(port);