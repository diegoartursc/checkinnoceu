import React from 'react';
import { AppStateProvider } from './context/AppStateContext';
import CheckInApp from './app/CheckInApp';
import './App.css';

function App() {
  return (
    <AppStateProvider>
      <CheckInApp />
    </AppStateProvider>
  );
}

export default App;
