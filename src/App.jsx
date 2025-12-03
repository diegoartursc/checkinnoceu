import React from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { NavigationProvider } from './contexts/NavigationContext';
import AppContent from './AppContent';
import './App.css';

function App() {
  return (
    <AppStateProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AppStateProvider>
  );
}

export default App;
