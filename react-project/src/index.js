import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import './css/index.css';
import App from './App';
import * as serviceWorker from "./serviceWorker";

export const API_URL = "http://localhost:3000/api/v1";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);

serviceWorker.unregister();
