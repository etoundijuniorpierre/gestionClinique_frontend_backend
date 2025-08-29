import React, { createContext, useContext, useState } from 'react';
import Loading from './loading';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const startLoading = (key = 'default') => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  };

  const stopLoading = (key = 'default') => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  };

  const startGlobalLoading = () => {
    setGlobalLoading(true);
  };

  const stopGlobalLoading = () => {
    setGlobalLoading(false);
  };

  const isLoading = (key = 'default') => {
    return loadingStates[key] || false;
  };

  const value = {
    startLoading,
    stopLoading,
    startGlobalLoading,
    stopGlobalLoading,
    isLoading,
    globalLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {globalLoading && <Loading type="fullscreen" text="Chargement..." />}
    </LoadingContext.Provider>
  );
}; 
