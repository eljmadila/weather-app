import React from 'react'
import './Splash.css'

function Splash({ fading }) {
  return (
    <div className={`splash-container ${fading ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-icon-wrapper">
          <i className="fa-solid fa-cloud-sun splash-icon"></i>
        </div>
        <h1 className="splash-title">Weather Forecast</h1>
        <p className="splash-subtitle">Getting latest weather data...</p>
        <div className="splash-progress-track">
          <div className="splash-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}

export default Splash
