import { useState, useEffect } from 'react';

function getScreenDimensions() {
  const { innerWidth: ScreenWidth, innerHeight: ScreenHeight } = window;
  
  return {
    ScreenWidth,
    ScreenHeight
  };
}

export default function useScreenDimensions() {
  const [ScreenDimensions, setScreenDimensions] = useState(getScreenDimensions());

  const handleResize = () => {
    setScreenDimensions(getScreenDimensions());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return ScreenDimensions;
}