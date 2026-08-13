import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LabPage from './pages/LabPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.pathname === '/lab' ? 'lab' : 'home';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [startAudio, setStartAudio] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/lab') {
        setCurrentPage('lab');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToHome = (targetHash) => {
    setCurrentPage('home');

    if (targetHash) {
      setTimeout(() => {
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const goToLab = () => {
    setCurrentPage('lab');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">
      {currentPage === 'lab' ? (
        <LabPage onBack={goToHome} />
      ) : (
        <HomePage
          isLoading={isLoading}
          onPreloaderComplete={() => {
            setIsLoading(false);
            setStartAudio(true);
          }}
          startAudio={startAudio}
          onNavigateToLab={goToLab}
        />
      )}
    </div>
  );
}