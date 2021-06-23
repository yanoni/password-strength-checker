///////////////////////////////////////////////////////////////////////////////
//
//  Password Strength Checker in React JS
//
//  Developed by Anthony Yan
//  June 13, 2021
//
///////////////////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from 'react';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import './App.scss';

const App = () => {
  const [ password, setPassword ] = useState('');
  const [ pwdStrength, setPwdStrength ] = useState(-1);
  const [ isPasswordShown, setIsPasswordShown ] = useState(true);
  
  const pwdStrengthStr = ['very weak!', 'weak!', 'fair/medium.', 'strong.', 'very strong.'];
  
  // Determine password strength through an API
  const [ pwdStrData, setPwdStrData ] = useState({});
  useEffect(() => {
    if (!password) {
      setPwdStrength(-1);
      return;
    }

    const url = 'https://o9etf82346.execute-api.us-east-1.amazonaws.com/staging/password/strength'
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'password': password })
    };    

    const calculatePasswordStrength = async () => {
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setPwdStrData(data);
        setPwdStrength(data.score);
      }
      catch(error) {
        console.error(error);
      }
    }
    calculatePasswordStrength();
  }, [password]);
    
  const handleChange = ({ target }) => {
    setPassword(target.value);
  }

  const togglePasswordVisibility = () => {
    setIsPasswordShown(isPasswordShown ? false : true );
  }

  const { guessTimeString, warning, suggestions } = pwdStrData;

  const meterScore = password ? pwdStrength : -1;  // Meter all grayed out if password blank
  const warningTxt = warning ? warning : '';
  const suggestionsTxt = suggestions ? suggestions.join('  ').trim() : '';

  // Build informational display about password strength
  let pwdInfoDisplay = <div></div>;
  if (password && (pwdStrength >= 0 && pwdStrength <= 4)) {
    pwdInfoDisplay = (
      <div>
        <br />
        <p className='bold-font' >Your password is {pwdStrengthStr[pwdStrength]}</p>
        <br />
        <p>{`It will take ${guessTimeString} to guess your password.  ${warningTxt}`}</p>
        <p className='bold-font' >{suggestionsTxt}</p>
        <br />
      </div>
    );
  }

  return (
    <div className='main-container d-block m-auto'>
      <div>        
        <h3>Is your password</h3>
        <h3>strong enough?</h3>
      </div>
      <br />
      <div className='pwd-container'>
        <input
          type={isPasswordShown ? 'text' : 'password'}
          placeholder='Type a password'
          value={password}
          onChange={handleChange}
        />
        <button className='showToggle' onClick={togglePasswordVisibility} >
          {isPasswordShown ? 'hide' : 'show'}
        </button>
        <PasswordStrengthMeter pwdStrength={meterScore} />
      </div>
      {pwdInfoDisplay}      
    </div>
  );
}

export default App;