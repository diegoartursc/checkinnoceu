import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { NavigationProvider } from './contexts/NavigationContext';
import AppContent from './AppContent';
import './App.css';

function App() {
  return (
    <UserProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </UserProvider>
  );
}

export default App;
