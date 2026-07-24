import React from 'react'
import './Forecast.css'

function Forecast({ day, icon, dayTemp, lowTemp, highTemp }) {
  return (
    <div className='forecast'>
      <div className='forecast-details'>
        <h3>{day}</h3>
        {dayTemp && <p>{dayTemp}</p>}
      </div>
      
      <img className='forecast-icon' src={icon} alt={`${day} weather icon`} />
      
      <div className='forecast-temp'>
        <p className='low-temp'>
          <i className="fa-solid fa-temperature-arrow-down"></i> {lowTemp}°C
        </p>
        <p className='high-temp'>
          <i className="fa-solid fa-temperature-arrow-up"></i> {highTemp}°C
        </p>
      </div>
    </div>
  )
}

export default Forecast