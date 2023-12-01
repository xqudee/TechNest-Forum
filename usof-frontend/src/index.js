import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store/store.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { CookiesProvider } from 'react-cookie';
import ReduxToast from './providers/ReduxToastr';
import {AuthProvider} from './providers/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <CookiesProvider>
      <Provider store={store}>
          <ReduxToast />
          <AuthProvider>
            <Routes>
              <Route path='/*' element={<App />} />
            </Routes>
          </AuthProvider>
      </Provider>
    </CookiesProvider>
  </BrowserRouter>
);

// reportWebVitals();
