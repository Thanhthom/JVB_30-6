import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Define types for weather data
interface CurrentWeatherData {
  city: string
  time: string
  temperature: number
  condition: string
  iconCode: number
  isDay: 0 | 1
  humidity: number
  windSpeed: number
}

interface ForecastDay {
  date: string
  avgTemp: number
  condition: string
  iconCode: number
  avgHumidity: number
}

interface WeatherData {
  current: CurrentWeatherData
  forecast: ForecastDay[]
}

interface WeatherState {
  weatherData: WeatherData | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: WeatherState = {
  weatherData: null,
  status: "idle",
  error: null,
}

// Mock weather data to replace the API call
export const fetchWeather = createAsyncThunk<
  WeatherData, // Return type of the fulfilled action
  string, // Type of the first argument to the payload creator (city)
  { rejectValue: string } // Type for the thunkAPI.rejectWithValue
>("weather/fetchWeather", async (city, { rejectWithValue }) => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Static mock data for different cities
    const mockData: { [key: string]: WeatherData } = {
      London: {
        current: {
          city: "London",
          time: "2020-11-23 17:05", // Example time
          temperature: 72, // Fahrenheit
          condition: "Cloudy",
          iconCode: 1006, // Cloudy icon code
          isDay: 1, // Day
          humidity: 45,
          windSpeed: 19.2, // MPH
        },
        forecast: [
          {
            date: "2020-11-23",
            avgTemp: 70,
            condition: "Cloudy",
            iconCode: 1006,
            avgHumidity: 30,
          },
          {
            date: "2020-11-24",
            avgTemp: 68,
            condition: "Partly cloudy",
            iconCode: 1003,
            avgHumidity: 36,
          },
          {
            date: "2020-11-25",
            avgTemp: 75,
            condition: "Sunny",
            iconCode: 1000,
            avgHumidity: 20,
          },
          {
            date: "2020-11-26",
            avgTemp: 78,
            condition: "Sunny",
            iconCode: 1000,
            avgHumidity: 15,
          },
        ],
      },
      Hanoi: {
        current: {
          city: "Hanoi",
          time: "2025-07-20 10:30",
          temperature: 90,
          condition: "Hot and Humid",
          iconCode: 1000, // Sunny
          isDay: 1,
          humidity: 80,
          windSpeed: 5.0,
        },
        forecast: [
          {
            date: "2025-07-20",
            avgTemp: 88,
            condition: "Hot and Humid",
            iconCode: 1000,
            avgHumidity: 75,
          },
          {
            date: "2025-07-21",
            avgTemp: 85,
            condition: "Rainy",
            iconCode: 1183,
            avgHumidity: 90,
          },
          {
            date: "2025-07-22",
            avgTemp: 87,
            condition: "Partly Cloudy",
            iconCode: 1003,
            avgHumidity: 70,
          },
          {
            date: "2025-07-23",
            avgTemp: 89,
            condition: "Sunny",
            iconCode: 1000,
            avgHumidity: 65,
          },
        ],
      },
      "New York": {
        current: {
          city: "New York",
          time: "2025-07-20 08:00",
          temperature: 78,
          condition: "Clear",
          iconCode: 1000,
          isDay: 1,
          humidity: 60,
          windSpeed: 10.5,
        },
        forecast: [
          {
            date: "2025-07-20",
            avgTemp: 77,
            condition: "Clear",
            iconCode: 1000,
            avgHumidity: 55,
          },
          {
            date: "2025-07-21",
            avgTemp: 75,
            condition: "Cloudy",
            iconCode: 1006,
            avgHumidity: 65,
          },
          {
            date: "2025-07-22",
            avgTemp: 70,
            condition: "Rain",
            iconCode: 1183,
            avgHumidity: 80,
          },
          {
            date: "2025-07-23",
            avgTemp: 72,
            condition: "Partly Cloudy",
            iconCode: 1003,
            avgHumidity: 70,
          },
        ],
      },
    }

    const data = mockData[city]
    if (!data) {
      return rejectWithValue(`Weather data for "${city}" not found in mock data. Try London, Hanoi, or New York.`)
    }

    return data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.status = "succeeded"
        state.weatherData = action.payload
      })
      .addCase(fetchWeather.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = "failed"
        state.error = action.payload || "An unknown error occurred."
        state.weatherData = null
      })
  },
})

export default weatherSlice.reducer
