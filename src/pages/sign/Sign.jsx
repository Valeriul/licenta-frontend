import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { useLocation, useNavigate } from 'react-router-dom';
import 'uikit/dist/css/uikit.min.css';
import '../../styles.css';
import './sign.css';

import RegisterContainer from '../../containers/sign/RegisterContainer';
import LoginContainer from '../../containers/sign/LoginContainer';

function Sign() {
  const [isLogin, setIsLogin] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const location = useLocation();

  // Schimbă starea în funcție de ruta curentă
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/signin') {
      setIsLogin(true);
    } else if (location.pathname === '/register' || location.pathname === '/signup') {
      setIsLogin(false);
    }
  }, [location]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className='uk-flex uk-height-1-1'>
      <div className='uk-width-1-2 blurred-background'>
      </div>
      <div
        className='uk-width-1-2'
        style={{
          background: 'linear-gradient(90deg, #946b42, #ffefd4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div className="uk-flex uk-position-center uk-height-1-1 uk-flex-center uk-flex-middle"
          style={{ width: "100vw" }}>
          <div className='uk-width-1-1 flip-container'>
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">

              {/* Register Container */}
              <div key="front" className="flip-card">
                {!isLogin ? (
                  <RegisterContainer onLoginClick={handleFlip} />
                ) : (
                  <LoginContainer onRegisterClick={handleFlip} />
                )}
              </div>

              {/* Login Container */}
              <div key="back" className="flip-card">
                {isLogin ? (
                  <RegisterContainer onLoginClick={handleFlip} />
                ) : (
                  <LoginContainer onRegisterClick={handleFlip} />
                )}
              </div>
            </ReactCardFlip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sign;
