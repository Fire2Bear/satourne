import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import {CommonStyle, pimTheme} from 'akeneo-design-system';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    ${CommonStyle};
    font-family: 'Lato', Helvetica Neue;
    background: white;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .firebase-emulator-warning {
    display: none;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={pimTheme}>
    <GlobalStyle />
    <App />
    </ThemeProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
