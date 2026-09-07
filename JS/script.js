let currentDynamicTheme = "dynamicThemeSunny";
let currentThemeMode = "Dynamic Mode";

// function showSkeletonLoader(isLoading){
//     document.querySelector(".mainScreen").classList.toggle("animate-skeleton-loading-dark", isLoading);
//     document.querySelector(".weather-Main-Card").classList.toggle("animate-skeleton-loading", isLoading);
// }
// function hideSkeletonLoader(isLoading){
//     document.querySelector(".mainScreen").classList.remove("animate-skeleton-loading-dark", isLoading);
//     document.querySelector(".weather-Main-Card").classList.remove("animate-skeleton-loading", isLoading);
//     document.querySelector(".cwLocationIcon").classList.remove("hidden", isLoading);
// }

async function getWeatherData(cityName = "Mumbai") {
    try {
        const response = await fetch(`http://localhost:3000/city/${encodeURIComponent(cityName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error("Error:", error);
        return null;
    }
}

function getDynamicTheme(weatherCondition) {
    const themes = {
        "Clear Sky": "dynamicThemeSunny",
        "Partly Cloudy": "dynamicThemePartlyCloudy",
        "Cloudy": "dynamicThemeCloudy",
        "Rainy": "dynamicThemeRain",
        "Thunderstorm": "dynamicThemeThunderstorm",
        "Fog": "dynamicThemeFogMist",
        "Snow": "dynamicThemeSnow",
        "Clear Night": "dynamicThemeClearNight",
        "Cloudy Night": "dynamicThemeCloudyNight",
        "Sunrise": "dynamicThemeSunrise",
        "Sunset": "dynamicThemeSunset"
    };
    return themes[weatherCondition] || "dynamicThemeSunny";
}

function setTheme(themeName) {
    const screenContainer = document.querySelector(".screenContainer");
    if (!screenContainer) {
        return;
    }
    const currentTheme = screenContainer.dataset.themename;
    if (currentTheme) {
        screenContainer.classList.remove(currentTheme);
    }
    screenContainer.classList.add(themeName);
    screenContainer.dataset.themename = themeName;
}

function updateDynamicTheme(weatherCondition) {
    currentDynamicTheme = getDynamicTheme(weatherCondition);
    if (currentThemeMode === "Dynamic Mode") {
        setTheme(currentDynamicTheme);
    }
}

function themeSetter() {
    const selected = document.querySelector(".selected");
    if (!selected) {
        return;
    }
    currentThemeMode = selected.innerText;

    if (currentThemeMode === "Light Mode") {
        setTheme("lightTheme");
    }
    else if (currentThemeMode === "Dark Mode") {
        setTheme("darkTheme");
    }
    else if (currentThemeMode === "Dynamic Mode") {
        setTheme(currentDynamicTheme);
    }
}

function setWeatherCardBG(weatherCondition) {
    const weathercard = document.querySelector(".weather-Main-Card");
    const selected = document.querySelector(".selected");
    const conditions = {
        "Clear Sky": "ClearSky.png",
        "Partly Cloudy": "PartlyCloudy.png",
        "Cloudy": "Cloudy.png",
        "Rainy": "Rainy.png",
        "Thunderstorm": "Thunderstorm.png",
        "Fog": "Fog.png",
        "Snow": "Snow.png"
    };
    if (!selected) {
        return;
    }
    currentThemeMode = selected.innerText;
    if (currentThemeMode === "Light Mode" || currentThemeMode === "Dark Mode") {
        weathercard.style.backgroundImage = `url(/Assets/staticbg/${conditions[weatherCondition]})`;
    }
    else if (currentThemeMode === "Dynamic Mode") {
        weathercard.style.backgroundImage = `url(/Assets/dynamicbg/${conditions[weatherCondition]})`;
    }
}

function weatherOptions(weatherCondition) {
    const dropdown = document.querySelectorAll('.dropdown');

    dropdown.forEach(theme_option => {
        const select = theme_option.querySelector('.select');
        const caret = theme_option.querySelector('.caret');
        const menu = theme_option.querySelector('.menu');
        const options = theme_option.querySelectorAll('.menu li');
        const selected = theme_option.querySelector('.selected');
        
        select.addEventListener("click", () => {
            select.classList.toggle('selected-clicked');
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });

        options.forEach(option => {
            option.addEventListener("click", () => {
                selected.innerHTML = option.innerHTML;
                console.log(option.innerText);
                themeSetter();
                setWeatherCardBG(weatherCondition);
                select.classList.remove("selected-clicked");
                caret.classList.remove("caret-rotate");
                menu.classList.remove("menu-open");
                options.forEach(option => {
                    option.classList.remove("active");
                });
                option.classList.add("active");
                if (window.innerWidth < 1024) {
                    selected.childNodes[3]?.classList.toggle("hidden");
                } 
            });
        });
    });
}

function setHeroSectionData(data) {
    const cityDetails = document.querySelector(".cwCityName");
    const currentTemp = document.querySelector(".currentTemp");
    const cwCondition = document.querySelector(".currentWeatherCondition");
    const cldt = document.querySelector(".cl-dt");
    const cwminTemp = document.querySelector(".cw-ltemp");
    const cwmaxTemp = document.querySelector(".cw-htemp");
    const cw_Humidity = document.querySelector(".cw-Humidity");
    const cw_WSpeed = document.querySelector(".cw-WSpeed");
    const cw_Pressure = document.querySelector(".cw-Pressure");
    const cw_Visibility = document.querySelector(".cw-Visibility");
    cityDetails.innerText = `${data.CityName}`;
    currentTemp.innerText = `${data.cTemp}°`;
    cwCondition.innerText = `${data.cWeatherCondition}`;
    cldt.innerHTML = `<p class="cwl-dayName">${data.cDayName}</p>
                            <p>•</p>
                            <p class="cwl-date">${data.cDate}</p>
                            <p>•</p>
                            <p class="cwl-time">${data.cTime}</p>`;
    cwminTemp.innerText = `${data.todaysminTemp}°`;
    cwmaxTemp.innerText = `${data.todaysmaxTemp}°`;
    cw_Humidity.innerText = `${data.cHumidity}%`;
    cw_WSpeed.innerText = `${data.cwWindSpeed} ${data.cwWindDirection}`;
    cw_Pressure.innerText = `${data.cPressure} hPa`;
    cw_Visibility.innerText = `${data.cVisibility} km`; 
}

function setWAGData(data) {
    const wag_Humidity = document.querySelector(".wag-Humidity");
    const wag_windSpeed = document.querySelector(".wag-windSpeed");
    // const wag_windDirection = document.querySelector(".wag-windDirection");
    const wag_Precipitation = document.querySelector(".wag-Precipitation");
    const wag_uvIndex = document.querySelector(".wag-uvIndex");
    const wag_Visibility = document.querySelector(".wag-Visibility");
    const wag_CloudCover = document.querySelector(".wag-CloudCover");
    const wag_Sunrise = document.querySelector(".wag-Sunrise");
    const wag_Sunset = document.querySelector(".wag-Sunset");
    const wag_Pressure = document.querySelector(".wag-Pressure");

    wag_Humidity.innerText = `${data.cHumidity}%`;
    wag_windSpeed.innerText = `${data.cwWindSpeed} km/h`;
    // wag_windDirection.innerText = `${data.cwWindDirection}`;
    wag_Precipitation.innerText = `${data.cwPrecipitation}%`;
    wag_uvIndex.innerText = `${data.cwUVIndex}`;
    wag_Visibility.innerText = `${data.cVisibility}km`;
    wag_CloudCover.innerText = `${data.cwCloudCover}%`;
    wag_Sunrise.innerText = `${data.cwSunrise}`;
    wag_Sunset.innerText = `${data.cwSunset}`;
    wag_Pressure.innerText = `${data.cPressure} hPa`;
}

function setGauge(value) {
    //Limit value between 0 & 11
    value = Math.max(0, Math.min(value, 11));

    //value to angle conversion
    const angle = 180 - (value / 11) * 180;

    const radians = angle * Math.PI / 180;

    //indicatoe length
    const length = 70;

    const centerX = 160;
    const centerY = 145;

    const endX = centerX + length * Math.cos(radians);
    const endY = centerX - length * Math.sin(radians);

    document.getElementById("indicator").setAttribute("x2", endX);
    document.getElementById("indicator").setAttribute("y2", endY);
}

function getUVILevel(uvIndex) {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    if (uvIndex >= 11) return "Extreme";
}


function setUIData(data) {
    const cw_uvIndex = document.querySelector(".cw-uvIndex");
    const cw_uvLevel = document.querySelector(".cw-uvLevel");
    const cw_uvIndex_max = document.querySelector(".cw-uvIndex-Max");
    const today_sunrise = document.querySelector(".today-sunrise");
    const today_sunset = document.querySelector(".today-sunset");
    const today_dlduration = document.querySelector(".today-dlduration");
    const cw_wSpeed = document.querySelector(".cw-wSpeed");
    const cw_wDirection = document.querySelector(".cw-wDirection");
    const cw_wGusts = document.querySelector(".cw-wGusts");
    setGauge(data.cwUVIndex);
    setWindDirection(data.cwWindDirection);
    setAQIData(data);
    updateSunPosition(data.cwSunrise, data.cwSunset);
    cw_uvIndex.innerText = `${data.cwUVIndex}`;
    cw_uvLevel.innerText = `${getUVILevel(data.cwUVIndex)}`;
    cw_uvIndex_max.innerText = `${data.cwUVIndexMax}`;
    today_sunrise.innerText = `${data.cwSunrise}`;
    today_sunset.innerText = `${data.cwSunset}`;
    today_dlduration.innerText = `${data.cwDayLightDuration}`;
    cw_wSpeed.innerText = `${data.cwWindSpeed} km/h`;
    cw_wDirection.innerText = `${data.cwWindDirection}`;
    cw_wGusts.innerText = `${data.cwWindGusts} km/h`;
}

async function handleCitySearch(cityName) {
    const data = await getWeatherData(cityName);
    if (!data) {
        return;
    }
    const weatherCondition = data.Current.cWeatherConditionTheme;
    updateDynamicTheme(weatherCondition);
    setWeatherCardBG(weatherCondition);
    setHeroSectionData(data.Current);
    setWAGData(data.Current);
    setUIData(data.Current);
    setHourlyData(data);
    setDailyFC(data);
    setTempBar();
    temo_ov_linegraph(data);
    windChart(data);
    return data;
}

function getCityInput() {
    const cityInput = document.querySelector(".searchedCity");
    if (!cityInput) {
        return;
    }
    cityInput.addEventListener("keydown", async (event)=> {
        if (event.key !== "Enter") {
            return;
        }
        const cityName = cityInput.value.trim();
        if (!cityName) {
            return;
        }
        console.log(cityName);
        await handleCitySearch(cityName);
    });
}

function setWindDirection(direction) {
    const rotations = {
        North: 0,
        Northeast: 45,
        East: 90,
        Southeast: 135,
        South: 180,
        Southwest: 225,
        West: 270,
        Northwest: 315
    };

    const arrow = document.getElementById("direction-arrow");

    if (!arrow) return;

    const rotation = rotations[direction];

    if (rotation === undefined) {
        console.warn(`Invalid wind direction: ${direction}`);
        return;
    }

    arrow.setAttribute("transform", `rotate(${rotation} 184 163)`);
}

function setAQIData(data) {
    const aqiValue = document.querySelector(".caqi-value");
    const aqiPM2_5 = document.querySelector(".caqiPM2_5");
    const aqiPM10 = document.querySelector(".caqiPM10");
    const aqiNO2 = document.querySelector(".caqiNO2");
    const aqiO3 = document.querySelector(".caqiO3");
    const aqiCO = document.querySelector(".caqiCO");
    const aqiSO2 = document.querySelector(".caqiSO2");
    updateAQI(data.caqAQI);
    aqiValue.innerText = `${data.caqAQI}`;
    aqiPM2_5.innerText = `${data.caqPM2_5}`;
    aqiPM10.innerText = `${data.caqPM10}`;
    aqiNO2.innerText = `${data.caqNO2}`;
    aqiO3.innerText = `${data.caqO3}`;
    aqiCO.innerText = `${data.caqCO}`;
    aqiSO2.innerText = `${data.caqSO2}`;

    const aq_status = document.querySelectorAll(".aq-status");
    aq_status.forEach(aqs => {
        console.log(aqs);
    });
}

function getWeatherIcon(weatherCondition) {
    const conditions = {
        "Clear Sky": "ClearSky.png",
        "Partly Cloudy": "PartlyCloudy.png",
        "Cloudy": "Cloudy.png",
        "Rainy": "Rainy.png",
        "Thunderstorm": "Thunderstorm.png",
        "Fog": "Fog.png",
        "Snow": "Snow.png"
    };
    return conditions[weatherCondition];
}

function setHourlyData(data) {
    const hourlyBoxContainer = document.querySelector(".h-fc-boxes");
    hourlyBoxContainer.innerHTML = "";
    console.log(data.hourlyData);

    for (let i = 0; i <= 12; i++) {
        hourlyBoxContainer.innerHTML = hourlyBoxContainer.innerHTML + 
        `<div class="h-fc-b w-22.5 min-w-22.5 shrink-0 rounded-xl p-2 bg-(--weather-cards) text-(--weather-normal-text)">
            <p class="flex justify-self-center text-sm font-semibold">${data.hourlyData.hourlyTime[i]}</p>
            <img class="w-15 h-15 flex justify-self-center" src="Assets/icons/${getWeatherIcon(data.hourlyData.hourlyWCName[i])}" alt="">
            <p class="flex justify-self-center font-semibold">${data.hourlyData.hourlyTemp[i]}°</p>
            <div class="rain-possebility flex items-center justify-center space-x-1 mt-1">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" xml:space="preserve">
                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path d="M 45 90 c -18.12 0 -32.833 -14.667 -33.494 -33.391 l -0.002 -0.105 c 0 -15.42 10.55 -27.84 19.027 -37.82 c 4.985 -5.87 9.694 -11.414 11.065 -16.127 C 42.041 1.027 43.409 0 45 0 s 2.959 1.027 3.403 2.556 l 0 0 c 1.371 4.714 6.08 10.258 11.065 16.127 c 8.477 9.98 19.026 22.4 19.026 37.82 l -0.002 0.105 C 77.833 75.333 63.121 90 45 90 z M 17.504 56.451 C 18.077 71.903 30.145 84 45 84 c 14.856 0 26.923 -12.097 27.496 -27.549 c -0.025 -13.192 -9.361 -24.184 -17.6 -33.883 C 50.951 17.924 47.383 13.723 45 9.585 c -2.383 4.138 -5.951 8.339 -9.896 12.983 C 26.866 32.267 17.529 43.259 17.504 56.451 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,183,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                    </g>
                </svg>
                <p class="text-sm">${data.hourlyData.hourlyRain[i]}%</p>
                </div>
            </div>`;
    }
}

function setDailyFC(data) {
    const dailyFCContainer = document.querySelector(".daily-fc");
    dailyFCContainer.innerHTML = "";
    for (let i = 1; i <= 7; i++){
        dailyFCContainer.innerHTML = dailyFCContainer.innerHTML + 
        `<div class="d${i}-fc grid w-full grid-cols-[1.5fr_1fr_3fr_1fr] lap:max-desk:grid-cols-[1.5fr_0.5fr_1.2fr_0.8fr] items-center justify-center">
            <p class="text-nowrap">${data.dailyData.dailyDay[i]}</p>
            <img class="w-10 h-10 mr-4 flex justify-self-center" src="Assets/icons/${getWeatherIcon(data.dailyData.dailyWCondition[i])}" alt="">
            <div class="desk:max-largDesk:grid desk:max-largDesk:grid-cols-[1fr_3fr_1fr] flex lap:max-desk:justify-around">
                <p class="p-1 min-temp w-[29.5%] min-w-[29.5%]">${data.dailyData.dailyMaxTemp[i]}°</p>
                <div class="w-full overflow-hidden rounded-2xl p-1 lap:max-desk:hidden">
                    <div class="tempBar w-0 h-1 self-center m-2 rounded-full bg-[linear-gradient(to_right,#63c4b0_0%,#f5d52a_8%,#ffbd16_55%,#ff633c_100%)]">
                    </div>
                </div>
                <p class="p-1 max-temp w-[29.5%]">${data.dailyData.dailyMaxFeelsLike[i]}°</p>
            </div>
            <div class="relative grid grid-cols-2 w-full items-center">
                <svg class="w-4 h-4 flex justify-self-center" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" xml:space="preserve"> <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 45 90 c -18.12 0 -32.833 -14.667 -33.494 -33.391 l -0.002 -0.105 c 0 -15.42 10.55 -27.84 19.027 -37.82 c 4.985 -5.87 9.694 -11.414 11.065 -16.127 C 42.041 1.027 43.409 0 45 0 s 2.959 1.027 3.403 2.556 l 0 0 c 1.371 4.714 6.08 10.258 11.065 16.127 c 8.477 9.98 19.026 22.4 19.026 37.82 l -0.002 0.105 C 77.833 75.333 63.121 90 45 90 z M 17.504 56.451 C 18.077 71.903 30.145 84 45 84 c 14.856 0 26.923 -12.097 27.496 -27.549 c -0.025 -13.192 -9.361 -24.184 -17.6 -33.883 C 50.951 17.924 47.383 13.723 45 9.585 c -2.383 4.138 -5.951 8.339 -9.896 12.983 C 26.866 32.267 17.529 43.259 17.504 56.451 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,183,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>
                <p class="">${data.dailyData.dailyPrepProbability[i]}%</p>
            </div>
        </div>`;
    }
}


async function main() {

    // showSkeletonLoader(true);

    const data = await getWeatherData("Mumbai");

    console.log(data.dailyData);
    if (!data) {
        return;
    }
    
    // hideSkeletonLoader(false);
    
    setHeroSectionData(data.Current);
    setWAGData(data.Current);
    setUIData(data.Current);
    setHourlyData(data);
    setDailyFC(data);
    setTempBar();
    temo_ov_linegraph(data);
    windChart(data);
    updateDynamicTheme(data.Current.cWeatherConditionTheme);
    setWeatherCardBG(data.Current.cWeatherConditionTheme);
    currentThemeMode = "Dynamic Mode";
    weatherOptions(data.Current.cWeatherConditionTheme);
    getCityInput();
}
main();



function showSideBar() {
    const hamBtn = document.querySelector(".hamburgurBtn");
    const crossBtn = document.querySelector(".crossBtn");
    const sideBar = document.querySelector(".sideBar");
    hamBtn.addEventListener("click", () => {
        sideBar.style.left = "0";
        sideBar.style.opacity = "100%";
        console.log("Hamburgur Clicked");
    });

    crossBtn.addEventListener("click", () => {
        sideBar.style.left = "-200px";
        sideBar.style.opacity = "0";
        console.log("Cross Clicked");
    });
}
showSideBar();


function caltempdiff(min, max) {
    let tempDiff = Number(max) - Number(min);
    if (tempDiff >= 9) {
        tempDiff = 9;
        return tempDiff;
    }
    return tempDiff + 1;
}

function setTempBar() {
    const tempBars = document.querySelectorAll(".tempBar");
    // const minTemp = document.querySelectorAll(".min-temp").innerHTML.split("°")[0];
    // const maxTemp = document.querySelectorAll(".max-temp").innerHTML.split("°")[0];
    const minTemps = document.querySelectorAll(".min-temp");
    const maxTemps = document.querySelectorAll(".max-temp");
    let index = 0;
    tempBars.forEach(tempbar => {
        // console.log(minTemps[index].innerHTML.split("°")[0]);
        // console.log(maxTemps[index].innerHTML.split("°")[0]);
        const tempdiff = caltempdiff(minTemps[index].innerHTML.split("°")[0], maxTemps[index].innerHTML.split("°")[0]);
        tempbar.style.width = `${tempdiff * 10}%`;
        index += 1;
    });
}
setTempBar();


function temo_ov_linegraph(data) {
    document.querySelector('.tov-line-chart').innerHTML = "";
    var chartOptions = {
        chart: {
            height: 400,
            type: 'line',
            fontFamily: 'Helvetica, Arial, sans-serif',
            foreColor: '#6E729B',
            toolbar: {
                show: false,
            },
        },
        colors: ['#FA7C16', '#567AFC'],
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        series: [
            {
                name: 'Feels Like (°C)',
                data: data.hourlyData.hourlyApparentTemp.slice(0,13),
            },
            {
                name: 'Temperature (°C)',
                data: data.hourlyData.hourlyTemp.slice(0,13),
            },
        ],
        markers: {
            size: 6,
            strokeWidth: 0,
            hover: {
                size: 9,
            },
        },
        grid: {
            show: true,
            padding: {
                bottom: 0,
            },
        },
        
        yaxis: {
            min: 14,
            max: 36,
            tickAmount: 11,
            labels: {
                style: {
                    color: '#6E729B',
                },
                formatter: function (value) {
                    return value;
                },
            },
        },
        
        labels: data.hourlyData.hourlyTime.slice(0,13),
        xaxis: {
            tooltip: {
                enabled: false,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetY: 5,
            labels: {
                colors: '#373d3f',
            },
        },
        grid: {
            borderColor: '#D9DBF3',
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
    };

    var lineChart = new ApexCharts(document.querySelector('.tov-line-chart'), chartOptions);
    lineChart.render();
}

function windChart(data) {
    document.querySelector(".wind-graph-container").innerHTML = `<canvas id="windGustChart"></canvas>`;
    const canvas = document.getElementById("windGustChart");
    const labels = data.hourlyData.hourlyTime.slice(0,13);
    const windGusts = data.hourlyData.hourlyWindGusts.slice(0,13);
    const ctx = canvas.getContext("2d");

    // Blue gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);

    gradient.addColorStop(0, "rgba(59, 130, 246, 0.45)");
    gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.15)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Wind Gusts",
                    data: windGusts,
                    borderColor: "#3b82f6",
                    backgroundColor: gradient,
                    fill: true,
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: "#ffffff",
                    pointHoverBorderColor: "#3b82f6",
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: "index"
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: "#0f172a",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                        label: function (context) {
                            return ` Wind gust: ${context.parsed.y} km/h`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 40,
                    ticks: {
                        color: "#64748b",
                        stepSize: 10,
                        padding: 10,
                        callback: function (value) {
                            return value;
                        }
                    }
                }
            }
        }
    });
}

function getAQIInfo(aqi) {

    if (aqi <= 50) {
        return {
            status: "Good",
            color: "#16a34a"
        };
    }

    if (aqi <= 100) {
        return {
            status: "Moderate",
            color: "#eab308"
        };
    }

    if (aqi <= 150) {
        return {
            status: "Unhealthy for Sensitive Groups",
            color: "#f97316"
        };
    }

    if (aqi <= 200) {
        return {
            status: "Unhealthy",
            color: "#ef4444"
        };
    }

    if (aqi <= 300) {
        return {
            status: "Very Unhealthy",
            color: "#a855f7"
        };
    }

    return {
        status: "Hazardous",
        color: "#7e22ce"
    };
}

function updateAQI(aqi) {
    aqi = Math.max(0, Math.min(500, aqi));
    const info = getAQIInfo(aqi);

    // Update number
    document.getElementById("aqiValue").textContent = aqi;

    // Update status
    const status = document.getElementById("status");

    status.style.color = info.color;

    status.querySelector(".status-text").textContent =
        info.status;

    // Update pointer
    const pointer = document.getElementById("pointer");

    pointer.style.left = `${(aqi / 500) * 100}%`;
    pointer.style.setProperty("--pointer-color", info.color);
}


function timeToMinutes(time) {
    const [timePart, period] = time.trim().split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) {
        hours += 12;
    }
    if (period === "AM" && hours === 12) {
        hours = 0;
    }
    return hours * 60 + minutes;
}


function updateSunPosition(sunriseText, sunsetText) {

    const sunrise = timeToMinutes(sunriseText);
    const sunset = timeToMinutes(sunsetText);

    const now = new Date();

    const currentTime =
        now.getHours() * 60 +
        now.getMinutes() +
        now.getSeconds() / 60;

    // Calculate progress from sunrise → sunset
    let progress =
        (currentTime - sunrise) /
        (sunset - sunrise);

    // Keep it between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // SVG arc dimensions
    const centerX = 160;
    const centerY = 150;
    const radius = 125;

    // Convert progress to angle
    const angle = Math.PI * (1 - progress);

    // Calculate X/Y on the semicircle
    const x = centerX + radius * Math.cos(angle);

    const y = centerY - radius * Math.sin(angle);

    // Move existing sun
    document.getElementById("sunIcon").setAttribute("transform",`translate(${x} ${y}) scale(0.12) translate(-256 -256)`);
}



