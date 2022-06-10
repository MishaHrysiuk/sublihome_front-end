import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtInterceptor } from './helpers/jwt-interceptor';

axios.defaults.baseURL = 'https://localhost:5001'
jwtInterceptor();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);