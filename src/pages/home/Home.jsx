import React, { useState, useRef } from 'react';
import Navbar from '../../components/navbar/Navbar';

function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      } else if (iframeRef.current.msRequestFullscreen) {
        iframeRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div style={{
        width: '100vw',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        position: 'relative'
      }}>
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '10px 20px',
            backgroundColor: 'rgb(222 177 136)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(140 141 109)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(222 177 136)'}
        >
          {isFullscreen ? '⛶' : '⛶'}
        </button>
        
        <iframe 
          ref={iframeRef}
          src="https://1drv.ms/p/c/4c10e93f5947104d/IQS8wf5C2qa2Qr0CHScSn5ksAT2wqC8V52Fv-E-_Z7otC08"
          title="Interactive Presentation"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          allowFullScreen
        />
      </div>
    </>
  );
}

export default Home;