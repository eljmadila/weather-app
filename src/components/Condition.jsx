import React from 'react'
import './Condition.css'

function Condition({ icon, detail, description }) {
  return (
    <div className='w-condition'>
      <div className='w-icon'>{icon}</div>
      <div className='w-info'>
        <span className='w-label'>{detail}</span>
        <span className='w-value'>{description}</span>
      </div>
    </div>
  )
}

export default Condition