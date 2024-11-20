import React from 'react';
import Lottie from 'lottie-react';
import '../../styles.css';
import animationData from '../../assets/lottie/404.json'; 

function Page404() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      textAlign: 'center', 
      backgroundColor: 'var(--warm-beige)'
    }}>
      {}
      <Lottie 
        animationData={animationData} 
        loop={true} 
        style={{ width: '1280', height: '400px' }} 
      />
    </div>
  );
}

export default Page404;
