import React from 'react';

const PasswordStrengthMeter = (props) => {

  const { pwdStrength } = props;

  return (
      <div className='strength-meter mt-2 visible' >
        <div 
          className='strength-meter-fill'
          data-strength={ pwdStrength }
        >         
        </div>
      </div>
    )
  
}

export default PasswordStrengthMeter;