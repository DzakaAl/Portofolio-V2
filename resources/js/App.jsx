import React, { useState, useEffect } from 'react';
import HomePage from './pages/home';
import LabPage from './pages/project';
import LoginPage from './pages/login';
import AdminPage from './pages/admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      return localStorage.getItem('admin_token') ? 'admin' : 'login';
    }
    if (path === '/login') {
      return 'login';
    }
    if (path === '/lab') {
      return 'lab';
    }
    return 'home';
  });

  const [isLoading, setIsLoading] = useState(true);
  const [startAudio, setStartAudio] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage(localStorage.getItem('admin_token') ? 'admin' : 'login');
      } else if (path === '/login') {
        setCurrentPage('login');
      } else if (path === '/lab') {
        setCurrentPage('lab');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page, path) => {
    setCurrentPage(page);
    if (path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo(0, 0);
  };

  const goToHome = (targetHash) => {
    navigateTo('home', '/');
    if (targetHash) {
      setTimeout(() => {
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">
      {currentPage === 'admin' ? (
        <AdminPage
          onLogout={() => navigateTo('login', '/login')}
          onBackHome={() => goToHome()}
        />
      ) : currentPage === 'login' ? (
        <LoginPage
          onLoginSuccess={() => navigateTo('admin', '/admin')}
        />
      ) : currentPage === 'lab' ? (
        <LabPage onBack={goToHome} />
      ) : (
        <HomePage
          isLoading={isLoading}
          onPreloaderComplete={() => {
            setIsLoading(false);
            setStartAudio(true);
          }}
          startAudio={startAudio}
          onNavigateToLab={() => navigateTo('lab', '/lab')}
        />
      )}
    </div>
  );
}