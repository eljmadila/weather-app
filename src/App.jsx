import React, { useEffect, useState } from 'react'
import Condition from './components/Condition'
import Forecast from './components/Forecast'
import Splash from './components/Splash'
import './App.css'

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash')
  })
  const [splashFading, setSplashFading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [city, setCity] = useState('')
  const [name, setName] = useState('Nairobi')
  const [time, setTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [description, setDescription] = useState('Partly cloudy')
  const [iconData, setIconData] = useState('https://openweathermap.org/img/wn/02d@2x.png')
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [pressure, setPressure] = useState(0)
  const [windSpeed, setWindSpeed] = useState(0)
  const [forecast, setForecast] = useState([])

  useEffect(() => {
    getWeatherData('Nairobi')
  }, [])

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setSplashFading(true)
        const removeTimer = setTimeout(() => {
          setShowSplash(false)
          sessionStorage.setItem('hasSeenSplash', 'true')
        }, 600)
        return () => clearTimeout(removeTimer)
      }, 2200)

      return () => clearTimeout(timer)
    }
  }, [showSplash])

  const processForecast = (list) => {
    const grouped = {}

    list.forEach(entry => {
      const dateKey = entry.dt_txt.split(' ')[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(entry)
    })

    const dailyForecasts = Object.keys(grouped).map(dateKey => {
      const entries = grouped[dateKey]
      const temps = entries.map(entry => entry.main.temp)

      const lowTemp = Math.round(Math.min(...temps))
      const highTemp = Math.round(Math.max(...temps))

      const middayEntry = entries.find(entry => entry.dt_txt.includes('12:00:00')) || entries[0]
      const icon = `https://openweathermap.org/img/wn/${middayEntry.weather[0].icon}@2x.png`

      const dayName = new Date(entries[0].dt * 1000).toLocaleDateString('en-KE', { weekday: 'short' })

      return { day: dayName, icon, lowTemp, highTemp }
    })

    return dailyForecasts.slice(1, 6)
  }

  const getWeatherData = async (searchQuery) => {
    if (!searchQuery) return;

    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`)

      if (!response.ok) {
        throw new Error('City not found. Please check the spelling and try again.')
      }

      const data = await response.json()

      setName(data.name)
      setTemperature(data.main.temp)
      setDescription(data.weather[0].description)
      setIconData(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
      setHumidity(data.main.humidity)
      setPressure(data.main.pressure)
      setWindSpeed(data.wind.speed)
      setCity('')

      // Calculate Target City Local Time & Date accurately
      const utcTimestamp = Date.now() + (new Date().getTimezoneOffset() * 60000)
      const targetCityTimestamp = utcTimestamp + (data.timezone * 1000)
      const targetDate = new Date(targetCityTimestamp)

      setTime(targetDate.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: true }))
      setCurrentDate(targetDate.toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }))

      // Fetch 5-Day Forecast
      const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}&units=metric`)
      const forecastData = await forecastResponse.json()

      setForecast(processForecast(forecastData.list))

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    getWeatherData(city)
  }

  return (
    <div>
      {showSplash && <Splash fading={splashFading} />}

      <div className='w-search'>
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder='Search City ...' 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
          />
          <button type="submit" aria-label="Search"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>

        <div className='w-time'>
          <p>Local Time: {time}</p>
        </div>

        <div className='w-details'>
          {loading ? (
            <div className='loader'></div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div>
                <h1>{name}</h1>
                <p>{currentDate}</p>
                <h2>{Math.round(temperature)}°C</h2>
                <p>{description}</p>
              </div>
              <img id="weather-icon" src={iconData} alt="Weather Icon" />
            </>
          )}
        </div>

        <div className='w-conditions'>
          <Condition icon={<i className="fa-solid fa-wind"></i>} detail='Wind' description={`${windSpeed} km/h`} />
          <Condition icon={<i className="fa-solid fa-droplet"></i>} detail='Humidity' description={`${humidity}%`} />
          <Condition icon={<i className="fa-solid fa-temperature-empty"></i>} detail='Pressure' description={`${pressure} hPa`} />
        </div>

        <div className='w-forecast'>
          {forecast.map((day, index) => (
            <Forecast
              key={index}
              day={day.day}
              icon={day.icon}
              lowTemp={day.lowTemp}
              highTemp={day.highTemp}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default App