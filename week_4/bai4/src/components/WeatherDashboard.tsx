"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchWeather } from "../features/weather/weatherSlice"
import type { RootState, AppDispatch } from "../app/store" 
import {
  Sun,
  Cloud,
  CloudRain,
  HelpCircle,
  Loader2,
  CloudSun,
  CloudFog,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  Cloudy,
  Moon,
  CloudMoon,
  type LucideIcon,
} from "lucide-react"

// Mapping WeatherAPI condition codes to Lucide React icons.
const getIconComponent = (iconCode: number, isDay: 0 | 1): LucideIcon => {
  const iconMap: { [key: number]: LucideIcon } = {
    // Clear/Sunny
    1000: isDay === 1 ? Sun : Moon,
    // Partly Cloudy
    1003: isDay === 1 ? CloudSun : CloudMoon,
    // Cloudy
    1006: Cloud,
    1009: Cloudy, // Overcast
    // Mist/Fog
    1030: CloudFog, // Mist
    1135: CloudFog, // Fog
    1147: CloudFog, // Freezing fog
    // Rain
    1063: CloudRain, // Patchy light rain
    1150: CloudDrizzle, // Light drizzle
    1153: CloudDrizzle, // Patchy light drizzle
    1180: CloudRain, // Patchy light rain
    1183: CloudRain, // Light rain
    1186: CloudRain, // Moderate rain at times
    1189: CloudRain, // Moderate rain
    1192: CloudRain, // Heavy rain at times
    1195: CloudRain, // Heavy rain
    1240: CloudRain, // Light rain shower
    1243: CloudRain, // Moderate or heavy rain shower
    1246: CloudRain, // Torrential rain shower
    // Snow/Sleet
    1066: CloudSnow, // Patchy light snow
    1069: CloudSnow, // Patchy light sleet
    1072: CloudDrizzle, // Patchy freezing drizzle
    1168: CloudDrizzle, // Freezing drizzle
    1171: CloudDrizzle, // Heavy freezing drizzle
    1210: CloudSnow, // Patchy light snow
    1213: CloudSnow, // Light snow
    1216: CloudSnow, // Patchy moderate snow
    1219: CloudSnow, // Moderate snow
    1222: CloudSnow, // Patchy heavy snow
    1225: CloudSnow, // Heavy snow
    1255: CloudSnow, // Light snow showers
    1258: CloudSnow, // Moderate or heavy snow showers
    // Thunder
    1087: CloudLightning, // Thundery outbreaks in nearby
    1279: CloudLightning, // Patchy light snow with thunder
    1282: CloudLightning, // Moderate or heavy snow with thunder
  }
  return iconMap[iconCode] || HelpCircle
}

function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return date.toLocaleString("en-US", options)
}

function formatDateForForecast(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  return date.toLocaleString("en-US", options)
}

function WeatherDisplay() {
  const dispatch: AppDispatch = useDispatch()
  const { current: currentWeatherData, forecast: forecastData } = useSelector(
    (state: RootState) => state.weather.weatherData || { current: undefined, forecast: undefined },
  )
  const status = useSelector((state: RootState) => state.weather.status)
  const error = useSelector((state: RootState) => state.weather.error)
  const [cityInput, setCityInput] = useState<string>("London") // Default to London as per screenshot

  useEffect(() => {
    dispatch(fetchWeather(cityInput))
  }, [dispatch, cityInput]) // Added cityInput to dependency array for re-fetch on input change

  const handleSearch = () => {
    if (cityInput.trim()) {
      dispatch(fetchWeather(cityInput.trim()))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const CurrentWeatherIcon = currentWeatherData
    ? getIconComponent(currentWeatherData.iconCode, currentWeatherData.isDay)
    : HelpCircle

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Current Weather */}
      <div className="flex flex-col items-start">
        <div className="mb-6 w-full">
          <label htmlFor="city-input" className="text-gray-600 text-sm font-medium mb-2 block">
            Your city
          </label>
          <div className="flex gap-2">
            <input
              id="city-input"
              type="text"
              value={cityInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCityInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={status === "loading"}
            >
              {status === "loading" ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Search"}
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center w-full h-48 text-gray-600">
            <Loader2 className="animate-spin mb-2" size={48} />
            <p>Loading weather data...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="text-red-500 font-medium w-full h-48 flex items-center justify-center">
            <p>Error: {error}</p>
          </div>
        )}

        {status === "succeeded" && currentWeatherData && (
          <>
            <p className="text-gray-500 text-sm mb-4">{formatDateTime(currentWeatherData.time)}</p>
            <div className="flex items-center gap-4 mb-4">
              <CurrentWeatherIcon size={80} className="text-gray-800" />
              <h3 className="text-6xl font-extrabold text-gray-900">
                {currentWeatherData.temperature}
                <sup className="text-3xl align-super">°F</sup>
              </h3>
            </div>
            <p className="text-2xl font-semibold text-gray-700 mb-6">{currentWeatherData.condition}</p>

            <div className="flex justify-between w-full text-gray-600 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-medium">Humidity</span>
                <span className="text-lg font-bold text-gray-800">{currentWeatherData.humidity}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">Wind speed</span>
                <span className="text-lg font-bold text-gray-800">{currentWeatherData.windSpeed} km/j</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Column: Temperature Graph and Forecast */}
      <div className="flex flex-col items-start">
        <h4 className="text-gray-600 text-sm font-medium mb-4">Temperature</h4>
        {/* Placeholder for Temperature Graph */}
        <div className="w-full h-32 bg-blue-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
          {/* Simple SVG to mimic the wave graph */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 50 C 75 20, 150 80, 225 40, 300 70" stroke="#60A5FA" strokeWidth="3" fill="url(#gradient)" />
            <circle cx="75" cy="35" r="4" fill="#60A5FA" /> {/* Example point */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100">
                <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute top-4 left-4 text-blue-600 font-bold text-xl">
            {currentWeatherData?.temperature}°F
          </span>
        </div>

        {status === "succeeded" && forecastData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {forecastData.slice(0, 4).map((day, index) => {
              const ForecastIcon = getIconComponent(day.iconCode, 1) // Assume day icons for forecast
              const isToday = index === 0
              return (
                <div
                  key={day.date}
                  className={`p-4 rounded-lg flex flex-col items-center text-center ${
                    isToday ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <span className="text-sm font-medium mb-2">
                    {isToday ? "Today" : formatDateForForecast(day.date)}
                  </span>
                  <ForecastIcon size={32} className={`mb-2 ${isToday ? "text-white" : "text-gray-600"}`} />
                  <span className="text-xs font-medium">Humidity</span>
                  <span className="text-lg font-bold">{day.avgHumidity}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherDisplay
