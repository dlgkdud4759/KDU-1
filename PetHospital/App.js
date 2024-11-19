import React from 'react';
import { ThemeProvider } from 'styled-components';
import GoogleMaps from './components/GoogleMaps';

const theme = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    primary: '#007BFF',
    secondary: '#6C757D',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GoogleMaps />
    </ThemeProvider>
  );
}

export default App;
